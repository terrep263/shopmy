# Business Importer Upgrade Guide

## Overview
The Business Importer has been upgraded to fetch professional business listings from Google Places API with:
- ✅ **Multiple high-quality images** (5 per business) from Google Maps
- ✅ **Local image storage** in `/public/uploads/businesses/YYYY/MM/`
- ✅ **AI-generated descriptions** (200 words) using OpenAI
- ✅ **Proper multi-tenant support** with automatic tenant/city/category assignment

## Architecture

### 1. **Google Places Service** (`src/services/googlePlaces.service.ts`)
Enhanced to fetch businesses with photos:

```typescript
interface EnrichedBusinessData {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number, lng: number } }
  image_urls: string[]           // Array of 5 Google Maps photo URLs
  primary_image_url: string | null  // First image URL
}

export async function fetchBusinesses(city: string, category: string): Promise<EnrichedBusinessData[]>
```

**Key Features:**
- Fetches up to 60 businesses per category (3 pages of 20 results)
- Calls Google Place Details API to get photos
- Generates proper Google Maps photo URLs with photo_reference
- Rate-limited with 100ms delays between API calls
- Returns up to 5 images per business

**API Endpoints Used:**
- Text Search: `https://maps.googleapis.com/maps/api/place/textsearch/json`
- Place Details: `https://maps.googleapis.com/maps/api/place/details/json`
- Photo URL: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=...&key=...`

### 2. **AI Description Service** (`src/services/aiDescription.service.ts`)
Generates professional business descriptions:

```typescript
interface BusinessData {
  name: string
  category: string
  address: string
}

export async function generateBusinessDescription(business: BusinessData): Promise<string>
```

**Configuration:**
- Model: `gpt-4o-mini` (fast & cost-effective)
- Temperature: `0.7` (balanced creativity)
- Max tokens: `300` (~200 words)
- Fallback description if API fails

**Sample Output:**
> "Located in downtown, [Business Name] offers exceptional [category] services. With a commitment to quality and customer satisfaction, the establishment has built a strong reputation..."

### 3. **Admin Import Service** (`src/services/admin/adminImport.service.ts`)
Orchestrates the complete import workflow:

```typescript
export async function importCityBusinesses(adminId: string, cityId: string, categoryId: string)
  → { totalFetched: number, created: number, skipped: number, imagesDownloaded: number }
```

**Workflow:**
1. Validate city and category exist and are active
2. Fetch businesses from Google Places API (with images)
3. For each business:
   - Generate AI description
   - Download images locally
   - Create business record with enriched data
4. Log admin action with statistics

**Error Handling:**
- Individual business failures don't stop the import
- Image download failures are graceful (business created without images)
- Failed businesses are counted in `skipped`

### 4. **Database Schema** (`prisma/schema.prisma`)
Business model updated with:

```prisma
model Business {
  // ... existing fields
  description     String?        // AI-generated (200 words)
  image_url       String?        // Primary image from Google Places
  image_urls      String[]       // Array of local image URLs (up to 5)
}
```

**Image Storage:**
- **Primary URL:** `/uploads/businesses/2025/01/businessname_1234567890.jpg`
- **Format:** `/uploads/businesses/YYYY/MM/filename.jpg`
- **Files stored locally** in `public/uploads/businesses/`

## Usage

### Trigger Import via Admin Dashboard

1. Go to Admin Dashboard → **Admin Tools** → **Import Manager**
2. Select city and category
3. Click **Start Import**
4. Monitor progress (stats updated in real-time)

### Programmatic Usage

```typescript
import { importCityBusinesses } from '@/services/admin/adminImport.service'

const result = await importCityBusinesses(
  adminId,      // Current admin user ID
  cityId,       // UUID of city
  categoryId    // UUID of category
)

