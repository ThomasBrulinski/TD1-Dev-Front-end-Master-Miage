import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CircleAlert, Loader2, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createParcours } from "../services/parcoursService"

type FormErrors = {
  nom?: string
  annee?: string
}

export function AddParcoursModal() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [nom, setNom] = useState("")
  const [annee, setAnnee] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const mutation = useMutation({
    mutationFn: createParcours,
    onSuccess: async (parcours) => {
      await queryClient.invalidateQueries({ queryKey: ["parcours"] })
      toast.success(`Le parcours « ${parcours.nomParcours} » a été créé.`)
      close()
    },
  })

  function close() {
    setNom("")
    setAnnee("")
    setErrors({})
    mutation.reset()
    setOpen(false)
  }

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setOpen(true)
    } else if (!mutation.isPending) {
      close()
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const newErrors: FormErrors = {}
    if (nom.trim() === "") {
      newErrors.nom = "Le nom du parcours est obligatoire."
    }
    if (annee === "") {
      newErrors.annee = "Choisissez l'année : M1 ou M2."
    }
    setErrors(newErrors)

    if (newErrors.nom || newErrors.annee) {
      return
    }

    mutation.mutate({ nomParcours: nom.trim(), anneeFormation: Number(annee) })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nouveau parcours
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau parcours</DialogTitle>
          <DialogDescription>
            Le parcours sera ajouté à la liste dès sa création.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="nomParcours">Nom du parcours *</Label>
            <Input
              id="nomParcours"
              placeholder="Ex. : Systèmes d'information"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              disabled={mutation.isPending}
              aria-invalid={errors.nom ? true : undefined}
            />
            {errors.nom && <p className="text-destructive text-sm">{errors.nom}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Année de formation *</Label>
            <RadioGroup
              value={annee}
              onValueChange={setAnnee}
              disabled={mutation.isPending}
              aria-label="Année de formation"
              className="grid-cols-2"
            >
              <Label
                htmlFor="annee-1"
                className="has-[[data-state=checked]]:border-primary rounded-md border p-3"
              >
                <RadioGroupItem id="annee-1" value="1" />
                M1
              </Label>
              <Label
                htmlFor="annee-2"
                className="has-[[data-state=checked]]:border-primary rounded-md border p-3"
              >
                <RadioGroupItem id="annee-2" value="2" />
                M2
              </Label>
            </RadioGroup>
            {errors.annee && <p className="text-destructive text-sm">{errors.annee}</p>}
          </div>

          {mutation.isError && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Le parcours n'a pas été créé.</AlertTitle>
              <AlertDescription>
                Vérifiez que le serveur est démarré, puis réessayez. Votre saisie a été conservée.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={mutation.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin" />}
              {mutation.isPending ? "Enregistrement…" : "Créer le parcours"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
