import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { fetchBusinesses, getPlaceDetails, downloadPhotos } from './googlePlaces.service'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'

const DEFAULT_TENANT_ID = "tenant_lake_county"

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
          city,
          category,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          claimed: false,
          tenant_id: DEFAULT_TENANT_ID,
          // Store downloaded local image paths as JSON
          photo_references: place.local_image_paths.length > 0
            ? place.local_image_paths
            : undefined,
        }
      })
      created++
    } catch (err) {
      console.error(`Failed to import ${place.name}:`, err)
      skipped++
    }
  }

  return { totalFetched: places.length, created, skipped }
}

/**
 * Backfill photos for existing businesses that have a google_place_id
 * but no photo_references. Downloads images locally and updates the DB.
 */
export async function backfillPhotos(options?: { limit?: number }): Promise<{
  processed: number
  updated: number
  failed: number
  skipped: number
}> {
  const limit = options?.limit ?? 50

  // Find businesses with a google_place_id but no photos yet
  // Use Prisma.DbNull for proper SQL NULL matching in Prisma 7
  const businesses = await prisma.business.findMany({
    where: {
      google_place_id: { not: '' },
      OR: [
        { photo_references: { equals: Prisma.DbNull } },
        { photo_references: { equals: Prisma.JsonNull } },
        { photo_references: { equals: [] } },
      ]
    },
    take: limit,
    orderBy: { created_at: 'asc' }
  })

  let updated = 0
  let failed = 0
  let skipped = 0

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'businesses')

  for (const biz of businesses) {
    try {
      // Step 1: Check if photos already exist on disk for this place
      const placeDir = path.join(uploadDir, biz.google_place_id)
      if (fs.existsSync(placeDir)) {
        const files = fs.readdirSync(placeDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        if (files.length > 0) {
          const localPaths = files.map(f => `/uploads/businesses/${biz.google_place_id}/${f}`)
          await prisma.business.update({
            where: { id: biz.id },
            data: { photo_references: localPaths }
          })
          updated++
          continue
        }
      }

      // Step 2: No local files — download from Google
      const details = await getPlaceDetails(biz.google_place_id)
      const photos = details.result?.photos || []

      if (!photos.length) {
        skipped++
        continue
      }

      const localPaths = await downloadPhotos(biz.google_place_id, photos.slice(0, 5))

      if (localPaths.length > 0) {
        await prisma.business.update({
          where: { id: biz.id },
          data: { photo_references: localPaths }
        })
        updated++
      } else {
        skipped++
      }

      // Rate-limit to avoid hitting Google API limits
      await new Promise(r => setTimeout(r, 200))
    } catch (err) {
      console.error(`Backfill failed for ${biz.name} (${biz.id}):`, err)
      failed++
    }
  }

  return { processed: businesses.length, updated, failed, skipped }
}
