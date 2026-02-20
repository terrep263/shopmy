# Business Importer Upgrade - Quick Start Guide

## 📋 Quick Reference

### 3-Minute Overview
The Business Importer now automatically:
1. 📷 Fetches 5 images per business from Google Maps
2. 💾 Saves images locally in organized folders
3. 📝 Generates professional descriptions with AI
4. 🗄️ Creates complete business records in database

### Before vs After

**Before:**
```
Import → Basic business info → Database
(name, address, coordinates only)
```

**After:**
```
Import → Fetch images → Download locally → Generate description → Database
(complete profile with images, descriptions, coordinates)
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Set Environment Variables
```bash
# Add to .env
GOOGLE_PLACES_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Access Admin Dashboard
```
http://localhost:3000/admin/dashboard
```

### Step 4: Find Business Importer Tool
1. Click "Admin Tools" in top navigation
2. Scroll to find "Business Importer" card
3. Click it to open

### Step 5: Run Test Import
1. Select **City:** Los Angeles
2. Select **Category:** Coffee Shops
3. Click **"Start Import"**
4. Wait for completion (2-3 minutes for test)

### Step 6: Verify Results
1. Check dashboard shows "Imported"
2. Click "View Results" to see new businesses
3. Verify images appear on business pages
4. Check descriptions are present

---

## 📊 What Gets Created

### Per Business:
- ✅ **Name** - From Google Places
- ✅ **Address** - Full address from Google
- ✅ **Coordinates** - Latitude & longitude
- ✅ **Description** - AI-generated (200 words)
- ✅ **Primary Image** - High-quality photo
- ✅ **Image Gallery** - Up to 5 images

### Storage:
```
/public/uploads/businesses/2025/01/
├── coffee_shop_1234567890.jpg
├── coffee_shop_1234567891.jpg
├── coffee_shop_1234567892.jpg
├── coffee_shop_1234567893.jpg
└── coffee_shop_1234567894.jpg
```

### Database:
```json
{
  "id": "uuid",
  "name": "Coffee Shop",
  "address": "123 Main St, LA, CA",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "description": "Located at the heart of downtown Los Angeles...",
  "image_url": "/uploads/businesses/2025/01/coffee_shop_1234567890.jpg",
  "image_urls": [
    "/uploads/businesses/2025/01/coffee_shop_1234567890.jpg",
    "/uploads/businesses/2025/01/coffee_shop_1234567891.jpg",
    ...
  ]
}
```

---

## ⚙️ Configuration

### Image Settings
```typescript
// In googlePlaces.service.ts
maxWidth: 800          // Image size (pixels)
maxWidth: 800          // Change for different sizes
```

### AI Description Settings
```typescript
// In aiDescription.service.ts
model: 'gpt-4o-mini'   // OpenAI model
temperature: 0.7       // 0=factual, 1=creative
max_tokens: 300        // Word limit (~200 words)
```

### Import Settings
```typescript
// In googlePlaces.service.ts
pageCount < 3          // Max 60 businesses per import
slice(0, 5)            // Max 5 images per business
100ms delay            // Rate limiting between API calls
```

---

## 🔍 Monitoring

### View Import Statistics
```sql
SELECT * FROM "AdminAction" 
WHERE action_type = 'IMPORT_CITY'
ORDER BY created_at DESC
LIMIT 5;

-- Shows: totalFetched, created, skipped, imagesDownloaded
```

### Check Downloaded Images
```bash
ls -la public/uploads/businesses/2025/01/
```

### View Business Records
```sql
SELECT id, name, description, image_url, image_urls
FROM "Business"
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Problem: No images downloading

**Solution:**
1. Check .env has valid GOOGLE_PLACES_API_KEY
2. Verify API key has Photos API enabled
3. Check `/public/uploads/` directory exists
4. Check file permissions (writable)

**Command:**
```bash
# Verify directory
ls -la public/uploads/
mkdir -p public/uploads/businesses
```

---

### Problem: Descriptions missing

**Solution:**
1. Check .env has valid OPENAI_API_KEY
2. Verify account has available credits
3. Check API rate limits not exceeded

**Command:**
```bash
# Test API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

---

### Problem: Import very slow

**Solution:**
1. May be hitting API rate limits
2. Check network connection
3. Wait 30 seconds between imports
4. Check API quotas

---

### Problem: Duplicate businesses created

**Solution:**
- Google Place ID is unique constraint
- Re-running import will skip duplicates
- Manually delete duplicates:

```sql
DELETE FROM "Business" 
WHERE created_at > '2025-01-XX' 
AND name = 'Duplicate Name';
```

---

## 📈 Performance Expectations

### Import Times:
| Businesses | Time | Details |
|-----------|------|---------|
| 1 | 10s | 1 business |
| 10 | 1m | Quick test |
| 20 | 2-3m | Small batch |
| 60 | 8-10m | Full batch (max) |

### What Takes Time:
1. **Google Places API** - ~100ms per call
2. **Image Downloads** - ~500-1000ms per image
3. **AI Descriptions** - ~2-3 seconds per business
4. **Database Inserts** - ~50ms per record

