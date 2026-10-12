import { Card, PageContainer, PageHeader } from "@/components/layout/Page"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/toast/useToast"
import { CircleAlert, GraduationCap, Loader2, Plus, RotateCw } from "lucide-react"
import { useState, type ReactNode } from "react"
import { CreateParcoursDialog } from "./components/CreateParcoursDialog"
import { ParcoursTable } from "./components/ParcoursTable"
import { useParcoursList } from "./parcours.queries"
import { formatAnnee, type Parcours } from "./parcours.types"

/**
 * Page de consultation des parcours. Elle ne fait que composer :
 * la donnée vient du hook, l'affichage des composants, la création de la modale.
 */
export function ParcoursPage() {
  const parcoursQuery = useParcoursList()
  const toast = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null)

  const parcours = parcoursQuery.data ?? []
  const openCreate = () => setIsCreateOpen(true)

  const handleCreated = (created: Parcours) => {
    setLastCreatedId(created.id)
    toast.success(
      "Parcours créé",
      `« ${created.nomParcours} » (${formatAnnee(created.anneeFormation)}) a été ajouté à la liste.`
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Parcours"
        description="Liste et gestion des parcours de formation."
        actions={
          <Button icon={<Plus className="size-4" aria-hidden="true" />} onClick={openCreate}>
            Nouveau parcours
          </Button>
        }
      />

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            {parcoursQuery.isSuccess
              ? `${parcours.length} parcours`
              : "Parcours"}
          </h2>
          {parcoursQuery.isFetching && !parcoursQuery.isPending && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500" role="status">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Actualisation…
            </span>
          )}
        </div>

        {parcoursQuery.isPending ? (
          <ListSkeleton />
        ) : parcoursQuery.isError ? (
          <ListMessage
            icon={<CircleAlert className="size-6 text-red-500" aria-hidden="true" />}
            title="Impossible de charger les parcours"
            description="Vérifiez que l'API est démarrée puis réessayez."
            action={
              <Button
                variant="secondary"
                icon={<RotateCw className="size-4" aria-hidden="true" />}
                onClick={() => parcoursQuery.refetch()}
              >
                Réessayer
              </Button>
            }
          />
        ) : parcours.length === 0 ? (
          <ListMessage
            icon={<GraduationCap className="size-6 text-zinc-400" aria-hidden="true" />}
            title="Aucun parcours pour le moment"
            description="Créez le premier parcours de l'établissement."
            action={
              <Button icon={<Plus className="size-4" aria-hidden="true" />} onClick={openCreate}>
                Nouveau parcours
              </Button>
            }
          />
        ) : (
          <ParcoursTable parcours={parcours} highlightedId={lastCreatedId} />
        )}
      </Card>

      {isCreateOpen && (
        <CreateParcoursDialog
          existing={parcours}
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </PageContainer>
  )
}

function ListSkeleton() {
  return (
    <div className="divide-y divide-zinc-100" aria-busy="true" aria-label="Chargement des parcours">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-6 px-6 py-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-10 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  )
}

function ListMessage({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-zinc-100">
        {icon}
      </div>
      <p className="font-medium text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
