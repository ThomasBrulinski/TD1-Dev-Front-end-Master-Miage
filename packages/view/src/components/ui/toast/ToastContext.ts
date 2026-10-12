import { createContext } from "react"

export type ToastVariant = "success" | "error" | "info"

export type ToastInput = {
  variant?: ToastVariant
  title: string
  description?: string
  /** Durée d'affichage en ms (5 s par défaut). */
  duration?: number
}

export type Toast = Required<Omit<ToastInput, "description">> & {
  id: number
  description?: string
}

export type ToastApi = {
  show: (toast: ToastInput) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)
