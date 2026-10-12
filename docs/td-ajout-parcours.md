# TD — Ajout d'un parcours : justification des choix

## 1. Architecture

Le code suit le découpage du projet existant : `components/` pour l'UI générique, `features/<domaine>/` pour le métier, `lib/` pour le transport HTTP.

```
src/
├── lib/api.ts                      apiFetch (existant) + apiJson + ApiError
├── components/ui/                  composants shadcn/ui (code copié dans le projet)
│   ├── button, input, label        formulaires
│   ├── dialog                      modale (Radix Dialog)
│   ├── radio-group                 choix M1 / M2 (Radix RadioGroup)
│   ├── table, badge, skeleton      liste
│   └── alert, sonner               messages d'erreur et notifications
└── features/parcours/              organisation MVC à l'intérieur de la feature
    ├── model/                      données et règles métier, aucun JSX
    │   ├── parcours.types.ts       contrat avec l'API (miroir du modèle back)
    │   ├── parcours.schema.ts      validation Zod (formulaire ET réponses)
    │   ├── parcours.api.ts         seul fichier qui connaît les URLs
    │   └── parcours.queries.ts     hooks TanStack Query + clés de cache
    ├── controller/                 logique d'interaction, aucun JSX
    │   ├── useParcoursForm.ts      état + validation du formulaire
    │   ├── useCreateParcoursController.ts  soumission, abandon, blocage pendant l'envoi
    │   └── useParcoursPageController.ts    liste, ouverture de la modale, toast de succès
    └── view/                       affichage uniquement
        ├── ParcoursPage.tsx
        ├── ParcoursTable.tsx
        ├── ParcoursFormFields.tsx
        └── CreateParcoursDialog.tsx
```

Chaque couche a une seule raison de changer :

| Couche | Responsabilité | Change si… |
| --- | --- | --- |
| `lib/api.ts` | HTTP → JSON ou `ApiError` | on ajoute une authentification |
| `parcours.api.ts` | URLs, format des requêtes, validation des réponses | l'API évolue |
| `parcours.queries.ts` | cache, invalidation | la stratégie de rafraîchissement change |
| `parcours.schema.ts` + `useParcoursForm` | règles métier de saisie | une règle de validation change |
| `controller/` | règles d'interaction (quand fermer, confirmer, bloquer) | le comportement de l'interface change |
| composants | affichage | le design change |

Le dépôt est organisé par fonctionnalités : MVC est appliqué *à l'intérieur* de `features/parcours/` pour rester cohérent avec le projet. Une vue ne fait jamais de `fetch` et ne contient aucune règle : elle lit l'état de son contrôleur et lui transmet les clics. Le contrôleur utilise le modèle, et le modèle seul parle au serveur.

**Réutilisation prévue**
- Les composants shadcn de `components/ui` (`Dialog`, `Button`, `Input`, `RadioGroup`, `Table`…) et `toast` de Sonner serviront tels quels aux CRUD UEs et Étudiants. D'autres s'ajoutent avec `bunx shadcn@latest add <nom>`.
- `ParcoursFormFields` et `useParcoursForm({ initialValues })` sont prêts pour la modification d'un parcours. Il suffira de créer une `EditParcoursDialog` avec une mutation `PUT`.
- `apiJson` et `ApiError` sont partagés par toutes les features.

**États de l'interface**
- Données serveur : gérées par TanStack Query, déjà présent dans le projet (`isPending`, `isError`, `isFetching`, `isPending` de la mutation).
- État local : simple `useState`, pour l'ouverture de la modale, la saisie et la confirmation d'abandon.
- Pas de store global : rien ne le justifie ici.

