import { useState } from "react"
import {
  emptyParcoursForm,
  validateParcoursForm,
  type ParcoursFormErrors,
  type ParcoursFormValues,
} from "./parcours.schema"
import type { CreateParcoursPayload, Parcours } from "./parcours.types"

/**
 * État et validation du formulaire parcours, indépendants de l'affichage
 * et de l'API : réutilisable pour une future modification (initialValues).
 *
 * Stratégie de validation : rien n'est signalé tant que l'utilisateur n'a
 * pas tenté d'envoyer (pas d'erreur agressive pendant la frappe), puis les
 * messages se mettent à jour en direct pour guider la correction.
 */
export function useParcoursForm({
  initialValues = emptyParcoursForm,
  existing = [],
}: {
  initialValues?: ParcoursFormValues
  existing?: readonly Parcours[]
} = {}) {
  const [values, setValues] = useState(initialValues)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const validation = validateParcoursForm(values, existing)
  const errors: ParcoursFormErrors =
    submitAttempted && !validation.success ? validation.errors : {}

  const isDirty =
    values.nomParcours.trim() !== initialValues.nomParcours.trim() ||
    values.anneeFormation !== initialValues.anneeFormation

  const setField = <K extends keyof ParcoursFormValues>(
    field: K,
    value: ParcoursFormValues[K]
  ) => setValues((current) => ({ ...current, [field]: value }))

  /** Renvoie le payload prêt pour l'API, ou null si la saisie est invalide. */
  const submit = (): CreateParcoursPayload | null => {
    setSubmitAttempted(true)
    return validation.success ? validation.payload : null
  }

  return { values, errors, isDirty, setField, submit }
}
