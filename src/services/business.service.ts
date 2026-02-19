import { prisma } from '@/lib/prisma'
import { fetchBusinesses } from './googlePlaces.service'

interface ImportResult {
  totalFetched: number
  created: number
  skipped: number
}

export async function importBusinesses(city: string, category: string): Promise<ImportResult> {
  const places = await fetchBusinesses(city, category)

  let created = 0
  let skipped = 0

  for (const place of places) {
    try {
      await prisma.business.create({
        data: {
          google_place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          city,
          category,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          claimed: false
        }
      })
      created++
    } catch {
      // Duplicate entry (google_place_id constraint) or other DB error
      skipped++
    }
  }

  return {
    totalFetched: places.length,
    created,
    skipped
  }
}
