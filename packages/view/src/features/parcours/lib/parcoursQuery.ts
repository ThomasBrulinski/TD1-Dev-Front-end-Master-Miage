import type { Parcours } from "../services/parcoursService"

export type SortKey = "nom" | "annee" | "date"
export type SortDir = "asc" | "desc"
export type AnneeFilter = 1 | 2 | null

export const PAGE_SIZES = [10, 25, 50] as const
export type PageSize = (typeof PAGE_SIZES)[number]

export type ParcoursQuery = {
  q: string
  annee: AnneeFilter
  sort: SortKey
  dir: SortDir
  page: number
  size: PageSize
}

export const DEFAULT_QUERY: ParcoursQuery = {
  q: "",
  annee: null,
  sort: "date",
  dir: "desc",
  page: 1,
  size: 10,
}

export type ParcoursPageResult = {
  items: Parcours[]
  totalAll: number
  totalFiltered: number
  page: number
  totalPages: number
  from: number
  to: number
}

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

export function parseDate(value: string): Date {
  const iso = value.includes("T") ? value : value.replace(" ", "T")
  const hasZone = /Z$|[+-]\d{2}:?\d{2}$/.test(iso)
  return new Date(hasZone ? iso : `${iso}Z`)
}

export function formatDate(value: string): string {
  const date = parseDate(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fr-FR")
}

function compare(a: Parcours, b: Parcours, sort: SortKey): number {
  switch (sort) {
    case "nom":
      return a.nomParcours.localeCompare(b.nomParcours, "fr", {
        sensitivity: "base",
      })
    case "annee":
      return a.anneeFormation - b.anneeFormation
    case "date":
      return (
        parseDate(a.created_at).getTime() - parseDate(b.created_at).getTime()
      )
  }
}

export function filterParcours(
  list: Parcours[],
  { q, annee }: Pick<ParcoursQuery, "q" | "annee">,
): Parcours[] {
  const needle = normalize(q)
  return list.filter(
    (p) =>
      (annee === null || p.anneeFormation === annee) &&
      (needle === "" || normalize(p.nomParcours).includes(needle)),
  )
}

export function sortParcours(
  list: Parcours[],
  { sort, dir }: Pick<ParcoursQuery, "sort" | "dir">,
): Parcours[] {
  const sign = dir === "asc" ? 1 : -1
  return [...list].sort(
    (a, b) => sign * compare(a, b, sort) || compare(a, b, "nom") || b.id - a.id,
  )
}

export function queryParcours(
  all: Parcours[],
  query: ParcoursQuery,
): ParcoursPageResult {
  const filtered = sortParcours(filterParcours(all, query), query)
  const totalFiltered = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / query.size))
  const page = Math.min(Math.max(1, query.page), totalPages)
  const start = (page - 1) * query.size
  const items = filtered.slice(start, start + query.size)

  return {
    items,
    totalAll: all.length,
    totalFiltered,
    page,
    totalPages,
    from: totalFiltered === 0 ? 0 : start + 1,
    to: start + items.length,
  }
}

export function hasActiveCriteria(query: ParcoursQuery): boolean {
  return query.q.trim() !== "" || query.annee !== null
}
