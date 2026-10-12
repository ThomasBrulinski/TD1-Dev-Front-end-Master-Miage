import { z } from "zod"
import type { AnneeFormation, CreateParcoursPayload, Parcours } from "./parcours.types"

export const NOM_PARCOURS_MAX = 100

/* ------------------------------------------------------------------ */
/* Formulaire de création                                              */
/* ------------------------------------------------------------------ */

/** État brut du formulaire : ce que l'utilisateur a saisi, pas encore validé. */
export type ParcoursFormValues = {
  nomParcours: string
  /** Chaîne vide tant que l'utilisateur n'a pas choisi. */
  anneeFormation: "" | "1" | "2"
}

export const emptyParcoursForm: ParcoursFormValues = {
  nomParcours: "",
  anneeFormation: "",
}

const normalize = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLocaleLowerCase("fr")

/**
 * Schéma de validation du formulaire.
 * `existing` (la liste déjà chargée) permet de refuser un doublon
 * nom + année avant même d'appeler le serveur, qui ne le vérifie pas.
 */
export const createParcoursFormSchema = (existing: readonly Parcours[] = []) =>
  z
    .object({
      nomParcours: z
        .string()
        .trim()
        .min(1, "Le nom du parcours est obligatoire.")
        .max(
          NOM_PARCOURS_MAX,
          `Le nom ne doit pas dépasser ${NOM_PARCOURS_MAX} caractères.`
        ),
      // z.enum et non z.string().min(1).max(2) : seules les valeurs "1" et "2"
      // sont acceptées, "9" ou "" sont refusées.
      anneeFormation: z.enum(["1", "2"], {
        error: "Choisissez l'année de formation : M1 ou M2.",
      }),
    })
    .superRefine((values, ctx) => {
      const annee = Number(values.anneeFormation)
      const duplicate = existing.some(
        (parcours) =>
          parcours.anneeFormation === annee &&
          normalize(parcours.nomParcours) === normalize(values.nomParcours)
      )
      if (duplicate) {
        ctx.addIssue({
          code: "custom",
          path: ["nomParcours"],
          message: `Un parcours M${annee} porte déjà ce nom.`,
        })
      }
    })

export type ParcoursFormErrors = Partial<Record<keyof ParcoursFormValues, string>>

type ValidationResult =
  | { success: true; payload: CreateParcoursPayload }
  | { success: false; errors: ParcoursFormErrors }

/**
 * Valide la saisie et la convertit au format attendu par l'API
 * (nom nettoyé, année en nombre). C'est la frontière formulaire → HTTP.
 */
export const validateParcoursForm = (
  values: ParcoursFormValues,
  existing: readonly Parcours[] = []
): ValidationResult => {
  const result = createParcoursFormSchema(existing).safeParse(values)
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error)
    return {
      success: false,
      errors: {
        nomParcours: fieldErrors.nomParcours?.[0],
        anneeFormation: fieldErrors.anneeFormation?.[0],
      },
    }
  }
  return {
    success: true,
    payload: {
      nomParcours: result.data.nomParcours.replace(/\s+/g, " "),
      anneeFormation: Number(result.data.anneeFormation) as AnneeFormation,
    },
  }
}

/* ------------------------------------------------------------------ */
/* Réponses de l'API                                                   */
/* ------------------------------------------------------------------ */

/**
 * Le typage TypeScript ne vérifie rien à l'exécution : on valide le JSON
 * reçu pour détecter tôt un changement de contrat côté backend.
 */
export const parcoursSchema = z.object({
  id: z.number(),
  nomParcours: z.string(),
  anneeFormation: z.number(),
  created_at: z.string(),
})

export const parcoursListSchema = z.array(parcoursSchema)

export const createParcoursResponseSchema = z.object({
  message: z.string(),
  parcours: parcoursSchema,
})
