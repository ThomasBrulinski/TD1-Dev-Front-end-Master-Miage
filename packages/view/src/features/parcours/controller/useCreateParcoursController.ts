import { useState } from "react"
import { getCreateParcoursErrorMessage } from "../model/parcours.api"
import { useCreateParcours } from "../model/parcours.queries"
import type { Parcours } from "../model/parcours.types"
import { useParcoursForm } from "./useParcoursForm"

/** Résultat d'une demande de fermeture, pour que la vue gère le focus. */
export type CloseRequestResult = "ignored" | "confirm" | "back-to-form" | "closed"

type CreateParcoursControllerOptions = {
  /** Parcours déjà connus, pour détecter un doublon avant l'envoi. */
  existing: readonly Parcours[]
  onClose: () => void
  onCreated: (parcours: Parcours) => void
}

/**
 * Contrôleur de la création d'un parcours.
 * Relie le formulaire (saisie + validation) au modèle (mutation API) et
 * décide des règles d'interaction : quand fermer, quand demander
 * confirmation, quand bloquer. Il ne contient aucun JSX ni accès au DOM :
 * la vue affiche son état et lui transmet les actions de l'utilisateur.
 */
export function useCreateParcoursController({
  existing,
  onClose,
  onCreated,
}: CreateParcoursControllerOptions) {
  const form = useParcoursForm({ existing })
  const mutation = useCreateParcours()
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)

  const isSaving = mutation.isPending
  const errorMessage = mutation.isError
    ? getCreateParcoursErrorMessage(mutation.error)
    : null

  /** Échap, clic sur le fond, ×, Annuler : toutes les fermetures passent ici. */
  const requestClose = (): CloseRequestResult => {
    if (isSaving) return "ignored" // on ne ferme pas pendant l'enregistrement
    if (confirmingDiscard) {
      setConfirmingDiscard(false) // Échap sur la confirmation = revenir au formulaire
      return "back-to-form"
    }
    if (form.isDirty) {
      setConfirmingDiscard(true)
      return "confirm"
    }
    onClose()
    return "closed"
  }

  const cancelDiscard = () => setConfirmingDiscard(false)

  /**
   * Valide puis envoie. Renvoie false si la saisie est invalide
   * (la vue place alors le focus sur le premier champ en erreur).
   */
  const submit = (): boolean => {
    if (isSaving) return true // protège contre le double envoi
    const payload = form.submit()
    if (!payload) return false

    mutation.mutate(payload, {
      onSuccess: (parcours) => {
        onCreated(parcours)
        onClose()
      },
      // En cas d'échec : la modale reste ouverte, la saisie est conservée,
      // `errorMessage` est renseigné et l'utilisateur peut réessayer.
    })
    return true
  }

  return {
    values: form.values,
    errors: form.errors,
    setField: form.setField,
    isSaving,
    errorMessage,
    confirmingDiscard,
    requestClose,
    cancelDiscard,
    discard: onClose,
    submit,
  }
}