console.log(`Created: ${result.created}, Skipped: ${result.skipped}, Images: ${result.imagesDownloaded}`)
```

## Environment Variables Required

```env
# Google Places API
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# OpenAI (for descriptions)
OPENAI_API_KEY=your_openai_api_key
```

## Configuration Options

### Google Places API
- **Photo Max Width:** 800px (configurable in `buildPhotoUrl()`)
- **Results Per Page:** 20 (Google default)
- **Max Pages:** 3 (60 businesses max per import)
- **Rate Limit Delay:** 100ms between API calls

### AI Descriptions
- **Model:** gpt-4o-mini (change in `aiDescription.service.ts`)
- **Temperature:** 0.7 (0-1, higher = more creative)
- **Max Tokens:** 300 (controls length)
- **Timeout:** 30 seconds

## Performance

**Typical Import Times:**
- **20 businesses:** ~2-3 minutes
- **60 businesses:** ~8-10 minutes

**Breakdown:**
- Google Places API calls: ~100ms each
- Image downloads: ~500-1000ms each (depending on size)
- AI description generation: ~2-3 seconds each
- Database inserts: ~50ms each

**Image Download Size:**
- ~300-500KB per business (5 images × 60-100KB)
- Total storage per 60-business import: ~2-3MB

## Troubleshooting

### No images downloaded
- Check `GOOGLE_PLACES_API_KEY` is valid and has Photos API enabled
- Verify Google Places returns photos for the category/city
- Check `/public/uploads/businesses/` directory exists

### Descriptions missing
- Check `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Review server logs for API errors

### Import hangs
- Check API rate limits (Google: 50 QPS, OpenAI: based on tier)
- Verify database connection
- Check disk space for image storage

### Duplicate businesses
- Google Places ID is unique constraint
- Re-running import will skip duplicates
- Use `prisma studio` to manually clean if needed

## Best Practices

1. **Start small:** Test with 1 city + 1 category first
2. **Monitor quota:** Google Places has usage quotas
3. **Schedule imports:** Run during off-peak hours
4. **Verify results:** Check a few imported businesses before bulk imports
5. **Archive images:** Consider monthly archival of unused images

## Future Enhancements

- [ ] Batch import (multiple cities/categories in one operation)
- [ ] Image optimization/compression
- [ ] Custom description templates
- [ ] Business logo extraction from Google Knowledge Graph
- [ ] Hours of operation extraction
- [ ] Phone number verification
- [ ] Website URL validation
- [ ] Category auto-mapping from Google types

## File Locations

| File | Purpose |
|------|---------|
| `src/services/googlePlaces.service.ts` | Google Places API integration |
| `src/services/aiDescription.service.ts` | OpenAI description generation |
| `src/services/admin/adminImport.service.ts` | Import orchestration |
| `prisma/schema.prisma` | Business model definition |
| `public/uploads/businesses/` | Local image storage |

## API Response Examples

### Google Place Details (with photos)
```json
{
  "result": {
    "place_id": "ChIJ...",
    "name": "Coffee Shop",
    "formatted_address": "123 Main St, City, ST",
    "photos": [
      {
        "photo_reference": "AfZDZ...",
        "height": 1000,
        "width": 1000
      }
    ]
  }
}
```

### Business Record Created
```json
{
  "id": "uuid",
  "google_place_id": "ChIJ...",
  "name": "Coffee Shop",
  "address": "123 Main St, City, ST",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "description": "Located at the heart of downtown...",
  "image_url": "/uploads/businesses/2025/01/coffee_shop_1234567890.jpg",
  "image_urls": [
    "/uploads/businesses/2025/01/coffee_shop_1234567890.jpg",
    "/uploads/businesses/2025/01/coffee_shop_1234567891.jpg"
  ],
  "tenant_id": "tenant_lake_county",
  "cityId": "city-uuid",
  "categoryId": "category-uuid"
}
```

## Monitoring & Logging

Import actions are logged in `AdminAction` table:
```sql
SELECT * FROM "AdminAction" 
WHERE action_type = 'IMPORT_CITY' 
ORDER BY created_at DESC;
```

Metadata includes:
```json
{
  "categoryId": "uuid",
  "totalFetched": 60,
  "created": 55,
  "skipped": 5,
  "imagesDownloaded": 165
}
```

