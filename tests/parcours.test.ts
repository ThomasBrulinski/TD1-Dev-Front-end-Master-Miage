import { afterAll, afterEach, expect, spyOn, test } from "bun:test"
import {
  createParcours,
  getParcours,
} from "../packages/view/src/features/parcours/services/parcoursService"

const fetchSpy = spyOn(globalThis, "fetch")
afterEach(() => fetchSpy.mockReset())
afterAll(() => fetchSpy.mockRestore())

test("getParcours renvoie la liste des parcours", async () => {
  const liste = [{ id: 1, nomParcours: "IA", anneeFormation: 2, created_at: "2026-10-12" }]
  fetchSpy.mockResolvedValue(Response.json(liste))

  expect(await getParcours()).toEqual(liste)
  expect(fetchSpy.mock.calls.at(-1)![0]).toBe("/api/parcours")
})

test("createParcours envoie un POST et renvoie le parcours créé", async () => {
  const cree = { id: 7, nomParcours: "IA", anneeFormation: 2, created_at: "2026-10-12" }
  fetchSpy.mockResolvedValue(
    Response.json({ message: "Parcours created successfully", parcours: cree }, { status: 201 })
  )

  expect(await createParcours({ nomParcours: "IA", anneeFormation: 2 })).toEqual(cree)

  const [url, options] = fetchSpy.mock.calls.at(-1)!
  expect(url).toBe("/api/parcours")
  expect(options?.method).toBe("POST")
  expect(JSON.parse(options?.body as string)).toEqual({ nomParcours: "IA", anneeFormation: 2 })
})

test("createParcours lance une erreur si le serveur refuse", async () => {
  fetchSpy.mockResolvedValue(Response.json({ error: "nomParcours is required" }, { status: 400 }))

  expect(createParcours({ nomParcours: "", anneeFormation: 1 })).rejects.toThrow()
})
