/**
 * Serializable data interfaces for passing from Server Components to Client Components.
 * These MUST NOT import from Prisma or any server-only module.
 */

/** Serializable business record — safe for Server→Client prop passing. */
export interface SerializableBusiness {
  id: string
  name: string
  address: string
  city: string
  state: string | null
  category: string
  latitude: number
  longitude: number
  photo_references: string[]
  rating: number | null
  user_rating_count: number | null
  business_status: string | null
  national_phone_number: string | null
  international_phone_number: string | null
  website_uri: string | null
  google_maps_uri: string | null
  ai_summary: string | null
  editorial_summary: string | null
  primary_type: string | null
  is_verified: boolean
  claimed: boolean
  postal_code: string | null
  regular_opening_hours: unknown
}

/** Serializable category record. */
export interface SerializableCategory {
  id: string
  name: string
  google_type: string
  active: boolean
  businessCount: number
}

/** Serializable deal record. */
export interface SerializableDeal {
  id: string
  title: string
  description: string
  price: number
  original_value: number
  expiration_date: string
  status: string
  quality_score: number
  businessName: string | null
  businessCity: string | null
}
