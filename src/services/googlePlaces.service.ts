import axios from 'axios'
import fs from 'fs'
import path from 'path'

const GOOGLE_TEXT_SEARCH_API = "https://maps.googleapis.com/maps/api/place/textsearch/json"
const GOOGLE_PLACE_DETAILS_API = "https://maps.googleapis.com/maps/api/place/details/json"
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'businesses')

interface PhotoReference {
  photo_reference: string
  height: number
  width: number
}

interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  photos?: PhotoReference[]
}

export interface EnrichedBusinessData extends GooglePlaceResult {
  /** Local paths relative to /public, e.g. "/uploads/businesses/abc123/1.jpg" */
  local_image_paths: string[]
}

/**
 * Fetch businesses with detailed info and download photos locally
 */
export async function fetchBusinesses(city: string, category: string): Promise<EnrichedBusinessData[]> {
  const results: GooglePlaceResult[] = []
  let nextPageToken: string | null = null
  let pageCount = 0

  // Step 1: Fetch places from text search
  do {
    const params: Record<string, string> = {
      query: `${category} in ${city}`,
      key: process.env.GOOGLE_PLACES_API_KEY ?? ""
    }

    if (nextPageToken) {
      params.pagetoken = nextPageToken
    }

    try {
      const response = await axios.get(GOOGLE_TEXT_SEARCH_API, { params })

      if (response.data.results) {
        results.push(...response.data.results)
      }

      nextPageToken = response.data.next_page_token || null
      pageCount++

      // Google requires 2-second delay before using next_page_token
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

    } catch (error) {
      console.error('Google Places API error:', error)
      throw new Error('Failed to fetch businesses from Google Places')
    }

  } while (nextPageToken && pageCount < 3)

  // Step 2: Download photos locally for each place
  const enriched: EnrichedBusinessData[] = []

  for (const place of results) {
    try {
      const details = await getPlaceDetails(place.place_id)
      const photos: PhotoReference[] = details.result?.photos || []

      // Download up to 5 photos and save to disk
      const local_image_paths = await downloadPhotos(place.place_id, photos.slice(0, 5))

      enriched.push({
        ...place,
        local_image_paths,
        photos: photos.slice(0, 5)
      })

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to get details for place ${place.place_id}:`, error)
      enriched.push({
        ...place,
        local_image_paths: []
      })
    }
  }

  return enriched
}

/**
 * Download photos from Google Places and save to public/uploads/businesses/{placeId}/
 * Returns array of web-accessible paths like "/uploads/businesses/{placeId}/1.jpg"
 */
export async function downloadPhotos(placeId: string, photos: PhotoReference[]): Promise<string[]> {
  if (!photos.length) return []

  const placeDir = path.join(UPLOAD_DIR, placeId)
  fs.mkdirSync(placeDir, { recursive: true })

  const savedPaths: string[] = []

  for (let i = 0; i < photos.length; i++) {
    try {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photos[i].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`

      const response = await axios.get(photoUrl, { responseType: 'arraybuffer', timeout: 15000 })

      const contentType = response.headers['content-type'] || 'image/jpeg'
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
      const filename = `${i + 1}.${ext}`
      const filePath = path.join(placeDir, filename)

      fs.writeFileSync(filePath, response.data)

      // Web-accessible path (served by Next.js from /public)
      savedPaths.push(`/uploads/businesses/${placeId}/${filename}`)
    } catch (error) {
      console.error(`Failed to download photo ${i + 1} for ${placeId}:`, error)
    }
  }

  return savedPaths
}

/**
 * Get detailed place information including photos
 */
export async function getPlaceDetails(placeId: string) {
  const params = {
    place_id: placeId,
    fields: 'photos',
    key: process.env.GOOGLE_PLACES_API_KEY ?? ""
  }

  try {
    const response = await axios.get(GOOGLE_PLACE_DETAILS_API, { params })
    return response.data
  } catch (error) {
    console.error('Failed to fetch place details:', error)
    throw error
  }
}
