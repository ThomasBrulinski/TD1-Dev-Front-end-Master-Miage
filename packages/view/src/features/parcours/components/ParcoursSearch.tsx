import { Input } from "@/components/ui/input"

type ParcoursSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function ParcoursSearch({ value, onChange }: ParcoursSearchProps) {
  return (
    <Input
      placeholder="Rechercher un parcours..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-xs"
    />
  )
}