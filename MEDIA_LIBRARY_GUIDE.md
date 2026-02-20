# 📸 Media Library System - Complete Implementation

## Overview

The Media Library system is a complete image management solution integrated with the Puck visual editor. It allows admins to upload, browse, and select images directly within Puck without manually copying files to the public folder.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUCK EDITOR                                  │
│         (Drag & drop components with images)                   │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│          MediaLibraryField Component                            │
│  src/components/admin/MediaLibraryField.tsx                     │
│  ├─ Preview area showing selected image                        │
│  ├─ Browse button → opens MediaLibraryModal                    │
│  └─ Upload button → uploads new file                           │
└────────────┬────────────────────────────────────────────────────┘
             │
             ├──────────────────┬──────────────────┐
             ▼                  ▼                  ▼
    ┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
    │ MediaLibrary     │ │ Upload API   │ │ Scan Media API  │
    │ Modal Component  │ │ /api/admin/  │ │ /api/admin/     │
    │                  │ │ media/upload │ │ media/list      │
    └──────────────────┘ └──────┬───────┘ └────────┬────────┘
                                │                  │
                    ┌───────────┴──────────────────┤
                    ▼                              ▼
            ┌─────────────────────────┐  ┌──────────────────┐
            │  Media Service Layer    │  │  Media Service   │
            │ src/lib/media/          │  │  src/lib/media/  │
            │ - upload.ts             │  │  - scan.ts       │
            │ - mediaService.ts       │  └──────────────────┘
            └─────────────┬───────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
            ┌──────────────────────────────┐
            │  File System: /public/uploads │
            │  Structure: YYYY/MM/filename │
            │  Example:                    │
            │  2025/02/1708232400-image.jpg│
            └──────────────────────────────┘
                    │
                    ▼ (Served by Next.js)
            ┌──────────────────────────────┐
            │  Browser: /uploads/YYYY/MM/  │
            │           filename.jpg       │
            └──────────────────────────────┘
```

## Components

### 1. MediaLibraryField (Puck Integration)
**File**: `src/components/admin/MediaLibraryField.tsx`

The main field component used in Puck for image selection.

**Features**:
- Image preview area
- Browse existing uploads button
- Upload new file button
- Error handling
- Loading states

**Usage in Puck**:
```tsx
const mediaField = (label: string) => ({
  type: "custom" as const,
  label,
  render: ({ value, onChange }: { value?: string; onChange: (value: string) => void }) => (
    <MediaLibraryField value={value} onChange={onChange} label={label} />
  ),
})
```

### 2. MediaLibraryModal
**File**: `src/components/admin/MediaLibraryModal.tsx`

Modal dialog that displays all uploaded images in a grid.

**Features**:
- Fetches list from `/api/admin/media/list`
- Displays images as clickable thumbnails
- Click to select image
- Loading and error states
- Responsive grid layout

### 3. Media Service
**Files**: `src/lib/media/`

Core business logic for file operations.

#### upload.ts
- `uploadMedia()` - Uploads file to `/public/uploads/YYYY/MM/`
- Sanitizes filenames
- Generates unique names with timestamp
- Returns URL in format `/uploads/YYYY/MM/filename.ext`

#### scan.ts
- `scanMediaFiles()` - Recursively scans upload directory
- Returns array of all image URLs
- Filters only image extensions (jpg, png, gif, webp, svg)
- Sorted by most recent first

#### mediaService.ts
- `sanitizeFileName()` - Removes special characters
- `buildUniqueFileName()` - Creates unique filename with timestamp
- `buildUploadDirectory()` - Creates YYYY/MM path
- `saveUploadedFile()` - Handles file I/O
- `listUploadedFiles()` - Lists all uploads

## API Routes

### POST /api/admin/media/upload
**Location**: `src/app/api/admin/media/upload/route.ts`

Uploads a single image file.

**Request**:
```
POST /api/admin/media/upload
Content-Type: multipart/form-data

