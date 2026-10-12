import { useState } from "react"
import { toast } from "sonner"
import { useParcoursList } from "../model/parcours.queries"
import { formatAnnee, type Parcours } from "../model/parcours.types"

/**
 * Contrôleur de la page Parcours : fournit la liste issue du modèle,
 * gère l'ouverture de la création et réagit à une création réussie.
 */
export function useParcoursPageController() {
  const query = useParcoursList()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null)

  const handleCreated = (created: Parcours) => {
    setLastCreatedId(created.id)
    toast.success("Parcours créé", {
      description: `« ${created.nomParcours} » (${formatAnnee(created.anneeFormation)}) a été ajouté à la liste.`,
    })
  }

  return {
    parcours: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    isRefreshing: query.isFetching && !query.isPending,
    isLoaded: query.isSuccess,
    retry: () => query.refetch(),
    lastCreatedId,
    isCreateOpen,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),
    handleCreated,
  }
}
