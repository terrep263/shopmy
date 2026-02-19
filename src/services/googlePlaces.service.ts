import axios from 'axios'

const GOOGLE_API = "https://maps.googleapis.com/maps/api/place/textsearch/json"

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
}

export async function fetchBusinesses(city: string, category: string): Promise<GooglePlaceResult[]> {
  const results: GooglePlaceResult[] = []
  let nextPageToken: string | null = null
  let pageCount = 0

  do {
    const params: Record<string, string> = {
      query: `${category} in ${city}`,
      key: process.env.GOOGLE_PLACES_API_KEY ?? ""
    }

    if (nextPageToken) {
      params.pagetoken = nextPageToken
    }

    try {
      const response = await axios.get(GOOGLE_API, { params })

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

  return results
}
