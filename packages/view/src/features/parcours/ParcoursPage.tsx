import { Card, PageContainer, PageHeader } from "@/components/layout/Page"
import { AddParcoursModal } from "./components/AddParcoursModal"
import { ParcoursCards } from "./components/ParcoursCards"
import { ParcoursPagination } from "./components/ParcoursPagination"
import {
  ParcoursEmpty,
  ParcoursError,
  ParcoursLoading,
  ParcoursNoResults,
} from "./components/ParcoursStates"
import { ParcoursTable } from "./components/ParcoursTable"
import { ParcoursToolbar } from "./components/ParcoursToolbar"
import { useParcours } from "./hooks/useParcours"
import { useParcoursExplorer } from "./hooks/useParcoursExplorer"

const EMPTY: never[] = [] // référence stable → évite de recalculer le useMemo

export function ParcoursPage() {
  const { data, isPending, isError, isRefetching, refetch } = useParcours()
  const explorer = useParcoursExplorer(data ?? EMPTY)
  const { query, result } = explorer

  const hasData = !isPending && !isError
  const isListEmpty = hasData && result.totalAll === 0
  const noResults = hasData && !isListEmpty && result.totalFiltered === 0

  return (
    <PageContainer>
      <PageHeader
        title="Parcours"
        description="Consultez, recherchez et organisez les parcours de formation."
        actions={<AddParcoursModal />}
      />

      <Card className="overflow-hidden p-0">
        {hasData && !isListEmpty && (
          <ParcoursToolbar
            query={query}
            onSearch={explorer.setQ}
            onAnnee={explorer.setAnnee}
            onSort={explorer.setSort}
            onReset={explorer.resetCriteria}
          />
        )}

        {isPending && <ParcoursLoading />}
        {isError && (
          <ParcoursError onRetry={() => refetch()} isRetrying={isRefetching} />
        )}
        {isListEmpty && <ParcoursEmpty />}
        {noResults && <ParcoursNoResults onReset={explorer.resetCriteria} />}

        {hasData && result.items.length > 0 && (
          <>
            <div className="hidden md:block">
              <ParcoursTable
                parcours={result.items}
                query={query}
                onSort={explorer.toggleSort}
              />
            </div>
            <div className="md:hidden">
              <ParcoursCards parcours={result.items} />
            </div>
            <ParcoursPagination
              result={result}
              size={query.size}
              onPage={explorer.setPage}
              onSize={explorer.setSize}
            />
          </>
        )}
      </Card>
    </PageContainer>
  )
}
