import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, PageContainer, PageHeader } from "@/components/layout/Page"
import { Button } from "@/components/ui/button"
import { AddParcoursModal } from "./components/AddParcoursModal"
import { ParcoursTable } from "./components/ParcoursTable"
import { ParcoursSearch } from "./components/ParcoursSearch"
import { getParcours } from "./services/parcoursService"

export function ParcoursPage() {
  const { data: parcours = [], isPending, isError, refetch } = useQuery({
    queryKey: ["parcours"],
    queryFn: getParcours,
  })

  const [searchQuery, setSearchQuery] = useState("")

  const filteredParcours = useMemo(() => {
    return parcours.filter((item) =>
      item.nomParcours.toLowerCase().includes(searchQuery.toLowerCase().trim())
    )
  }, [parcours, searchQuery])

  return (
    <PageContainer>
      <PageHeader
        title="Parcours"
        description="Liste et gestion des parcours de formation."
        actions={<AddParcoursModal />}
      />

      <div className="mb-4">
        <ParcoursSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      <Card className="p-0">
        {isPending && (
          <p className="text-muted-foreground px-6 py-10 text-center">
            Chargement des parcours…
          </p>
        )}

        {isError && (
          <div className="px-6 py-10 text-center">
            <p className="font-medium">Impossible de charger les parcours.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Réessayer
            </Button>
          </div>
        )}

        {!isPending && !isError && parcours.length === 0 && (
          <p className="text-muted-foreground px-6 py-10 text-center">
            Aucun parcours pour le moment.
          </p>
        )}

        {!isPending && !isError && parcours.length > 0 && filteredParcours.length === 0 && (
          <div className="px-6 py-10 text-center text-muted-foreground">
            <p>Aucun parcours ne correspond à « {searchQuery} ».</p>
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="mt-2"
            >
              Effacer la recherche
            </Button>
          </div>
        )}

        {filteredParcours.length > 0 && <ParcoursTable parcours={filteredParcours} />}
      </Card>
    </PageContainer>
  )
}
