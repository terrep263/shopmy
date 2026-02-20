/**
 * Server-side data loaders for businesses.
 * Uses Prisma directly — do NOT import from client components.
 */
import { prisma } from '@/lib/prisma'
import type { SerializableBusiness } from './types'

const DEFAULT_TENANT_ID = "tenant_lake_county"

/**
 * Fetch all active businesses for the default tenant.
 * Returns serializable data safe for Server→Client prop passing.
 */
export async function getBusinesses(): Promise<SerializableBusiness[]> {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        tenant_id: DEFAULT_TENANT_ID,
        OR: [
          { business_status: 'OPERATIONAL' },
          { business_status: null },
        ],
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    })

    return businesses.map(serializeBusiness)
  } catch (error) {
    console.error('Failed to fetch businesses:', error)
    return []
  }
}

/**
 * Fetch a single business by its ID (used as slug in URL).
 */
export async function getBusinessById(id: string): Promise<SerializableBusiness | null> {
  try {
    const business = await prisma.business.findUnique({
      where: { id },
    })

    return business ? serializeBusiness(business) : null
  } catch (error) {
    console.error('Failed to fetch business:', error)
    return null
  }
}

/**
 * Convert a Prisma Business model to a plain serializable object.
 * Handles Decimal→number, DateTime→string, Json→array.
 */
function serializeBusiness(b: Record<string, unknown>): SerializableBusiness {
  return {
    id: b.id as string,
    name: b.name as string,
    address: b.address as string,
    city: b.city as string,
    state: (b.state as string) ?? null,
    category: b.category as string,
    latitude: b.latitude as number,
    longitude: b.longitude as number,
    photo_references: Array.isArray(b.photo_references) ? b.photo_references : [],
    rating: b.rating != null ? Number(b.rating) : null,
    user_rating_count: (b.user_rating_count as number) ?? null,
    business_status: (b.business_status as string) ?? null,
    national_phone_number: (b.national_phone_number as string) ?? null,
    international_phone_number: (b.international_phone_number as string) ?? null,
    website_uri: (b.website_uri as string) ?? null,
    google_maps_uri: (b.google_maps_uri as string) ?? null,
    ai_summary: (b.ai_summary as string) ?? null,
    editorial_summary: (b.editorial_summary as string) ?? null,
    primary_type: (b.primary_type as string) ?? null,
    is_verified: (b.is_verified as boolean) ?? false,
    claimed: (b.claimed as boolean) ?? false,
    postal_code: (b.postal_code as string) ?? null,
    regular_opening_hours: b.regular_opening_hours ?? null,
  }
}
