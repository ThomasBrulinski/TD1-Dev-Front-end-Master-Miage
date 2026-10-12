import { Card, PageContainer, PageHeader } from "@/components/layout/Page"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CircleAlert, GraduationCap, Loader2, Plus, RotateCw } from "lucide-react"
import type { ReactNode } from "react"
import { useParcoursPageController } from "../controller/useParcoursPageController"
import { CreateParcoursDialog } from "./CreateParcoursDialog"
import { ParcoursTable } from "./ParcoursTable"

/**
 * Vue de la page Parcours : affiche l'état fourni par le contrôleur
 * (liste, chargement, erreur, vide) et lui transmet les clics.
 */
export function ParcoursPage() {
  const page = useParcoursPageController()

  return (
    <PageContainer>
      <PageHeader
        title="Parcours"
        description="Liste et gestion des parcours de formation."
        actions={
          <Button onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            Nouveau parcours
          </Button>
        }
      />

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            {page.isLoaded
              ? `${page.parcours.length} parcours`
              : "Parcours"}
          </h2>
          {page.isRefreshing && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500" role="status">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Actualisation…
            </span>
          )}
        </div>

        {page.isLoading ? (
          <ListSkeleton />
        ) : page.isError ? (
          <ListMessage
            icon={<CircleAlert className="size-6 text-red-500" aria-hidden="true" />}
            title="Impossible de charger les parcours"
            description="Vérifiez que l'API est démarrée puis réessayez."
            action={
              <Button variant="outline" onClick={page.retry}>
                <RotateCw aria-hidden="true" />
                Réessayer
              </Button>
            }
          />
        ) : page.parcours.length === 0 ? (
          <ListMessage
            icon={<GraduationCap className="size-6 text-zinc-400" aria-hidden="true" />}
            title="Aucun parcours pour le moment"
            description="Créez le premier parcours de l'établissement."
            action={
              <Button onClick={page.openCreate}>
                <Plus aria-hidden="true" />
                Nouveau parcours
              </Button>
            }
          />
        ) : (
          <ParcoursTable parcours={page.parcours} highlightedId={page.lastCreatedId} />
        )}
      </Card>

      {page.isCreateOpen && (
        <CreateParcoursDialog
          existing={page.parcours}
          onClose={page.closeCreate}
          onCreated={page.handleCreated}
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
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-24" />
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