{
  file: <File>
}
```

**Response**:
```json
{
  "success": true,
  "url": "/uploads/2025/02/1708232400-image.jpg"
}
```

**Features**:
- Requires admin authentication (`requireAdmin()`)
- 10MB file size limit
- Validates file type
- Creates directory structure automatically
- Returns URL immediately after upload

### GET /api/admin/media/list
**Location**: `src/app/api/admin/media/list/route.ts`

Lists all uploaded images.

**Request**:
```
GET /api/admin/media/list
```

**Response**:
```json
{
  "success": true,
  "files": [
    "/uploads/2025/02/1708232400-image1.jpg",
    "/uploads/2025/02/1708232200-image2.png",
    "/uploads/2025/01/1707628800-image3.webp"
  ]
}
```

**Features**:
- Requires admin authentication
- Recursive directory scanning
- Only returns image files
- Sorted by most recent first

## File Storage Structure

All uploads are stored in `/public/uploads/` with automatic year/month organization:

```
/public/
├── uploads/
│   ├── 2025/
│   │   ├── 01/
│   │   │   ├── 1707628800-random-old-image.jpg
│   │   │   └── 1707628900-random-older-photo.png
│   │   └── 02/
│   │       ├── 1708232400-random-new-image.jpg
│   │       ├── 1708232500-random-fresh-logo.svg
│   │       └── 1708232600-random-banner.webp
│   ├── 2024/
│   │   └── 12/
│   │       └── 1704067200-random-archived.jpg
```

**Benefits**:
- Organized by date (year/month)
- Easy to find and manage old uploads
- Prevents filename conflicts (timestamp + random string)
- Next.js serves from `/public/uploads/` automatically
- Files persist across builds
- Portable URLs (`/uploads/...` format)

## Security

### Authentication
- All media endpoints require `requireAdmin()` - platform admin role only
- Upload and list endpoints check authorization
- Protected from unauthorized access

### File Validation
- Filename sanitization (removes special chars)
- Image type validation (jpg, png, gif, webp, svg only)
- 10MB file size limit
- No executable files allowed

### URL Safety
- All URLs use `/uploads/...` format
- Served from public directory only
- No access to private files
- Safe for production

## Integration with Puck

### Using Media Fields in Components

1. **Import MediaLibraryField**:
```tsx
import MediaLibraryField from "@/components/admin/MediaLibraryField"
```

2. **Define Media Field in Config**:
```tsx
const config: Config = {
  components: {
    HeroBlock: {
      fields: {
        backgroundImage: {
          type: "custom" as const,
          label: "Background Image",
          render: ({ value, onChange }) => (
            <MediaLibraryField 
              value={value} 
              onChange={onChange} 
              label="Background Image" 
            />
          ),
        },
      },
    },
  },
}
```

3. **Use Selected Image in Component**:
```tsx
export function HeroBlock({ backgroundImage }: { backgroundImage?: string }) {
  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Hero content */}
    </div>
  )
}
```

### Puck Config Features

The `puck.config.tsx` includes media fields for:
- Hero blocks (background images)
- Gallery/grid blocks
- Image components
- Any custom component needing images

## Usage Workflow

### Step 1: Upload Image
1. Click "Upload" button in MediaLibraryField
2. Select image file from computer
3. File uploaded to `/public/uploads/YYYY/MM/`
4. Field automatically updates with URL
5. Puck content saves with image URL

### Step 2: Browse Existing Images
1. Click "Browse" button in MediaLibraryField
2. Modal opens showing all previous uploads
3. Grid displays image thumbnails
4. Click thumbnail to select
5. Modal closes, field updates

### Step 3: Save Puck Content
1. Puck automatically saves field values
2. Image URLs stored in database
3. URLs remain `/uploads/...` format
4. Content portable across environments

## Performance Considerations

### Image Optimization
- Consider using Next.js Image component with `fill` layout
- All images in previews use responsive `sizes` prop
- Lazy loading enabled by default

### File Scanning
- `scanMediaFiles()` recursively scans directories
- For large media libraries, consider pagination
- Current limit: all files in memory

### Upload Limits
- Max file size: 10MB
- Recommended: 2-5MB for web
- Supported: jpg, png, gif, webp, svg

## Troubleshooting

### Upload Failed
**Issue**: Upload returns error message
**Solution**: 
- Check file size < 10MB
- Verify image format (jpg, png, gif, webp, svg)
- Check disk space on server
- Check permissions on `/public` directory

### Images Not Showing
**Issue**: Browse shows empty or no images
**Solution**:
- Verify files exist in `/public/uploads/`
- Check file extensions (must be image type)
- Run `scanMediaFiles()` to verify
- Check browser console for network errors

### Authentication Error
**Issue**: "Unauthorized" response
**Solution**:
- Log in as platform admin
- Verify `requireAdmin()` middleware working
- Check authentication token/session

### URL Format Wrong
**Issue**: URLs stored as absolute paths instead of `/uploads/...`
**Solution**:
- Verify `ensurePosixPath()` conversion
- Check API returns proper format
- Ensure `/public/uploads/` exists

## Development

### Add More Image Formats
Edit `src/lib/media/scan.ts`:
```tsx
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.tiff']
```

### Change Upload Directory
Edit `src/lib/media/mediaService.ts`:
```tsx
const uploadsRoot = path.join(process.cwd(), "public", "my-custom-uploads")
```

### Increase File Size Limit
Edit `src/lib/media/upload.ts`:
```tsx
if (buffer.length > 50 * 1024 * 1024) { // 50MB limit
```

### Add Image Metadata
Extend `saveUploadedFile()` to store metadata:
```tsx
const metadata = {
  url,
  fileName,
  size: buffer.length,
  uploadedAt: new Date(),
  uploadedBy: userId,
}
```

## Future Enhancements

- [ ] Image cropping/editing before upload
- [ ] Drag & drop file upload
- [ ] Batch upload multiple files
- [ ] Image metadata extraction (EXIF)
- [ ] Automatic image optimization (WebP, etc)
- [ ] Image tags/categories
- [ ] Search/filter functionality
- [ ] Trash/recycle bin for deleted files
- [ ] Storage usage statistics
- [ ] CDN integration for serving

## Production Checklist

- ✅ Files stored in `/public/uploads/` (persistent across builds)
- ✅ URLs use `/uploads/...` format (portable)
- ✅ Admin authentication required
- ✅ Filename sanitization enabled
- ✅ Unique filename generation (timestamp + random)
- ✅ File size limits enforced
- ✅ Image type validation
- ✅ Directory auto-creation
- ✅ Error handling implemented
- ✅ Responsive UI components
- ✅ Next.js Image optimization ready
- ✅ CORS safe for frontend

## Files Reference

```
src/
├── lib/media/
│   ├── index.ts                    # Exports
│   ├── upload.ts                   # Upload logic
│   ├── scan.ts                     # Directory scanning
│   └── mediaService.ts             # Core utilities
├── components/admin/
│   ├── MediaLibraryField.tsx       # Puck field component
│   └── MediaLibraryModal.tsx       # Browse modal
└── app/api/admin/media/
    ├── upload/
    │   └── route.ts                # POST upload
    └── list/
        └── route.ts                # GET list

puck/
└── puck.config.tsx                 # Puck components with media fields

public/
└── uploads/                        # All uploaded images (YYYY/MM/...)
```

## Conclusion

The Media Library system provides a complete, production-ready solution for image management in the Puck editor. It's secure, efficient, and user-friendly, allowing admins to upload and manage images without leaving the visual editor.

**Key Benefits**:
✅ No manual file copying needed
✅ Visual browsing of uploaded images
✅ Persistent file storage
✅ Organized by date
✅ Secure admin-only access
✅ Portable URLs for production
✅ Integrated with Puck editor
✅ Fully functional out-of-the-box
