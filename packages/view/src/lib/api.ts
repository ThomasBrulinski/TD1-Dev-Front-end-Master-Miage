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
