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

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function assertOk(response: Response, fallback: string) {
  if (response.ok) return
  throw new ApiError(
    response.status === 404
      ? "Ce parcours n'existe plus : il a peut-être été supprimé par un autre gestionnaire."
      : fallback,
    response.status,
  )
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Impossible de joindre le serveur. Vérifiez qu'il est démarré."
}

export async function updateParcours(
  id: number,
  data: NewParcours,
): Promise<Parcours> {
  const response = await apiFetch(`/parcours/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
  assertOk(response, "Le parcours n'a pas pu être modifié.")
  const body = await response.json()
  return body.parcours
}

export async function deleteParcours(id: number): Promise<void> {
  const response = await apiFetch(`/parcours/${id}`, { method: "DELETE" })
  assertOk(response, "Le parcours n'a pas pu être supprimé.")
}
