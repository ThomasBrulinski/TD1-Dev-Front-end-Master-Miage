import { useIsMutating } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useParcoursForm } from "../hooks/useParcoursForm"
import { PARCOURS_MUTATION_KEY } from "../hooks/useParcoursMutations"
import type { Parcours } from "../services/parcoursService"
import { ParcoursForm } from "./ParcoursForm"

type Props = {
  open: boolean
  /** null = création, sinon modification de ce parcours */
  parcours: Parcours | null
  onClose: () => void
}

function ParcoursFormContent({
  parcours,
  onClose,
}: Pick<Props, "parcours" | "onClose">) {
  const form = useParcoursForm(parcours, onClose)

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {form.isEdit ? "Modifier le parcours" : "Nouveau parcours"}
        </DialogTitle>
        <DialogDescription>
          {form.isEdit
            ? "Corrigez le nom ou l'année. La liste sera mise à jour dès l'enregistrement."
            : "Le parcours sera ajouté à la liste dès sa création."}
        </DialogDescription>
      </DialogHeader>

      <ParcoursForm
        nom={form.nom}
        setNom={form.setNom}
        annee={form.annee}
        setAnnee={form.setAnnee}
        errors={form.errors}
        isPending={form.isPending}
        errorMessage={form.errorMessage}
        submitLabel={form.isEdit ? "Enregistrer" : "Créer le parcours"}
        submitDisabled={!form.isDirty}
        onSubmit={form.handleSubmit}
        onCancel={onClose}
      />
    </>
  )
}

export function ParcoursFormDialog({ open, parcours, onClose }: Props) {
  const isSaving = useIsMutating({ mutationKey: PARCOURS_MUTATION_KEY }) > 0

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !isSaving) onClose()
      }}
    >
      <DialogContent showCloseButton={!isSaving}>
        {/* Démonté à chaque fermeture + key : état neuf, pré-rempli, à chaque ouverture */}
        <ParcoursFormContent
          key={parcours?.id ?? "new"}
          parcours={parcours}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
