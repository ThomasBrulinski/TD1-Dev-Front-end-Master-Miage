import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { CircleAlert } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { getCreateParcoursErrorMessage } from "../parcours.api"
import { useCreateParcours } from "../parcours.queries"
import type { Parcours } from "../parcours.types"
import { useParcoursForm } from "../useParcoursForm"
import { ParcoursFormFields } from "./ParcoursFormFields"

type CreateParcoursDialogProps = {
  /** Parcours déjà connus, pour détecter un doublon avant l'envoi. */
  existing: readonly Parcours[]
  onClose: () => void
  onCreated: (parcours: Parcours) => void
}

/**
 * Orchestration de la création : relie le formulaire, la mutation et la
 * modale. Monté uniquement quand la modale est ouverte, donc chaque
 * ouverture repart d'un formulaire vide.
 */
export function CreateParcoursDialog({
  existing,
  onClose,
  onCreated,
}: CreateParcoursDialogProps) {
  const form = useParcoursForm({ existing })
  const createParcours = useCreateParcours()
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const keepEditingRef = useRef<HTMLButtonElement>(null)

  const isSaving = createParcours.isPending

  useEffect(() => {
    if (confirmingDiscard) keepEditingRef.current?.focus()
  }, [confirmingDiscard])

  const backToForm = () => {
    setConfirmingDiscard(false)
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus()
    )
  }

  /** Échap, clic sur le fond, ×, Annuler : tout passe par ici. */
  const requestClose = () => {
    if (isSaving) return // on ne ferme pas pendant l'enregistrement
    if (confirmingDiscard) return backToForm() // Échap = revenir au formulaire
    if (form.isDirty) return setConfirmingDiscard(true)
    onClose()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return // protège contre le double envoi (Entrée répétée)

    const payload = form.submit()
    if (!payload) {
      // Après le rendu des erreurs, on place le focus sur le premier champ fautif.
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('input[aria-invalid="true"], [aria-invalid="true"] input')
          ?.focus()
      )
      return
    }

    createParcours.mutate(payload, {
      onSuccess: (parcours) => {
        onCreated(parcours)
        onClose()
      },
      // En cas d'échec, on ne fait rien de plus : la modale reste ouverte avec
      // la saisie intacte et le message d'erreur ; l'utilisateur peut réessayer.
    })
  }

  return (
    <Modal
      title="Nouveau parcours"
      description="Le parcours sera ajouté à la liste dès sa création."
      onRequestClose={requestClose}
    >
      {confirmingDiscard ? (
        <div role="alertdialog" aria-labelledby="discard-title" aria-describedby="discard-desc">
          <p id="discard-title" className="font-medium text-zinc-900">
            Abandonner la création ?
          </p>
          <p id="discard-desc" className="mt-1 text-sm text-zinc-600">
            Les informations saisies seront perdues.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              ref={keepEditingRef}
              variant="secondary"
              onClick={backToForm}
            >
              Continuer la saisie
            </Button>
            <Button variant="danger" onClick={onClose}>
              Abandonner
            </Button>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
          <ParcoursFormFields
            values={form.values}
            errors={form.errors}
            onChange={form.setField}
            disabled={isSaving}
          />

          {createParcours.isError && (
            <div
              role="alert"
              className="mt-5 flex gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Le parcours n'a pas été créé.</p>
                <p className="mt-0.5">
                  {getCreateParcoursErrorMessage(createParcours.error)} Votre saisie a été conservée.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={requestClose} disabled={isSaving}>
              Annuler
            </Button>
            <Button type="submit" loading={isSaving}>
              {isSaving
                ? "Enregistrement…"
                : createParcours.isError
                  ? "Réessayer"
                  : "Créer le parcours"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
