import { prisma } from "@/lib/prisma"
import { fetchBusinesses } from "@/services/googlePlaces.service"
import { logAdminAction } from "./adminLogger.service"
import { randomUUID } from "crypto"

const DEFAULT_TENANT_ID = "tenant_lake_county"

export async function importCityBusinesses(adminId: string, cityId: string, categoryId: string) {
  console.log(`[importCityBusinesses] Starting import cityId=${cityId}, categoryId=${categoryId}`)

  const city = await prisma.city.findUnique({ where: { id: cityId } })
  if (!city) throw new Error(`City not found: ${cityId}`)
  if (!city.active) throw new Error(`City ${city.name} is inactive`)

  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category) throw new Error(`Category not found: ${categoryId}`)
  if (!category.active) throw new Error(`Category ${category.name} is inactive`)

  const places = await fetchBusinesses(city.name, category.google_type || category.name)
  const tenantId = city.tenant_id || DEFAULT_TENANT_ID

  let created = 0
  let skipped = 0

  for (const place of places) {
    try {
      const existing = await prisma.business.findFirst({
        where: { google_place_id: place.place_id }
      })
      if (existing) { skipped++; continue }

      await prisma.business.create({
        data: {
          id: randomUUID(),
          google_place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          city: city.name,
          category: category.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          tenant_id: tenantId,
          cityId: city.id,
          categoryId: category.id,
          photo_references: place.local_image_paths?.length
            ? place.local_image_paths
            : undefined,
        }
      })
      created++
    } catch (error) {
      console.error(`[import] Failed ${place.name}:`, error)
      skipped++
    }
  }

  await prisma.city.update({ where: { id: city.id }, data: { last_imported_at: new Date() } })
  await logAdminAction(adminId, "IMPORT_CITY", "City", city.id, {
    categoryId: category.id,
    totalFetched: places.length,
    created,
    skipped
  })

  return { totalFetched: places.length, created, skipped }
}
