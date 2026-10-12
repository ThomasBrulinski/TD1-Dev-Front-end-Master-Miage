import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Parcours } from "../services/parcoursService"

type ParcoursTableProps = {
  parcours: Parcours[]
}

export function ParcoursTable({ parcours }: ParcoursTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6">Nom du parcours</TableHead>
          <TableHead className="px-6">Année</TableHead>
          <TableHead className="px-6">Créé le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parcours.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="px-6 py-3 font-medium">{item.nomParcours}</TableCell>
            <TableCell className="px-6 py-3">
              <Badge variant="secondary">M{item.anneeFormation}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground px-6 py-3">
              {new Date(item.created_at).toLocaleDateString("fr-FR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
