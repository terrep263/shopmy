import prisma from "@/lib/prisma"

const DEFAULT_TENANT_ID = "tenant_lake_county"

export async function listCities() {
  return prisma.city.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createCity(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '_')
  const id = `city_${slug}`
  
  return prisma.city.create({
    data: { id, name, tenant_id: DEFAULT_TENANT_ID }
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
