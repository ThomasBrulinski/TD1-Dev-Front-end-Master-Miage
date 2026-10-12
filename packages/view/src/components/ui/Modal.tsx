import { cn } from "@/utils/cn"
import { X } from "lucide-react"
import { useEffect, useId, useRef, type ReactNode } from "react"
import { Button } from "./Button"

type ModalProps = {
  title: string
  description?: string
  /**
   * Appelée quand l'utilisateur demande la fermeture (Échap, clic sur le fond,
   * bouton ×). Le parent décide : fermer, demander confirmation, ou ignorer
   * (par exemple pendant un enregistrement).
   */
  onRequestClose: () => void
  children: ReactNode
  className?: string
}

/**
 * Fenêtre modale basée sur l'élément natif <dialog> ouvert avec showModal().
 * Le navigateur gère gratuitement : couche supérieure, fond inerte,
 * piège du focus et touche Échap.
 *
 * La modale est ouverte tant qu'elle est montée : le parent l'affiche avec
 * `{isOpen && <Modal …/>}`. Démonter réinitialise donc l'état des enfants
 * (formulaire vide à la réouverture) sans code de remise à zéro.
 *
 * Mettre `data-autofocus` sur l'élément qui doit recevoir le focus à l'ouverture.
 */
export function Modal({
  title,
  description,
  onRequestClose,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pointerDownOnBackdrop = useRef(false)
  const titleId = useId()
  const descriptionId = useId()

  // Ouverture au montage, fermeture et restitution du focus au démontage.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    if (!dialog.open) dialog.showModal()
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus()

    return () => {
      dialog.close()
      previouslyFocused?.focus()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Échap : on empêche la fermeture native pour laisser le parent décider.
      onCancel={(event) => {
        event.preventDefault()
        onRequestClose()
      }}
      // Clic sur le fond : la cible est le <dialog> lui-même (le contenu est
      // dans la div interne). On vérifie aussi le pointerdown pour ne pas
      // fermer quand on sélectionne du texte en glissant hors de la fenêtre.
      onPointerDown={(event) => {
        pointerDownOnBackdrop.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pointerDownOnBackdrop.current && event.target === event.currentTarget) {
          onRequestClose()
        }
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-white p-0 text-zinc-900 shadow-xl",
        "backdrop:bg-zinc-950/40 backdrop:backdrop-blur-[2px]",
        className
      )}
    >
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-zinc-500">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRequestClose}
            aria-label="Fermer"
            title="Fermer (Échap)"
            className="-mr-2 -mt-1"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
