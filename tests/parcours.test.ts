import { afterAll, afterEach, describe, expect, spyOn, test } from "bun:test"
import { ApiError } from "../packages/view/src/lib/api"
import {
  getCreateParcoursErrorMessage,
  parcoursApi,
} from "../packages/view/src/features/parcours/parcours.api"
import { validateParcoursForm } from "../packages/view/src/features/parcours/parcours.schema"
import type { Parcours } from "../packages/view/src/features/parcours/parcours.types"

const existing: Parcours[] = [
  { id: 1, nomParcours: "Systèmes d'information", anneeFormation: 1, created_at: "2026-10-12 08:00:00" },
]

describe("validateParcoursForm", () => {
  test("refuse un nom vide ou composé d'espaces", () => {
    const result = validateParcoursForm({ nomParcours: "   ", anneeFormation: "1" })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.errors.nomParcours).toBe("Le nom du parcours est obligatoire.")
  })

  test("refuse une année non choisie ou hors M1/M2", () => {
    const missing = validateParcoursForm({ nomParcours: "IA", anneeFormation: "" })
    expect(missing.success).toBe(false)
    if (!missing.success) expect(missing.errors.anneeFormation).toContain("M1 ou M2")

    // Simule une valeur trafiquée dans le DOM.
    const invalid = validateParcoursForm({ nomParcours: "IA", anneeFormation: "9" as "1" })
    expect(invalid.success).toBe(false)
  })

  test("refuse un doublon nom + année, sans tenir compte de la casse ni des espaces", () => {
    const result = validateParcoursForm(
      { nomParcours: "  systèmes   D'INFORMATION ", anneeFormation: "1" },
      existing
    )
    expect(result.success).toBe(false)
    if (!result.success) expect(result.errors.nomParcours).toBe("Un parcours M1 porte déjà ce nom.")
  })

  test("accepte le même nom pour une autre année", () => {
    expect(
      validateParcoursForm({ nomParcours: "Systèmes d'information", anneeFormation: "2" }, existing).success
    ).toBe(true)
  })

  test("convertit la saisie au format de l'API", () => {
    const result = validateParcoursForm({ nomParcours: "  Data   Science ", anneeFormation: "2" })
    expect(result).toEqual({
      success: true,
      payload: { nomParcours: "Data Science", anneeFormation: 2 },
    })
  })
})

describe("parcoursApi", () => {
  const fetchSpy = spyOn(globalThis, "fetch")
  afterEach(() => fetchSpy.mockReset())
  afterAll(() => fetchSpy.mockRestore())

  test("create envoie un POST JSON et renvoie le parcours créé", async () => {
    const created = { id: 7, nomParcours: "IA", anneeFormation: 2, created_at: "2026-10-12T10:00:00.000Z" }
    fetchSpy.mockResolvedValue(
      Response.json({ message: "Parcours created successfully", parcours: created }, { status: 201 })
    )

    expect(await parcoursApi.create({ nomParcours: "IA", anneeFormation: 2 })).toEqual(created)

    const [url, options] = fetchSpy.mock.calls.at(-1)!
    expect(url).toBe("/api/parcours")
    expect(options?.method).toBe("POST")
    expect(JSON.parse(options?.body as string)).toEqual({ nomParcours: "IA", anneeFormation: 2 })
  })

  test("une réponse 400 devient une ApiError portant le message du serveur", async () => {
    fetchSpy.mockResolvedValue(Response.json({ error: "nomParcours is required" }, { status: 400 }))

    const error = await parcoursApi.create({ nomParcours: "", anneeFormation: 1 }).catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.message).toBe("nomParcours is required")
    expect(getCreateParcoursErrorMessage(error)).toContain("refusé")
  })

  test("une panne réseau donne un message compréhensible", async () => {
    fetchSpy.mockRejectedValue(new TypeError("Failed to fetch"))

    const error = await parcoursApi.create({ nomParcours: "IA", anneeFormation: 1 }).catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(getCreateParcoursErrorMessage(error)).toContain("Impossible de joindre le serveur")
  })

  test("list rejette une réponse qui ne respecte pas le contrat", async () => {
    fetchSpy.mockResolvedValue(Response.json([{ id: "pas-un-nombre" }]))
    expect(parcoursApi.list()).rejects.toThrow()
  })
})
