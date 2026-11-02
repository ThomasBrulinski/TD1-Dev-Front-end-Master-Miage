import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/toast"
import { createParcours } from "../services/parcoursService"

type FormErrors = {
  nom?: string
  annee?: string
}

export function useAddParcoursForm(onSuccessClose: () => void) {
  const queryClient = useQueryClient()
  const [nom, setNom] = useState("")
  const [annee, setAnnee] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const mutation = useMutation({
    mutationFn: createParcours,
    onSuccess: async (parcours) => {
      await queryClient.invalidateQueries({ queryKey: ["parcours"] })
      toast.add({
        title: "Parcours créé",
        description: `Le parcours « ${parcours.nomParcours} » a été créé.`,
        type: "success",
      })
      resetForm()
      onSuccessClose()
    },
  })

  function resetForm() {
    setNom("")
    setAnnee("")
    setErrors({})
    mutation.reset()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const newErrors: FormErrors = {}
    if (nom.trim() === "") {
      newErrors.nom = "Le nom du parcours est obligatoire."
    }
    if (annee === "") {
      newErrors.annee = "Choisissez l'année : M1 ou M2."
    }
    setErrors(newErrors)

    if (newErrors.nom || newErrors.annee) {
      return
    }

    mutation.mutate({ nomParcours: nom.trim(), anneeFormation: Number(annee) })
  }

  return {
    nom,
    setNom,
    annee,
    setAnnee,
    errors,
    mutation,
    handleSubmit,
    resetForm,
  }
}
