import { useQuery } from "@tanstack/react-query"
import { getParcours } from "../services/parcoursService"

export const PARCOURS_QUERY_KEY = ["parcours"] as const

export function useParcours() {
  return useQuery({
    queryKey: PARCOURS_QUERY_KEY,
    queryFn: getParcours,
  })
}
