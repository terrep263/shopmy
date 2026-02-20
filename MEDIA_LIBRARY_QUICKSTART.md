# 🚀 Media Library - Quick Start Guide

## Getting Started

The Media Library is fully integrated and ready to use. No additional setup required!

## Using Media Library in Puck Editor

### Accessing the Puck Editor
```
http://localhost:3000/admin/editor
```

### Finding Image Fields

Components with image fields have Media Library support:
- **HeroBlock** - `backgroundImage` field
- **ImageBlock** - `image` field
- Any component with a media field

### How to Upload Images

1. **Open Puck Editor**
   - Navigate to `/admin/editor`
   - Find or add component with image field

2. **Click "Upload" Button**
   - Opens file picker
   - Select image from your computer
   - File is uploaded to `/public/uploads/YYYY/MM/`
   - Field automatically updates with URL
   - See preview of selected image

3. **View Result**
   - Image preview shows in field
   - Component displays new image
   - URL format: `/uploads/2025/02/1708232400-image.jpg`

### How to Browse Existing Images

1. **Click "Browse" Button**
   - Modal opens with all uploaded images
   - Shows grid of all previous uploads
   - Most recent images first

2. **Select Image**
   - Click on any thumbnail
   - Field updates with selected URL
   - Modal closes automatically
   - Component refreshes

3. **Re-use Images**
   - Browse previous uploads to reuse
   - No re-uploading needed
   - Saves disk space

## File Storage

All images stored in organized structure:

```
/public/uploads/
├── 2025/
│   ├── 01/
│   │   └── 1707628800-random-image.jpg
│   └── 02/
│       ├── 1708232400-random-new-image.jpg
│       ├── 1708232500-random-logo.svg
│       └── 1708232600-random-banner.webp
```

**Access URLs**:
- `http://localhost:3000/uploads/2025/02/1708232400-random-new-image.jpg`
- `http://localhost:3000/uploads/2025/02/1708232500-random-logo.svg`
- `http://localhost:3000/uploads/2025/02/1708232600-random-banner.webp`

## Supported Image Formats

✅ JPG/JPEG
✅ PNG
✅ GIF
✅ WebP
✅ SVG

## File Size Limits

- Maximum: 10MB per file
- Recommended: 2-5MB for web
- Automatically validated on upload

## Tips & Tricks

### Organize by Component
- Use consistent naming in upload
- Images automatically organized by date (YYYY/MM)
- Browse shows most recent first

### Reuse Images
- Browse before uploading
- Check if image already exists
- Saves time and disk space

### Multiple Components
- Same image can be used in multiple places
- Browse from any media field
- URL works everywhere in Puck

### Image Names
- Sanitized automatically (special chars removed)
- Timestamp prevents duplicates
- Easy to identify recent uploads

## Troubleshooting

### Upload Shows Error

**File too large?**
- Keep files under 10MB
- Compress images before upload
- Use "Save for Web" in image editors

**Wrong format?**
- Only jpg, png, gif, webp, svg supported
- Convert to one of these formats
- Try .jpg for photos, .png for graphics

**Upload fails silently?**
- Check browser console (F12 Developer Tools)
- Look for network errors
- Check disk space on server

### Can't See Uploaded Images

**Browse modal empty?**
- Haven't uploaded any images yet
- Check `/public/uploads/` directory
- Try uploading a test image first

**Wrong image showing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (Ctrl+R)
- Hard refresh (Ctrl+Shift+R)

### URL Format Issues

**URL doesn't load?**
- URLs always start with `/uploads/`
- Not absolute paths like `/public/uploads/`
- Try in new browser tab
- Check image file exists

## API Endpoints (For Developers)

### Upload Image
```bash
curl -X POST http://localhost:3000/api/admin/media/upload \
  -F "file=@image.jpg" \
  -H "Cookie: <auth_cookie>"
```

**Response**:
```json
{
  "success": true,
  "url": "/uploads/2025/02/1708232400-image.jpg"
}
```

### List All Images
```bash
curl http://localhost:3000/api/admin/media/list \
  -H "Cookie: <auth_cookie>"
```

**Response**:
```json
{
  "success": true,
  "files": [
    "/uploads/2025/02/1708232600-banner.webp",
    "/uploads/2025/02/1708232500-logo.svg",
    "/uploads/2025/02/1708232400-image.jpg"
  ]
}
```

## Workflow Examples

### Example 1: Create Hero with Custom Image

1. Open Puck Editor
2. Add "HeroBlock" component
3. Click Upload in backgroundImage field
4. Select hero-image.jpg from computer
5. Click Save in Puck
6. Preview shows hero with uploaded image

**Result URL**: `/uploads/2025/02/1708232400-hero-image.jpg`

### Example 2: Reuse Logo Across Pages

1. Browse media library
2. Find previously uploaded logo
3. Click Browse button in any image field
4. Select logo from grid
5. Image automatically set
6. Click Save
7. Logo now on new page using same file

**No re-uploading needed!**

### Example 3: Create Photo Gallery

1. Add multiple image fields
2. Upload different photos for each
3. Browse existing photos for consistency
4. Mix and match uploaded images
5. Save gallery
6. All images served from `/uploads/`

## Production Notes

### URLs Stay Consistent
- Upload URL: `/uploads/YYYY/MM/filename.ext`
- Development: `http://localhost:3000/uploads/...`
- Production: `https://yourdomain.com/uploads/...`

### Images Persist
- Files stored in `/public/uploads/`
- Survives server restarts
- Survives code deployments
- Available after redeploy

### Backups
- Archive old uploads periodically:
  ```bash
  cp -r public/uploads public/uploads.backup.2025-02
  ```

### Cleanup
- Remove old images to save space:
  ```bash
  rm -rf public/uploads/2024/
  ```

## Advanced Usage

### Add Media Field to Custom Component

In `puck.config.tsx`:

```tsx
YourComponent: {
  fields: {
    icon: {
      type: "custom",
      label: "Icon Image",
      render: ({ value, onChange }) => (
        <MediaLibraryField 
          value={value} 
          onChange={onChange} 
          label="Icon Image" 
        />
      ),
    },
  },
}
```

In your component:

```tsx
export function YourComponent({ icon }: { icon?: string }) {
  return (
    <div>
      {icon && <img src={icon} alt="Icon" />}
    </div>
  )
}
```

## Summary

✅ Upload images directly in Puck
✅ Browse previous uploads instantly  
✅ Automatic file organization (YYYY/MM)
✅ No manual folder copying needed
✅ Unique naming prevents conflicts
✅ Admin-only access
✅ Files persist across deploys
✅ URLs work in production

**The system is production-ready and requires zero configuration!**

---

For detailed technical documentation, see: **MEDIA_LIBRARY_GUIDE.md**
