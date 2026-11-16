import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ApiError,
  createParcours,
  deleteParcours,
  updateParcours,
  type NewParcours,
  type Parcours,
} from "../services/parcoursService"
import { PARCOURS_QUERY_KEY } from "./useParcours"

export const PARCOURS_MUTATION_KEY = ["parcours-mutation"] as const

function useResyncIfGone() {
  const queryClient = useQueryClient()
  return (error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      queryClient.invalidateQueries({ queryKey: PARCOURS_QUERY_KEY })
    }
  }
}

export function useCreateParcours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: PARCOURS_MUTATION_KEY,
    mutationFn: createParcours,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PARCOURS_QUERY_KEY }),
  })
}

export function useUpdateParcours() {
  const queryClient = useQueryClient()
  const resyncIfGone = useResyncIfGone()
  return useMutation({
    mutationKey: PARCOURS_MUTATION_KEY,
    mutationFn: ({ id, data }: { id: number; data: NewParcours }) =>
      updateParcours(id, data),
    onSuccess: (updated) =>
      queryClient.setQueryData<Parcours[]>(PARCOURS_QUERY_KEY, (old) =>
        old?.map((p) => (p.id === updated.id ? updated : p)),
      ),
    onError: resyncIfGone,
  })
}

export function useDeleteParcours() {
  const queryClient = useQueryClient()
  const resyncIfGone = useResyncIfGone()
  return useMutation({
    mutationKey: PARCOURS_MUTATION_KEY,
    mutationFn: deleteParcours,
    onSuccess: (_data, id) =>
      queryClient.setQueryData<Parcours[]>(PARCOURS_QUERY_KEY, (old) =>
        old?.filter((p) => p.id !== id),
      ),
    onError: resyncIfGone,
  })
}
