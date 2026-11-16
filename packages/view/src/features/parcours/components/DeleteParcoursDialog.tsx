import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "@/components/ui/toast"
import { useDeleteParcours } from "../hooks/useParcoursMutations"
import { getErrorMessage, type Parcours } from "../services/parcoursService"

type Props = {
  open: boolean
  parcours: Parcours | null
  onClose: () => void
}

export function DeleteParcoursDialog({ open, parcours, onClose }: Props) {
  const mutation = useDeleteParcours()

  function close() {
    mutation.reset()
    onClose()
  }

  function confirm() {
    if (!parcours) return
    mutation.mutate(parcours.id, {
      onSuccess: () => {
        toast.add({
          title: "Parcours supprimé",
          description: `Le parcours « ${parcours.nomParcours} » a été supprimé.`,
          type: "success",
        })
        close()
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      title="Supprimer ce parcours ?"
      description={
        parcours && (
          <>
            Vous allez supprimer <strong>{parcours.nomParcours}</strong> (M
            {parcours.anneeFormation}). Cette action est définitive : les
            étudiants et les UE rattachés ne seront plus associés à ce parcours.
          </>
        )
      }
      confirmLabel="Supprimer définitivement"
      isPending={mutation.isPending}
      errorMessage={mutation.isError ? getErrorMessage(mutation.error) : null}
      onConfirm={confirm}
      onCancel={close}
    />
  )
}
