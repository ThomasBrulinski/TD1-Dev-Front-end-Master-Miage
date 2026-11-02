import { z } from "zod"
import { DEFAULT_QUERY, type ParcoursQuery } from "./parcoursQuery"

export const parcoursSearchSchema = z.object({
  q: z.string().optional().catch(undefined),
  annee: z
    .union([z.literal(1), z.literal(2)])
    .optional()
    .catch(undefined),
  sort: z.enum(["nom", "annee", "date"]).optional().catch(undefined),
  dir: z.enum(["asc", "desc"]).optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
  size: z
    .union([z.literal(10), z.literal(25), z.literal(50)])
    .optional()
    .catch(undefined),
})

export type ParcoursSearch = z.infer<typeof parcoursSearchSchema>

export function searchToQuery(search: ParcoursSearch): ParcoursQuery {
  return {
    q: search.q ?? DEFAULT_QUERY.q,
    annee: search.annee ?? DEFAULT_QUERY.annee,
    sort: search.sort ?? DEFAULT_QUERY.sort,
    dir: search.dir ?? DEFAULT_QUERY.dir,
    page: search.page ?? DEFAULT_QUERY.page,
    size: search.size ?? DEFAULT_QUERY.size,
  }
}

export function queryToSearch(query: ParcoursQuery): ParcoursSearch {
  const d = DEFAULT_QUERY
  return {
    q: query.q.trim() !== "" ? query.q : undefined,
    annee: query.annee ?? undefined,
    sort: query.sort !== d.sort ? query.sort : undefined,
    dir: query.dir !== d.dir ? query.dir : undefined,
    page: query.page !== d.page ? query.page : undefined,
    size: query.size !== d.size ? query.size : undefined,
  }
}
