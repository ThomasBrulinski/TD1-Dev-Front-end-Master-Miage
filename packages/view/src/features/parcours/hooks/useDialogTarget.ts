import { useState } from "react"

export function useDialogTarget<T>(initial: T) {
  const [target, setTarget] = useState<T>(initial)
  const [open, setOpen] = useState(false)
  return {
    target,
    open,
    show: (value: T) => {
      setTarget(value)
      setOpen(true)
    },
    hide: () => setOpen(false),
  }
}
