import { Button } from "@/components/ui/button"

export type AnneeFilterType = "ALL" | "1" | "2"

type ParcoursFilterProps = {
  value: AnneeFilterType
  onChange: (value: AnneeFilterType) => void
}

export function ParcoursFilter({ value, onChange }: ParcoursFilterProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={value === "ALL" ? "default" : "outline"}
        onClick={() => onChange("ALL")}
        size="sm"
      >
        Tous
      </Button>
      <Button
        variant={value === "1" ? "default" : "outline"}
        onClick={() => onChange("1")}
        size="sm"
      >
        M1
      </Button>
      <Button
        variant={value === "2" ? "default" : "outline"}
        onClick={() => onChange("2")}
        size="sm"
      >
        M2
      </Button>
    </div>
  )
}