**Données échangées**
- Requête `POST /api/parcours` : `{ nomParcours: string, anneeFormation: 1 | 2 }`.
- Réponse 201 : `{ message, parcours }`. Erreur 400 ou 500 : `{ error }`.
- Le formulaire manipule `anneeFormation` sous forme de chaîne `"1" | "2"` (valeur d'un radio). La conversion en nombre se fait à la frontière, dans `validateParcoursForm`.

## 2. Choix techniques

| Besoin | Choix | Pourquoi |
| --- | --- | --- |
| Composants d'interface | shadcn/ui | Le code des composants est copié dans `components/ui` : on le lit et on le modifie, ce n'est pas une boîte noire. Ils reposent sur Radix (accessibilité testée) et sur Tailwind, déjà utilisé par le projet. |
| Modale | `Dialog` de shadcn (Radix) | Piège du focus, Échap, clic extérieur et rôle `dialog` sont fournis. `onOpenChange` transmet chaque demande de fermeture au contrôleur, qui décide (fermer, confirmer, ignorer pendant l'envoi). |
| Formulaire | `useState` dans un hook dédié | Deux champs seulement : React Hook Form ajouterait une API à apprendre sans gain réel. Le hook isole la logique, ce qui permettra de migrer plus tard si les formulaires grossissent. |
| Validation | Zod (déjà installé) | Les règles sont déclaratives et lisibles. On utilise `z.enum(["1","2"])` et non une longueur de chaîne. Le même outil valide les réponses du serveur, car un type TypeScript ne vérifie rien à l'exécution. |
| API | Fetch via le helper `apiFetch` existant | On conserve le helper testé et on ajoute seulement la gestion des erreurs HTTP. Axios n'apporterait rien ici. |
| Données serveur | TanStack Query (déjà installé) | Cache, états de chargement et invalidation après mutation, ce qui affiche le nouveau parcours sans recharger la page. |
| Notifications | Sonner (composant `sonner` de shadcn) | C'est le composant de notification recommandé par shadcn : un appel `toast.success(...)` suffit, sans Provider à écrire. |
| Styles | Tailwind (déjà utilisé) + thème shadcn | Variables de couleur shadcn dans `index.css` (`--primary`, `--destructive`…), cohérentes sur tous les composants. |

**Pas de mise à jour optimiste.** Le `onSuccess` de la mutation renvoie la promesse d'invalidation. Le bouton reste donc en « Enregistrement… » jusqu'au rechargement de la liste, et quand la modale se ferme, le parcours est déjà affiché à sa place dans le tri du serveur. Une mise à jour optimiste aurait imposé un rollback en cas d'échec, sans réel gain pour une création ponctuelle.

## 3. Choix UX/UI

| Situation | Comportement |
| --- | --- |
| Accès | Bouton principal « + Nouveau parcours » en haut à droite. Il est aussi proposé dans l'état vide de la liste. |
| Ouverture | Le focus est placé directement dans le champ Nom. |
| Année | Deux cartes radio M1 / M2, toutes deux visibles, au lieu d'un `<select>`. Il n'y a volontairement pas de valeur par défaut, pour éviter de créer un M1 par erreur (le back met 1 si l'année manque). |
| Saisie incomplète | Pas d'erreur tant qu'on n'a pas tenté d'envoyer. Ensuite, les messages se mettent à jour pendant la correction, le focus va au premier champ fautif et aucune requête n'est envoyée. |
| Doublon | Même nom (casse et espaces ignorés) pour la même année : l'envoi est bloqué avec un message clair. |
| Annuler / Échap / clic sur le fond / × | Fermeture directe si rien n'est saisi. Sinon, une confirmation « Abandonner la création ? » s'affiche, avec le focus sur « Continuer la saisie », qui est l'option sans perte. |
| En cours | Le bouton affiche un spinner et « Enregistrement… », les champs sont désactivés, et Échap et le clic sur le fond sont ignorés. Le double envoi est donc impossible. |
| Succès | La modale se ferme, un toast affiche le nom et l'année, et la nouvelle ligne est surlignée avec un badge « Nouveau ». Le focus revient sur le bouton d'origine. |
| Échec | La modale reste ouverte et la saisie est conservée. Un message explique la cause (serveur injoignable, données refusées, erreur serveur) et le bouton devient « Réessayer ». |
| Réouverture | Le formulaire est vide : le composant est démonté à la fermeture. |

**Accessibilité**
- Labels reliés aux champs.
- `aria-invalid` et `aria-describedby` sur les erreurs.
- `role="alert"` pour l'échec.
- Notifications annoncées par les lecteurs d'écran (Sonner).
- Boutons-icônes nommés.
- Parcours entièrement réalisable au clavier.
- `prefers-reduced-motion` respecté.

## 4. Limites et améliorations possibles

- Le backend ne vérifie pas les doublons : le contrôle côté client ne protège pas contre deux créations simultanées. Il faudrait une contrainte `UNIQUE(nomParcours, anneeFormation)` et une réponse 409 à afficher sur le champ.
- Le backend accepte toute valeur d'`anneeFormation` et renvoie 500 au lieu de 400 en cas d'échec SQL. Il faudrait une validation Zod côté serveur avec des erreurs par champ.
- Les messages d'erreur du serveur sont en anglais. Il faudrait des codes d'erreur stables à traduire côté front.
- Il n'y a pas de test de composant (React Testing Library) dans la suite `bun test`. Les scénarios utilisateur ont été vérifiés dans un navigateur, mais pas de manière automatisée dans le dépôt (Playwright serait l'étape suivante).
- Le toast n'a pas d'action « Voir » ou « Annuler », et la liste n'est ni paginée ni filtrable.

## Vérifications effectuées

- `bun run check` : lint, typecheck front et back, 15 tests (dont 9 nouveaux dans `tests/parcours.test.ts`) et build.
- 28 scénarios rejoués dans Chromium : ouverture et focus, annulation, formulaire vide, confirmation d'abandon, échec 500 avec saisie conservée, état en cours, succès avec toast et ligne surlignée, réouverture vide, doublon, parcours complet au clavier, console sans erreur.
