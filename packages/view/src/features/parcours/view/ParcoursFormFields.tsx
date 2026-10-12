import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/utils/cn"
import { useId } from "react"
import {
  NOM_PARCOURS_MAX,
  type ParcoursFormErrors,
  type ParcoursFormValues,
} from "../model/parcours.schema"
import { ANNEES_FORMATION } from "../model/parcours.types"

type ParcoursFormFieldsProps = {
  values: ParcoursFormValues
  errors: ParcoursFormErrors
  onChange: <K extends keyof ParcoursFormValues>(
    field: K,
    value: ParcoursFormValues[K]
  ) => void
  disabled?: boolean
}

/**
 * Champs d'un parcours (composants shadcn/ui), sans logique d'envoi :
 * réutilisables pour une création comme pour une future modification.
 */
export function ParcoursFormFields({
  values,
  errors,
  onChange,
  disabled,
}: ParcoursFormFieldsProps) {
  const id = useId()
  const nomId = `${id}-nom`
  const nomHelpId = `${id}-nom-help`
  const anneeLabelId = `${id}-annee`
  const anneeErrorId = `${id}-annee-error`

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor={nomId}>
          Nom du parcours
          <span className="text-destructive -ml-1.5" aria-hidden="true">*</span>
        </Label>
        <Input
          id={nomId}
          name="nomParcours"
          placeholder="Ex. : Systèmes d'information"
          autoComplete="off"
          maxLength={NOM_PARCOURS_MAX}
          required
          value={values.nomParcours}
          onChange={(event) => onChange("nomParcours", event.target.value)}
          aria-invalid={errors.nomParcours ? true : undefined}
          aria-describedby={nomHelpId}
          disabled={disabled}
          data-autofocus
        />
        <p
          id={nomHelpId}
          className={cn(
            "text-xs",
            errors.nomParcours ? "text-destructive font-medium" : "text-muted-foreground"
          )}
        >
          {errors.nomParcours ?? `${NOM_PARCOURS_MAX} caractères maximum.`}
        </p>
      </div>

      <div className="grid gap-2">
        <Label id={anneeLabelId}>
          Année de formation
          <span className="text-destructive -ml-1.5" aria-hidden="true">*</span>
        </Label>
        <RadioGroup
          name="anneeFormation"
          value={values.anneeFormation}
          onValueChange={(value) =>
            onChange("anneeFormation", value as ParcoursFormValues["anneeFormation"])
          }
          aria-labelledby={anneeLabelId}
          aria-describedby={errors.anneeFormation ? anneeErrorId : undefined}
          aria-invalid={errors.anneeFormation ? true : undefined}
          aria-required
          disabled={disabled}
          className="grid-cols-2"
        >
          {ANNEES_FORMATION.map((annee) => {
            const itemId = `${id}-annee-${annee.value}`
            return (
              <Label
                key={annee.value}
                htmlFor={itemId}
                className={cn(
                  "cursor-pointer items-start gap-3 rounded-md border p-3 font-normal transition-colors",
                  "hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent",
                  errors.anneeFormation && "border-destructive"
                )}
              >
                <RadioGroupItem
                  id={itemId}
                  value={annee.value}
                  aria-invalid={errors.anneeFormation ? true : undefined}
                  className="mt-0.5"
                />
                <span className="grid gap-1">
                  <span className="font-semibold">{annee.label}</span>
                  <span className="text-muted-foreground text-xs">{annee.description}</span>
                </span>
              </Label>
            )
          })}
        </RadioGroup>
        {errors.anneeFormation && (
          <p id={anneeErrorId} className="text-destructive text-xs font-medium">
            {errors.anneeFormation}
          </p>
        )}
      </div>
    </div>
  )
}
