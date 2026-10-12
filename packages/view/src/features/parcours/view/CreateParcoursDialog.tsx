import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CircleAlert, Loader2Icon } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { useCreateParcoursController } from "../controller/useCreateParcoursController"
import type { Parcours } from "../model/parcours.types"
import { ParcoursFormFields } from "./ParcoursFormFields"

type CreateParcoursDialogProps = {
  existing: readonly Parcours[]
  onClose: () => void
  onCreated: (parcours: Parcours) => void
}

/**
 * Vue de la création, construite avec le Dialog de shadcn/ui (Radix) :
 * piège du focus, Échap, clic extérieur et restitution du focus sont gérés
 * par Radix. Toute demande de fermeture passe par le contrôleur, qui décide
 * (fermer, confirmer l'abandon ou ignorer pendant l'enregistrement).
 */
export function CreateParcoursDialog({ onClose, ...props }: CreateParcoursDialogProps) {
  // Élément qui avait le focus à l'ouverture (le bouton « Nouveau parcours »),
  // capturé au premier rendu, avant que Radix ne déplace le focus.
  const [returnFocusTo] = useState(() => document.activeElement as HTMLElement | null)

  // La modale est démontée à la fermeture : on rend le focus nous-mêmes.
  const closeAndRestoreFocus = () => {
    onClose()
    requestAnimationFrame(() => returnFocusTo?.focus())
  }

  const controller = useCreateParcoursController({ ...props, onClose: closeAndRestoreFocus })
  const formRef = useRef<HTMLFormElement>(null)
  const keepEditingRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (controller.confirmingDiscard) keepEditingRef.current?.focus()
  }, [controller.confirmingDiscard])

  /** Place le focus après le prochain rendu (champs ré-affichés, erreurs visibles). */
  const focusInForm = (selector: string) =>
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLElement>(selector)?.focus()
    )

  const handleRequestClose = () => {
    if (controller.requestClose() === "back-to-form") focusInForm("[data-autofocus]")
  }

  const handleKeepEditing = () => {
    controller.cancelDiscard()
    focusInForm("[data-autofocus]")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = controller.submit()
    if (!isValid) {
      focusInForm('input[aria-invalid="true"], button[role="radio"][aria-invalid="true"]')
    }
  }

  return (
    <Dialog
      open
      // Échap, clic sur le fond, bouton × : Radix demande la fermeture,
      // le contrôleur décide.
      onOpenChange={(open) => {
        if (!open) handleRequestClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau parcours</DialogTitle>
          <DialogDescription>
            Le parcours sera ajouté à la liste dès sa création.
          </DialogDescription>
        </DialogHeader>

        {controller.confirmingDiscard ? (
          <div role="alertdialog" aria-labelledby="discard-title" aria-describedby="discard-desc">
            <p id="discard-title" className="font-medium">
              Abandonner la création ?
            </p>
            <p id="discard-desc" className="text-muted-foreground mt-1 text-sm">
              Les informations saisies seront perdues.
            </p>
            <DialogFooter className="mt-6">
              <Button ref={keepEditingRef} variant="outline" onClick={handleKeepEditing}>
                Continuer la saisie
              </Button>
              <Button variant="destructive" onClick={controller.discard}>
                Abandonner
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={controller.isSaving}
            className="grid gap-5"
          >
            <ParcoursFormFields
              values={controller.values}
              errors={controller.errors}
              onChange={controller.setField}
              disabled={controller.isSaving}
            />

            {controller.errorMessage && (
              <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Le parcours n'a pas été créé.</AlertTitle>
                <AlertDescription>
                  {controller.errorMessage} Votre saisie a été conservée.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleRequestClose}
                disabled={controller.isSaving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={controller.isSaving}>
                {controller.isSaving && <Loader2Icon className="animate-spin" />}
                {controller.isSaving
                  ? "Enregistrement…"
                  : controller.errorMessage
                    ? "Réessayer"
                    : "Créer le parcours"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
