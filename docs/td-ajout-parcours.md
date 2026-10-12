# TD — Ajout d'un parcours

## Architecture

```
features/parcours/
├── ParcoursPage.tsx              la page : affiche la liste
├── components/
│   ├── AddParcoursModal.tsx      bouton + fenêtre de création
│   └── ParcoursTable.tsx         tableau des parcours
└── services/
    └── parcoursService.ts        appels au backend (GET et POST /api/parcours)
```

- La **page** affiche la liste et ses états : chargement, erreur, liste vide.
- Les **composants** gèrent l'affichage et le formulaire.
- Le **service** est le seul fichier qui communique avec le backend.
- Les composants d'interface viennent de **shadcn/ui** (`components/ui`).

## Échange avec le backend

| Requête | Envoi | Réponse |
| --- | --- | --- |
| `GET /api/parcours` | rien | la liste des parcours |
| `POST /api/parcours` | `{ nomParcours, anneeFormation }` | `{ message, parcours }`, ou `{ error }` en cas d'échec |

Après une création réussie, la liste est rechargée automatiquement grâce à TanStack Query (`invalidateQueries`).

## Choix techniques

| Besoin | Choix | Pourquoi |
| --- | --- | --- |
| Interface | shadcn/ui | Composants accessibles (Radix) et cohérents avec Tailwind, déjà utilisé |
| Modale | `Dialog` de shadcn | Échap, clic extérieur et focus gérés |
| Formulaire | `useState` | Deux champs seulement |
| Validation | Conditions simples | Nom obligatoire, année M1 ou M2 obligatoire |
| Appels API | `apiFetch` du projet (fetch) | Déjà présent, pas besoin d'Axios |
| Liste et rechargement | TanStack Query | Déjà installé, recharge la liste après création |
| Notification | Sonner | Message de succès en une ligne : `toast.success(...)` |

## Comportement

| Situation | Comportement |
| --- | --- |
| Ouverture | La fenêtre s'ouvre, le curseur est dans le champ Nom |
| Annulation | Fenêtre fermée, rien n'est envoyé, formulaire vidé |
| Champs manquants | Message sous chaque champ, aucune requête envoyée |
| Enregistrement en cours | Bouton « Enregistrement… » désactivé, fermeture bloquée |
| Succès | Fenêtre fermée, notification, parcours visible dans la liste |
| Échec | Message d'erreur, saisie conservée, on peut réessayer |

## Limites

- Pas de vérification des doublons (le backend ne la fait pas non plus).
- Les messages d'erreur ne précisent pas la cause exacte.
- Pas de modification ni de suppression de parcours.

## Vérifications

- `bun run check` : lint, typage, 9 tests (dont 3 sur le service) et build.
- Scénarios testés dans le navigateur : ouverture, annulation, champs vides, échec serveur, enregistrement en cours, succès, création au clavier.
