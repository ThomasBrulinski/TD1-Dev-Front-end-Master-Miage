import { type FormEvent } from "react"
import { CircleAlert, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type ParcoursFormProps = {
  nom: string
  setNom: (value: string) => void
  annee: string
  setAnnee: (value: string) => void
  errors: { nom?: string; annee?: string }
  isPending: boolean
  isError: boolean
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
}

export function ParcoursForm({
  nom,
  setNom,
  annee,
  setAnnee,
  errors,
  isPending,
  isError,
  onSubmit,
  onCancel,
}: ParcoursFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="nomParcours">Nom du parcours *</Label>
        <Input
          id="nomParcours"
          placeholder="Ex. : Systèmes d'information"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          disabled={isPending}
          aria-invalid={errors.nom ? true : undefined}
        />
        {errors.nom && <p className="text-destructive text-sm">{errors.nom}</p>}
      </div>

      <div className="grid gap-2">
        <Label>Année de formation *</Label>
        <RadioGroup
          value={annee}
          onValueChange={setAnnee}
          disabled={isPending}
          aria-label="Année de formation"
          className="grid-cols-2"
        >
          <Label
            htmlFor="annee-1"
            className="has-data-[state=checked]:border-primary rounded-md border p-3"
          >
            <RadioGroupItem id="annee-1" value="1" />
            M1
          </Label>
          <Label
            htmlFor="annee-2"
            className="has-data-[state=checked]:border-primary rounded-md border p-3"
          >
            <RadioGroupItem id="annee-2" value="2" />
            M2
          </Label>
        </RadioGroup>
        {errors.annee && (
          <p className="text-destructive text-sm">{errors.annee}</p>
        )}
      </div>

      {isError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Le parcours n'a pas été créé.</AlertTitle>
          <AlertDescription>
            Vérifiez que le serveur est démarré, puis réessayez. Votre saisie a
            été conservée.
          </AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? "Enregistrement…" : "Créer le parcours"}
        </Button>
      </DialogFooter>
    </form>
  )
}
