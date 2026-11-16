import { Badge } from "@/components/ui/badge"
import { formatDate } from "../lib/parcoursQuery"
import type { Parcours } from "../services/parcoursService"
import { ParcoursRowActions, type ParcoursActions } from "./ParcoursRowActions"

export function ParcoursCards({
  parcours,
  onEdit,
  onDelete,
}: ParcoursActions & { parcours: Parcours[] }) {
  return (
    <ul className="divide-y">
      {parcours.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{item.nomParcours}</p>
            <p className="text-muted-foreground text-sm">
              Créé le {formatDate(item.created_at)}
            </p>
          </div>
          <Badge variant="secondary">M{item.anneeFormation}</Badge>
          <ParcoursRowActions
            parcours={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
