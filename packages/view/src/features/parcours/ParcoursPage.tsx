import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, PageContainer, PageHeader } from "@/components/layout/Page"
import { Button } from "@/components/ui/button"
import { AddParcoursModal } from "./components/AddParcoursModal"
import { ParcoursTable } from "./components/ParcoursTable"
import { ParcoursSearch } from "./components/ParcoursSearch"
import { ParcoursFilter, type AnneeFilterType } from "./components/ParcoursFilter"
import { getParcours } from "./services/parcoursService"

export function ParcoursPage() {
  const { data: parcours = [], isPending, isError, refetch } = useQuery({
    queryKey: ["parcours"],
    queryFn: getParcours,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [anneeFilter, setAnneeFilter] = useState<AnneeFilterType>("ALL")

  const filteredParcours = useMemo(() => {
    return parcours.filter((item) => {
      const matchSearch = item.nomParcours
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim())
      
      const matchAnnee =
        anneeFilter === "ALL" ? true : item.anneeFormation === Number(anneeFilter)

      return matchSearch && matchAnnee
    })
  }, [parcours, searchQuery, anneeFilter])

  return (
    <PageContainer>
      <PageHeader
        title="Parcours"
        description="Liste et gestion des parcours de formation."
        actions={<AddParcoursModal />}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <ParcoursSearch value={searchQuery} onChange={setSearchQuery} />
        <ParcoursFilter value={anneeFilter} onChange={setAnneeFilter} />
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
            <p>Aucun parcours ne correspond aux critères sélectionnés.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setAnneeFilter("ALL")
              }}
              className="mt-2"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {filteredParcours.length > 0 && <ParcoursTable parcours={filteredParcours} />}
      </Card>
    </PageContainer>
  )
}
