export const API_BASE_URL = "/api"

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && typeof options.body === "string") {
    headers.set("Content-Type", "application/json")
  }
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  })
  return response
}

/**
 * Erreur levée par `apiJson` : conserve le statut HTTP et le corps renvoyé
 * pour que chaque feature décide du message à afficher.
 * `status === 0` signifie que le serveur n'a pas pu être joint.
 */
export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }

  get isNetworkError() {
    return this.status === 0
  }
}

const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Message d'erreur du backend (`{ "error": "..." }`) s'il existe. */
const extractServerMessage = (body: unknown): string | undefined => {
  if (typeof body === "object" && body !== null && "error" in body) {
    const { error } = body as { error: unknown }
    if (typeof error === "string") return error
  }
  return undefined
}

/**
 * Appelle l'API et renvoie le JSON décodé.
 * Toute réponse non-2xx ou toute panne réseau devient une `ApiError`,
 * ce qui permet à TanStack Query de passer la requête en état `error`.
 * Le type `T` n'est qu'une promesse du développeur : valider le JSON
 * reçu (Zod) dans la couche feature quand la donnée doit être fiable.
 */
export const apiJson = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  let response: Response
  try {
    response = await apiFetch(endpoint, options)
  } catch (error) {
    // Une annulation volontaire (AbortController) n'est pas une panne réseau.
    if (error instanceof DOMException && error.name === "AbortError") throw error
    throw new ApiError(0, "Le serveur est injoignable.")
  }

  const body = await readBody(response)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractServerMessage(body) ?? `Erreur HTTP ${response.status}`,
      body
    )
  }
  return body as T
}