---

## 📱 Usage Examples

### From Admin Dashboard (Recommended)
```
1. /admin/tools → Business Importer
2. Select city and category
3. Click "Start Import"
4. Monitor progress
5. View results
```

### From Code
```typescript
import { importCityBusinesses } from '@/services/admin/adminImport.service'

const result = await importCityBusinesses(
  'admin-uuid',    // Current admin user
  'city-uuid',     // Selected city
  'category-uuid'  // Selected category
)

console.log(`
  Imported: ${result.created}
  Skipped: ${result.skipped}
  Images: ${result.imagesDownloaded}
`)
```

### From API
```bash
curl -X POST http://localhost:3000/api/admin/import-city \
  -H "Content-Type: application/json" \
  -d '{
    "cityId": "city-uuid",
    "categoryId": "category-uuid"
  }'
```

---

## ✅ Verification Checklist

After import completes:

- [ ] **Statistics showing:**
  - [ ] totalFetched > 0
  - [ ] created > 0
  - [ ] imagesDownloaded > 0

- [ ] **Images visible:**
  - [ ] `/public/uploads/businesses/2025/01/` has files
  - [ ] Files are JPG images
  - [ ] Image URLs load in browser

- [ ] **Database records:**
  - [ ] Business count increased
  - [ ] `description` field populated
  - [ ] `image_url` has value
  - [ ] `image_urls` array populated

- [ ] **Business pages:**
  - [ ] Businesses appear in search
  - [ ] Images display on profile
  - [ ] Descriptions show correctly
  - [ ] All data visible

---

## 📚 Documentation Files

| File | Purpose | Length |
|------|---------|--------|
| BUSINESS_IMPORTER_UPGRADE.md | Technical guide | 320 lines |
| BUSINESS_IMPORTER_COMPLETION.md | What was done | 200 lines |
| IMPORTER_CHECKLIST.md | Testing & deployment | 250 lines |
| BUSINESS_IMPORTER_FINAL_SUMMARY.md | Executive summary | 280 lines |
| CHANGELOG_IMPORTER_UPGRADE.md | All changes | 400 lines |
| IMPORTER_QUICKSTART.md | This file | Quick reference |

---

## 🎯 Key Files to Know

### Code Files
- `src/services/googlePlaces.service.ts` - Fetches from Google
- `src/services/aiDescription.service.ts` - Generates descriptions
- `src/services/admin/adminImport.service.ts` - Orchestrates import

### Schema
- `prisma/schema.prisma` - Business model definition

### Storage
- `public/uploads/businesses/` - Image storage location

---

## 🔐 Security Notes

✅ **Secure:**
- API keys in environment variables (not in code)
- File paths sanitized (no directory traversal)
- Database operations via Prisma ORM (SQL injection protected)
- Error messages sanitized (no sensitive data exposed)

⚠️ **Monitor:**
- API quotas (prevent runaway costs)
- Disk space (images accumulate)
- Error logs (catch issues early)

---

## 🚨 Common Issues Quick Fixes

| Issue | Fix |
|-------|-----|
| API key error | Check .env variables |
| No images | Verify API enabled, check permissions |
| Slow import | May be rate limited, wait between imports |
| Duplicate businesses | Re-run skips duplicates, manually delete if needed |
| Missing descriptions | Check OpenAI API key and credits |
| Database errors | Check database connection, verify schema updated |
| Directory doesn't exist | `mkdir -p public/uploads/businesses` |

---

## 📞 Support

### Getting Help

1. **Check Logs:**
   - Admin Dashboard → Logs → Filter by IMPORT_CITY
   - Shows success/failure counts

2. **Review Database:**
   - Check business records were created
   - Verify image URLs populated
   - Look for error patterns

3. **Check Files:**
   - Verify images in `/public/uploads/businesses/`
   - Check file timestamps
   - Look for incomplete files

4. **Review Documentation:**
   - BUSINESS_IMPORTER_UPGRADE.md for details
   - IMPORTER_CHECKLIST.md for troubleshooting
   - Code comments in service files

---

## 🎓 Learning Path

### Beginner: Just Use It
1. Read this Quick Start
2. Try test import
3. Verify results

### Intermediate: Understand It
1. Read BUSINESS_IMPORTER_UPGRADE.md
2. Review code comments
3. Check database records

### Advanced: Customize It
1. Read CHANGELOG_IMPORTER_UPGRADE.md
2. Review service code
3. Modify configuration values

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Read Quick Start | 5 min |
| Configure .env | 5 min |
| Run test import | 5 min |
| Verify results | 5 min |
| **Total Quick Test** | **20 min** |
| Read full docs | 30 min |
| Test troubleshooting | 30 min |
| Production deployment | 1 hour |

---

## 🎉 Ready to Go!

You're now ready to:
1. ✅ Understand what was built
2. ✅ Configure and test it
3. ✅ Deploy to production
4. ✅ Troubleshoot issues
5. ✅ Monitor usage

**Next Step:** Follow the 5-minute Quick Start above!

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0.0  
**Status:** Production Ready

