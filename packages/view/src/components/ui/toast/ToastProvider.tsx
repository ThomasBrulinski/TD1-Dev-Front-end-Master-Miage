import { cn } from "@/utils/cn"
import { CircleAlert, CircleCheck, Info, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { ToastContext, type Toast, type ToastApi, type ToastInput } from "./ToastContext"

const DEFAULT_DURATION = 5000

const icons = {
  success: <CircleCheck className="size-5 text-emerald-600" aria-hidden="true" />,
  error: <CircleAlert className="size-5 text-red-600" aria-hidden="true" />,
  info: <Info className="size-5 text-zinc-500" aria-hidden="true" />,
}

/**
 * Fournit `useToast()` à toute l'application et affiche les notifications
 * en bas à droite. La zone est une région `aria-live` : les lecteurs d'écran
 * annoncent le message sans déplacer le focus.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback((input: ToastInput) => {
    const toast: Toast = {
      id: nextId.current++,
      variant: input.variant ?? "info",
      title: input.title,
      description: input.description,
      duration: input.duration ?? DEFAULT_DURATION,
    }
    // On garde au plus 3 notifications à l'écran.
    setToasts((current) => [...current.slice(-2), toast])
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, description) => show({ variant: "success", title, description }),
      error: (title, description) => show({ variant: "error", title, description }),
    }),
    [show]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-16 z-50 flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: number) => void
}) {
  const [paused, setPaused] = useState(false)

  // Disparition automatique, suspendue tant que la souris est dessus.
  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timer)
  }, [paused, toast.id, toast.duration, onDismiss])

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg",
        "animate-[toast-in_200ms_ease-out]",
        toast.variant === "success" && "border-emerald-200",
        toast.variant === "error" && "border-red-200",
        toast.variant === "info" && "border-zinc-200"
      )}
    >
      {icons[toast.variant]}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-sm text-zinc-600">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer la notification"
        className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-900"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
