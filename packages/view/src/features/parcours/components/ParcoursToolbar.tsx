import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils/cn"
import {
  hasActiveCriteria,
  type ParcoursQuery,
  type SortDir,
  type SortKey,
} from "../lib/parcoursQuery"

const SORT_OPTIONS: {
  value: string
  label: string
  sort: SortKey
  dir: SortDir
}[] = [
  { value: "date-desc", label: "Plus récents", sort: "date", dir: "desc" },
  { value: "date-asc", label: "Plus anciens", sort: "date", dir: "asc" },
  { value: "nom-asc", label: "Nom (A → Z)", sort: "nom", dir: "asc" },
  { value: "nom-desc", label: "Nom (Z → A)", sort: "nom", dir: "desc" },
  { value: "annee-asc", label: "Année (M1 → M2)", sort: "annee", dir: "asc" },
  { value: "annee-desc", label: "Année (M2 → M1)", sort: "annee", dir: "desc" },
]

const ANNEE_OPTIONS: { value: ParcoursQuery["annee"]; label: string }[] = [
  { value: null, label: "Tous" },
  { value: 1, label: "M1" },
  { value: 2, label: "M2" },
]

type ParcoursToolbarProps = {
  query: ParcoursQuery
  onSearch: (q: string) => void
  onAnnee: (annee: ParcoursQuery["annee"]) => void
  onSort: (sort: SortKey, dir: SortDir) => void
  onReset: () => void
}

export function ParcoursToolbar({
  query,
  onSearch,
  onAnnee,
  onSort,
  onReset,
}: ParcoursToolbarProps) {
  const sortValue = `${query.sort}-${query.dir}`

  return (
    <div className="flex flex-col gap-3 border-b px-4 py-4 md:flex-row md:items-center md:px-6">
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          type="search"
          value={query.q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher un parcours…"
          aria-label="Rechercher un parcours par nom"
          className="px-8 [&::-webkit-search-cancel-button]:hidden"
        />
        {query.q !== "" && (
          <button
            type="button"
            onClick={() => onSearch("")}
            aria-label="Effacer la recherche"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div
        role="group"
        aria-label="Filtrer par année de formation"
        className="inline-flex rounded-lg border p-0.5"
      >
        {ANNEE_OPTIONS.map((option) => {
          const active = query.annee === option.value
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={active}
              onClick={() => onAnnee(option.value)}
              className={cn(
                "h-7 flex-1 rounded-md px-3 text-sm font-medium transition-colors md:flex-none",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground whitespace-nowrap">
          Trier par
        </span>
        <select
          value={sortValue}
          onChange={(e) => {
            const option = SORT_OPTIONS.find((o) => o.value === e.target.value)
            if (option) onSort(option.sort, option.dir)
          }}
          className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border px-2 text-sm outline-none focus-visible:ring-3 md:w-auto"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      {hasActiveCriteria(query) && (
        <Button type="button" variant="ghost" onClick={onReset}>
          <X />
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
