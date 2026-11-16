import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Parcours } from "../services/parcoursService"

export type ParcoursActions = {
  onEdit: (parcours: Parcours) => void
  onDelete: (parcours: Parcours) => void
}

export function ParcoursRowActions({
  parcours,
  onEdit,
  onDelete,
}: ParcoursActions & { parcours: Parcours }) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Modifier"
        aria-label={`Modifier le parcours ${parcours.nomParcours}`}
        onClick={() => onEdit(parcours)}
      >
        <Pencil />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Supprimer"
        className="text-destructive hover:text-destructive"
        aria-label={`Supprimer le parcours ${parcours.nomParcours}`}
        onClick={() => onDelete(parcours)}
      >
        <Trash2 />
      </Button>
    </div>
  )
}
