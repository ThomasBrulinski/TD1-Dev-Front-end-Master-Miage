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

type ParcoursTableProps = {
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

export function ParcoursTable({ parcours, query, onSort }: ParcoursTableProps) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
