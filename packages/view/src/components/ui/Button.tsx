import { cn } from "@/utils/cn"
import { Loader2 } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

const variants = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-400",
  secondary:
    "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 disabled:text-zinc-400",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:text-zinc-300",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
} as const

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  icon: "size-8 justify-center",
} as const

export type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Affiche un indicateur et désactive le bouton pendant un traitement. */
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
        "disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
