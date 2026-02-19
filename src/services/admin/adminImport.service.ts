import { prisma } from "@/lib/prisma"
import { fetchBusinesses } from "@/services/googlePlaces.service"
import { updateCityImportedAt } from "./adminCity.service"
import { logAdminAction } from "./adminLogger.service"

export async function importCityBusinesses(adminId: string, cityId: string, categoryId: string) {
  const city = await prisma.city.findUnique({ where: { id: cityId } })
  if (!city || !city.active) {
    throw new Error("City not found or inactive")
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category || !category.active) {
    throw new Error("Category not found or inactive")
  }

  const places = await fetchBusinesses(city.name, category.google_type || category.name)

  let created = 0
  let skipped = 0

  for (const place of places) {
    try {
      await prisma.business.create({
        data: {
          google_place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          city: city.name,
          category: category.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          claimed: false
        }
      })
      created++
    } catch {
      skipped++
    }
  }

  await updateCityImportedAt(city.id)

  await logAdminAction(adminId, "IMPORT_CITY", "City", city.id, {
    categoryId: category.id,
    totalFetched: places.length,
    created,
    skipped
  })

  return {
    totalFetched: places.length,
    created,
    skipped
  }
}
