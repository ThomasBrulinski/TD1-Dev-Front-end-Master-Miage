import { useMemo } from "react"
import { getRouteApi } from "@tanstack/react-router"
import type { Parcours } from "../services/parcoursService"
import {
  DEFAULT_QUERY,
  queryParcours,
  type ParcoursQuery,
  type SortDir,
  type SortKey,
} from "../lib/parcoursQuery"
import { queryToSearch, searchToQuery } from "../lib/parcoursSearchParams"

const route = getRouteApi("/parcours")

export function useParcoursExplorer(all: Parcours[]) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const query = searchToQuery(search)

  const result = useMemo(() => queryParcours(all, query), [all, query])

  function update(patch: Partial<ParcoursQuery>, resetPage = true) {
    const next: ParcoursQuery = {
      ...query,
      page: resetPage ? 1 : query.page,
      ...patch,
    }
    navigate({ search: queryToSearch(next), replace: true })
  }

  return {
    query,
    result,
    setQ: (q: string) => update({ q }),
    setAnnee: (annee: ParcoursQuery["annee"]) => update({ annee }),
    setSort: (sort: SortKey, dir: SortDir) => update({ sort, dir }),
    toggleSort: (sort: SortKey) =>
      update({
        sort,
        dir:
          query.sort === sort
            ? query.dir === "asc"
              ? "desc"
              : "asc"
            : sort === "date"
              ? "desc"
              : "asc",
      }),
    setPage: (page: number) => update({ page }, false),
    setSize: (size: ParcoursQuery["size"]) => update({ size }),
    resetCriteria: () =>
      update({ q: DEFAULT_QUERY.q, annee: DEFAULT_QUERY.annee }),
  }
}

export type ParcoursExplorer = ReturnType<typeof useParcoursExplorer>
