import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/utils/cn"
import { useEffect, useRef } from "react"
import { formatAnnee, type Parcours } from "../model/parcours.types"

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" })

/** SQLite renvoie "AAAA-MM-JJ HH:MM:SS" en UTC sans fuseau : on le précise. */
const formatDate = (value: string) => {
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date)
}

type ParcoursTableProps = {
  parcours: readonly Parcours[]
  /** Ligne mise en évidence (parcours qui vient d'être créé). */
  highlightedId?: number | null
}

export function ParcoursTable({ parcours, highlightedId }: ParcoursTableProps) {
  const highlightedRef = useRef<HTMLTableRowElement>(null)

  // Amène la nouvelle ligne à l'écran si la liste est longue.
  useEffect(() => {
    highlightedRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [highlightedId])

  return (
    <Table>
      <TableCaption className="sr-only">Liste des parcours de formation</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="px-6">Nom du parcours</TableHead>
          <TableHead className="px-6">Année</TableHead>
          <TableHead className="px-6">Créé le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parcours.map((item) => {
          const isHighlighted = item.id === highlightedId
          return (
            <TableRow
              key={item.id}
              ref={isHighlighted ? highlightedRef : undefined}
              className={cn(isHighlighted && "animate-[row-highlight_3s_ease-out]")}
            >
              <TableCell className="px-6 py-3 font-medium">
                {item.nomParcours}
                {isHighlighted && (
                  <Badge className="ml-2 border-transparent bg-emerald-100 text-emerald-700">
                    Nouveau
                  </Badge>
                )}
              </TableCell>
              <TableCell className="px-6 py-3">
                <Badge variant="secondary">{formatAnnee(item.anneeFormation)}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground px-6 py-3">
                {formatDate(item.created_at)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
