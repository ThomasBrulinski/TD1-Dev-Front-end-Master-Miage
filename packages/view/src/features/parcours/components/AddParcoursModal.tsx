// AddParcoursModal.tsx
import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAddParcoursForm } from "../hooks/useAddParcoursForm"
import { ParcoursForm } from "./ParcoursForm"

export function AddParcoursModal() {
  const [open, setOpen] = useState(false)

  const {
    nom,
    setNom,
    annee,
    setAnnee,
    errors,
    mutation,
    handleSubmit,
    resetForm,
  } = useAddParcoursForm(() => setOpen(false))

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setOpen(true)
    } else if (!mutation.isPending) {
      resetForm()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button type="button">
          <Plus />
          Nouveau parcours
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau parcours</DialogTitle>
          <DialogDescription>
            Le parcours sera ajouté à la liste dès sa création.
          </DialogDescription>
        </DialogHeader>

        <ParcoursForm
          nom={nom}
          setNom={setNom}
          annee={annee}
          setAnnee={setAnnee}
          errors={errors}
          isPending={mutation.isPending}
          isError={mutation.isError}
          onSubmit={handleSubmit}
          onCancel={() => {
            resetForm()
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
