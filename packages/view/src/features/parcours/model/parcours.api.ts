import { ApiError, apiJson } from "@/lib/api"
import {
  createParcoursResponseSchema,
  parcoursListSchema,
} from "./parcours.schema"
import type { CreateParcoursPayload, Parcours } from "./parcours.types"

/**
 * Seul endroit de la feature qui connaît les URLs et le format HTTP.
 * Les composants ne font jamais de fetch : ils passent par les hooks,
 * qui passent par ces fonctions.
 */
export const parcoursApi = {
  async list(signal?: AbortSignal): Promise<Parcours[]> {
    const data = await apiJson("/parcours", { signal })
    return parcoursListSchema.parse(data)
  },

  async create(payload: CreateParcoursPayload): Promise<Parcours> {
    const data = await apiJson("/parcours", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return createParcoursResponseSchema.parse(data).parcours
  },
}

/** Traduit une erreur technique en message compréhensible par un gestionnaire. */
export const getCreateParcoursErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return "Impossible de joindre le serveur. Vérifiez votre connexion puis réessayez."
    }
    if (error.status === 400) {
      return `Le serveur a refusé les informations envoyées (${error.message}).`
    }
    if (error.status >= 500) {
      return "Le serveur n'a pas pu enregistrer le parcours. Réessayez dans un instant."
    }
    return `La création a échoué (${error.message}).`
  }
  return "Une erreur inattendue est survenue. Réessayez."
}
