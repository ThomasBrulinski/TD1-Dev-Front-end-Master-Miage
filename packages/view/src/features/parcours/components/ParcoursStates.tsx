import type { ReactNode } from "react"
import { CircleAlert, GraduationCap, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

function StateBlock({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <p className="font-medium">{title}</p>
      {children}
    </div>
  )
}

/** Squelette : garde la mise en page stable pendant le chargement. */
export function ParcoursLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Chargement des parcours"
      className="divide-y"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 px-6 py-4"
        >
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
          <div className="bg-muted h-5 w-10 animate-pulse rounded-full" />
        </div>
      ))}
      <span className="sr-only">Chargement des parcours…</span>
    </div>
  )
}

export function ParcoursError({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void
  isRetrying: boolean
}) {
  return (
    <StateBlock
      icon={<CircleAlert className="text-destructive size-8" />}
      title="Impossible de charger les parcours."
    >
      <p className="text-muted-foreground text-sm">
        Vérifiez que le serveur est démarré, puis réessayez.
      </p>
      <Button
        variant="outline"
        className="mt-2"
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Nouvelle tentative…" : "Réessayer"}
      </Button>
    </StateBlock>
  )
}

export function ParcoursEmpty() {
  return (
    <StateBlock
      icon={<GraduationCap className="size-8" />}
      title="Aucun parcours pour le moment."
    >
      <p className="text-muted-foreground text-sm">
        Utilisez « Nouveau parcours » pour créer le premier.
      </p>
    </StateBlock>
  )
}

export function ParcoursNoResults({ onReset }: { onReset: () => void }) {
  return (
    <StateBlock
      icon={<SearchX className="size-8" />}
      title="Aucun parcours ne correspond à vos critères."
    >
      <p className="text-muted-foreground text-sm">
        Modifiez votre recherche ou retirez le filtre.
      </p>
      <Button variant="outline" className="mt-2" onClick={onReset}>
        Réinitialiser les critères
      </Button>
    </StateBlock>
  )
}
