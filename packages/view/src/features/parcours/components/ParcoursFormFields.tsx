import { ChoiceField } from "@/components/ui/ChoiceField"
import { TextField } from "@/components/ui/TextField"
import { NOM_PARCOURS_MAX, type ParcoursFormErrors, type ParcoursFormValues } from "../parcours.schema"
import { ANNEES_FORMATION } from "../parcours.types"

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
 * Champs d'un parcours, sans logique d'envoi : réutilisables tels quels
 * dans une modale de création comme dans une future page de modification.
 */
export function ParcoursFormFields({
  values,
  errors,
  onChange,
  disabled,
}: ParcoursFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <TextField
        label="Nom du parcours"
        name="nomParcours"
        placeholder="Ex. : Systèmes d'information"
        required
        autoComplete="off"
        maxLength={NOM_PARCOURS_MAX}
        value={values.nomParcours}
        onChange={(event) => onChange("nomParcours", event.target.value)}
        error={errors.nomParcours}
        hint={`${NOM_PARCOURS_MAX} caractères maximum.`}
        disabled={disabled}
        data-autofocus
      />
      <ChoiceField
        label="Année de formation"
        name="anneeFormation"
        required
        options={ANNEES_FORMATION}
        value={values.anneeFormation}
        onChange={(value) => onChange("anneeFormation", value)}
        error={errors.anneeFormation}
        disabled={disabled}
      />
    </div>
  )
}
