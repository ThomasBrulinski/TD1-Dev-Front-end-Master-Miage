import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatDate,
  type ParcoursQuery,
  type SortKey,
} from "../lib/parcoursQuery"
import type { Parcours } from "../services/parcoursService"
import { ParcoursRowActions, type ParcoursActions } from "./ParcoursRowActions"

type ParcoursTableProps = ParcoursActions & {
  parcours: Parcours[]
  query: Pick<ParcoursQuery, "sort" | "dir">
  onSort: (sort: SortKey) => void
}

function SortableHead({
  label,
  column,
  query,
  onSort,
}: {
  label: string
  column: SortKey
  query: ParcoursTableProps["query"]
  onSort: ParcoursTableProps["onSort"]
}) {
  const active = query.sort === column
  const Icon = !active ? ArrowUpDown : query.dir === "asc" ? ArrowUp : ArrowDown

  return (
    <TableHead
      className="px-6 py-3"
      aria-sort={
        active ? (query.dir === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className="hover:text-foreground -mx-1 inline-flex items-center gap-1.5 rounded px-1 py-0.5"
      >
        {label}
        <Icon
          className={active ? "size-3.5" : "text-muted-foreground size-3.5"}
        />
      </button>
    </TableHead>
  )
}

export function ParcoursTable({
  parcours,
  query,
  onSort,
  onEdit,
  onDelete,
}: ParcoursTableProps) {
  return (
    <Table>
      <TableHeader className="bg-accent">
        <TableRow>
          <SortableHead
            label="Nom du parcours"
            column="nom"
            query={query}
            onSort={onSort}
          />
          <SortableHead
            label="Année"
            column="annee"
            query={query}
            onSort={onSort}
          />
          <SortableHead
            label="Créé le"
            column="date"
            query={query}
            onSort={onSort}
          />
          <TableHead className="w-28 px-6 py-3">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parcours.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="px-6 py-3">{item.nomParcours}</TableCell>
            <TableCell className="px-6 py-3">
              <Badge variant="secondary">M{item.anneeFormation}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground px-6 py-3">
              {formatDate(item.created_at)}
            </TableCell>
            <TableCell className="px-4 py-2">
              <ParcoursRowActions
                parcours={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
