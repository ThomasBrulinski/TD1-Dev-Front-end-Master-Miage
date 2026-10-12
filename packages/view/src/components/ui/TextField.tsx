import { cn } from "@/utils/cn"
import { useId, type InputHTMLAttributes } from "react"
import { FieldError } from "./FieldError"

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string
  /** Aide affichée sous le champ tant qu'il n'y a pas d'erreur. */
  hint?: string
  error?: string
}

/**
 * Champ texte accessible : le label, l'aide et l'erreur sont reliés à
 * l'input (htmlFor / aria-describedby / aria-invalid) pour les lecteurs d'écran.
 * Les autres attributs (required, maxLength, disabled…) sont transmis à l'input.
 */
export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...inputProps
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-800">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type="text"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-10 rounded-md border bg-white px-3 text-sm text-zinc-900 shadow-xs",
          "placeholder:text-zinc-400 focus:outline-2 focus:outline-offset-0",
          "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500",
          error
            ? "border-red-500 focus:outline-red-500"
            : "border-zinc-300 focus:border-zinc-900 focus:outline-zinc-900",
          className
        )}
        {...inputProps}
      />
      {error ? (
        <FieldError id={errorId}>{error}</FieldError>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-zinc-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
