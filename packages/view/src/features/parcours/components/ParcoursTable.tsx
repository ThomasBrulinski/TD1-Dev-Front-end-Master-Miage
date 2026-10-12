import { cn } from "@/utils/cn"
import { useEffect, useRef } from "react"
import { formatAnnee, type Parcours } from "../parcours.types"

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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Liste des parcours de formation</caption>
        <thead className="border-b border-zinc-200 text-xs font-medium tracking-wide text-zinc-500 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">Nom du parcours</th>
            <th scope="col" className="px-6 py-3">Année</th>
            <th scope="col" className="px-6 py-3">Créé le</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {parcours.map((item) => {
            const isHighlighted = item.id === highlightedId
            return (
              <tr
                key={item.id}
                ref={isHighlighted ? highlightedRef : undefined}
                className={cn(
                  "hover:bg-zinc-50",
                  isHighlighted && "animate-[row-highlight_3s_ease-out]"
                )}
              >
                <td className="px-6 py-3 font-medium text-zinc-900">
                  {item.nomParcours}
                  {isHighlighted && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Nouveau
                    </span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                    {formatAnnee(item.anneeFormation)}
                  </span>
                </td>
                <td className="px-6 py-3 text-zinc-500">{formatDate(item.created_at)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
