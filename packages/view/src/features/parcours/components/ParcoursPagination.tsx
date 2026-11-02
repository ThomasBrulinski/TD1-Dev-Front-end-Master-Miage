import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PAGE_SIZES,
  type PageSize,
  type ParcoursPageResult,
} from "../lib/parcoursQuery"

type ParcoursPaginationProps = {
  result: ParcoursPageResult
  size: PageSize
  onPage: (page: number) => void
  onSize: (size: PageSize) => void
}

export function ParcoursPagination({
  result,
  size,
  onPage,
  onSize,
}: ParcoursPaginationProps) {
  const { page, totalPages, from, to, totalFiltered, totalAll } = result

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm md:flex-row md:items-center md:justify-between md:px-6">
      <p className="text-muted-foreground" aria-live="polite">
        {from}–{to} sur {totalFiltered}
        {totalFiltered !== totalAll && ` (${totalAll} au total)`}
      </p>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Par page</span>
          <select
            value={size}
            onChange={(e) => onSize(Number(e.target.value) as PageSize)}
            className="border-input bg-background h-8 rounded-lg border px-2 text-sm"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <nav aria-label="Pagination" className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label="Page précédente"
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-20 text-center tabular-nums">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Page suivante"
          >
            <ChevronRight />
          </Button>
        </nav>
      </div>
    </div>
  )
}
