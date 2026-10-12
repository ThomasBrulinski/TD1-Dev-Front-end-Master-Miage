import { CircleAlert } from "lucide-react"
import type { ReactNode } from "react"

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
      <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}
