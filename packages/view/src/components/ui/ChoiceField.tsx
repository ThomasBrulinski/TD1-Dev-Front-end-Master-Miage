import { cn } from "@/utils/cn"
import { useId } from "react"
import { FieldError } from "./FieldError"

export type ChoiceOption<T extends string> = {
  value: T
  label: string
  description?: string
}

type ChoiceFieldProps<T extends string> = {
  label: string
  /** Attribut `name` partagé par les boutons radio. */
  name: string
  options: ReadonlyArray<ChoiceOption<T>>
  value: T | ""
  onChange: (value: T) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Choix exclusif entre quelques options visibles d'un coup (radios natifs
 * stylés en cartes). Préféré à un <select> quand il y a 2 à 5 options :
 * tout est visible sans clic et les flèches du clavier fonctionnent nativement.
 */
export function ChoiceField<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
}: ChoiceFieldProps<T>) {
  const errorId = `${useId()}-error`

  return (
    <fieldset
      className="flex flex-col gap-1.5"
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
      disabled={disabled}
    >
      <legend className="mb-1.5 text-sm font-medium text-zinc-800">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer flex-col rounded-md border px-3 py-2.5 transition-colors",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-900",
              "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
              value === option.value
                ? "border-zinc-900 bg-zinc-900 text-white"
                : error
                  ? "border-red-400 bg-white hover:bg-zinc-50"
                  : "border-zinc-300 bg-white hover:bg-zinc-50"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              className="sr-only"
            />
            <span className="text-sm font-semibold">{option.label}</span>
            {option.description && (
              <span
                className={cn(
                  "text-xs",
                  value === option.value ? "text-zinc-300" : "text-zinc-500"
                )}
              >
                {option.description}
              </span>
            )}
          </label>
        ))}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  )
}
