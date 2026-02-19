import { prisma } from "@/lib/prisma"

export async function listCities() {
  return prisma.city.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createCity(name: string) {
  return prisma.city.create({
    data: { name }
  })
}

export async function toggleCity(id: string, active: boolean) {
  return prisma.city.update({
    where: { id },
    data: { active }
  })
}

export async function updateCityImportedAt(id: string) {
  return prisma.city.update({
    where: { id },
    data: { last_imported_at: new Date() }
  })
}
