import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { parcoursApi } from "./parcours.api"

/** Clés de cache centralisées : une seule source pour lire et invalider. */
export const parcoursKeys = {
  all: ["parcours"] as const,
  list: () => [...parcoursKeys.all, "list"] as const,
}

export function useParcoursList() {
  return useQuery({
    queryKey: parcoursKeys.list(),
    queryFn: ({ signal }) => parcoursApi.list(signal),
  })
}

export function useCreateParcours() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: parcoursApi.create,
    // On renvoie la promesse d'invalidation : la mutation reste "pending"
    // jusqu'à ce que la liste soit rechargée. Quand la modale se ferme,
    // le nouveau parcours est donc déjà affiché, à sa place dans le tri serveur.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: parcoursKeys.all }),
  })
}
