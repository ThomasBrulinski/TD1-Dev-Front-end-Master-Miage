import { useState, type FormEvent } from "react"
import { toast } from "@/components/ui/toast"
import { getErrorMessage, type Parcours } from "../services/parcoursService"
import { useCreateParcours, useUpdateParcours } from "./useParcoursMutations"

type FormErrors = { nom?: string; annee?: string }

export function useParcoursForm(parcours: Parcours | null, onDone: () => void) {
  const create = useCreateParcours()
  const update = useUpdateParcours()
  const mutation = parcours ? update : create

  const [nom, setNom] = useState(parcours?.nomParcours ?? "")
  const [annee, setAnnee] = useState(
    parcours ? String(parcours.anneeFormation) : "",
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const isDirty =
    parcours === null ||
    nom.trim() !== parcours.nomParcours ||
    Number(annee) !== parcours.anneeFormation

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const newErrors: FormErrors = {}
    if (nom.trim() === "") newErrors.nom = "Le nom du parcours est obligatoire."
    if (annee === "") newErrors.annee = "Choisissez l'année : M1 ou M2."
    setErrors(newErrors)
    if (newErrors.nom || newErrors.annee) return

    if (parcours && !isDirty) {
      onDone()
      return
    }

    const data = { nomParcours: nom.trim(), anneeFormation: Number(annee) }
    const onSuccess = (saved: Parcours) => {
      toast.add({
        title: parcours ? "Parcours modifié" : "Parcours créé",
        description: `Le parcours « ${saved.nomParcours} » a été ${parcours ? "modifié" : "créé"}.`,
        type: "success",
      })
      onDone()
    }

    if (parcours) update.mutate({ id: parcours.id, data }, { onSuccess })
    else create.mutate(data, { onSuccess })
  }

  return {
    isEdit: parcours !== null,
    nom,
    setNom,
    annee,
    setAnnee,
    errors,
    isDirty,
    isPending: mutation.isPending,
    errorMessage: mutation.isError ? getErrorMessage(mutation.error) : null,
    handleSubmit,
  }
}
