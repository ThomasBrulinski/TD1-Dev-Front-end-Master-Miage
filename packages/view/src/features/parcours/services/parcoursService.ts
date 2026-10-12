import { apiFetch } from "@/lib/api"

export type Parcours = {
  id: number
  nomParcours: string
  anneeFormation: number
  created_at: string
}

export type NewParcours = {
  nomParcours: string
  anneeFormation: number
}

export async function getParcours(): Promise<Parcours[]> {
  const response = await apiFetch("/parcours")
  if (!response.ok) {
    throw new Error("Impossible de charger les parcours.")
  }
  return response.json()
}

export async function createParcours(parcours: NewParcours): Promise<Parcours> {
  const response = await apiFetch("/parcours", {
    method: "POST",
    body: JSON.stringify(parcours),
  })
  if (!response.ok) {
    throw new Error("Le parcours n'a pas pu être créé.")
  }
  const data = await response.json()
  return data.parcours
}
