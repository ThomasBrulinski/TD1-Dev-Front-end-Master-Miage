/**
 * Contrat d'échange avec l'API `/api/parcours`.
 * Miroir de packages/back/src/server/models/Parcours.ts.
 */

/** Côté serveur, l'année est un entier : 1 = M1, 2 = M2. */
export type AnneeFormation = 1 | 2

export type Parcours = {
  id: number
  nomParcours: string
  anneeFormation: number
  /** SQLite renvoie "2026-10-12 08:30:00" (UTC), le POST renvoie un ISO. */
  created_at: string
}

/** Corps de POST /api/parcours. */
export type CreateParcoursPayload = {
  nomParcours: string
  anneeFormation: AnneeFormation
}

/** Réponse 201 de POST /api/parcours. */
export type CreateParcoursResponse = {
  message: string
  parcours: Parcours
}

export const ANNEES_FORMATION = [
  { value: "1", label: "M1", description: "1re année de master" },
  { value: "2", label: "M2", description: "2e année de master" },
] as const

export const formatAnnee = (annee: number) => `M${annee}`
