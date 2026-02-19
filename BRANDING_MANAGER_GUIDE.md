# 🎨 Branding Manager - User Guide

## What is the Branding Manager?

The **Branding Manager** is a powerful admin tool that lets you customize your site's appearance without touching any code. Change colors, upload logos, and see changes live!

---

## 🚀 Quick Start

### Accessing the Branding Manager

1. Navigate to **Admin Panel** → **🎨 Branding** (in the sidebar)
2. Or visit directly: `/admin/branding`

---

## 🎨 Features

### 1. Primary Brand Color

**What it does**: Changes the color used for buttons, links, badges, and highlights throughout the site.

**How to use**:
- Use the **color picker** to visually select a color
- Or enter a **hex code** directly (e.g., `#c71f37`)
- See live preview on the right side

**Example colors**:
- Red (default): `#c71f37`
- Blue: `#007bff`
- Green: `#28a745`
- Purple: `#6f42c1`
- Orange: `#fd7e14`

### 2. Site Name

**What it does**: Changes the name displayed in navigation and page titles.

**How to use**:
- Type your desired site name in the text field
- Default: "Shop My Neighborhood"
- Example: "My Local Marketplace"

### 3. Main Logo

**What it does**: The primary logo shown throughout your site (on light backgrounds).

**How to use**:
1. Click **Choose File**
2. Select your logo image (PNG or SVG recommended)
3. Wait for upload to complete
4. Preview appears automatically

**Recommended specs**:
- Format: PNG with transparent background or SVG
- Size: Max height 100px, width proportional
- Background: Should look good on light/white backgrounds

### 4. Light Logo (Optional)

**What it does**: Alternative logo for dark backgrounds (footer, dark sections).

**How to use**:
1. Click **Choose File** under Light Logo section
2. Upload a white/light-colored version of your logo
3. Preview on dark background shown

**When to use**: If your main logo has dark colors, create a light version for dark backgrounds.

### 5. Favicon (Optional)

**What it does**: The small icon that appears in browser tabs.

**How to use**:
1. Click **Choose File** under Favicon section
2. Upload a 32x32px icon
3. Formats: ICO or PNG

**Tips**:
- Keep it simple - very small icon
- Should be recognizable at tiny size
- Usually a simplified version of your logo

---

## 📋 Step-by-Step: Complete Rebrand

### Scenario: Changing from default red to blue theme

1. **Change Primary Color**:
   - Click color picker
   - Select a blue shade (e.g., `#007bff`)
   - Check the preview on the right

2. **Update Site Name**:
   - Change "Shop My Neighborhood" to "Blue City Marketplace"

3. **Upload New Logo**:
   - Prepare a logo with blue colors
   - Upload to Main Logo section
   - Verify it looks good in the preview

4. **Add Light Logo** (if needed):
   - Create white version of logo
   - Upload to Light Logo section
   - Check preview on dark background

5. **Save Changes**:
   - Click **Save Changes** button (top right)
   - Wait for success message
   - Changes apply immediately!

---

## 🔄 How It Works (Technical)

### Database Storage
All branding settings are stored in the `BrandingSettings` table:
- `primary_color`: Hex color code
- `logo_url`: Path to uploaded logo
- `logo_light_url`: Path to light logo
- `site_name`: Site name string
- `favicon_url`: Path to favicon

### File Storage
Uploaded files are saved to `/public/assets/`:
- Main logo: `/assets/logo.png` (or `.svg`)
- Light logo: `/assets/logo-light.png`
- Favicon: `/assets/favicon.ico`

### Dynamic Application
When you save changes, the `BrandingProvider` component:
1. Fetches settings from `/api/admin/branding`
2. Applies color as CSS variable: `--bs-primary`
3. Updates all logo `<img>` tags dynamically
4. Changes page title with new site name
5. Updates favicon in browser

### Live Preview
The preview panel on the right shows:
- Button styles with new color
- Link color
- Badge with new color
- Site name display
- Logo preview

---

## 🛠️ API Endpoints

### GET `/api/admin/branding`
Fetch current branding settings.

**Response**:
```json
{
  "id": "uuid",
  "primary_color": "#c71f37",
  "logo_url": "/assets/logo.png",
  "logo_light_url": "/assets/logo-light.png",
  "site_name": "Shop My Neighborhood",
  "favicon_url": "/assets/favicon.ico",
  "created_at": "2025-02-18T...",
  "updated_at": "2025-02-18T..."
}
```

### POST `/api/admin/branding`
Save branding settings.

**Body**:
```json
{
  "primary_color": "#007bff",
  "logo_url": "/assets/logo.png",
  "logo_light_url": null,
  "site_name": "My Marketplace",
  "favicon_url": null
}
```

### POST `/api/admin/branding/upload`
Upload logo or favicon file.

**Form Data**:
- `file`: Image file
- `type`: "logo" | "logo-light" | "favicon"

**Response**:
```json
{
  "url": "/assets/logo.png"
}
```

---

## 🎯 Best Practices

### Colors
- ✅ Use high contrast colors for accessibility
- ✅ Test on buttons and text to ensure readability
- ✅ Consider color psychology (blue = trust, red = energy, green = growth)
- ❌ Avoid very light colors (#fafafa) - hard to see
- ❌ Avoid very dark colors (#111) unless high contrast text

### Logos
- ✅ Use vector format (SVG) when possible - scales perfectly
- ✅ PNG with transparent background is second choice
- ✅ Ensure logo is recognizable at small sizes
- ✅ Keep aspect ratio reasonable (not too wide or tall)
- ❌ Don't use JPG - creates white background
- ❌ Don't use logos with tiny text - won't be readable

### Site Name
- ✅ Keep it concise (2-4 words ideal)
- ✅ Make it memorable and relevant
- ❌ Don't make it too long (affects mobile display)

---

## 🔧 Troubleshooting

### Color not applying?
1. Make sure you clicked **Save Changes**
2. Refresh the page (hard refresh: Ctrl+Shift+R)
3. Check browser console for errors
4. Verify color code is valid hex (e.g., `#007bff`)

### Logo not showing?
1. Verify file uploaded successfully (check for "Uploading..." message)
2. Ensure image format is supported (PNG, SVG, JPG)
3. Try a smaller file size (< 2MB recommended)
4. Check file permissions in `/public/assets/`

### Changes not visible on frontend?
1. Hard refresh the page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check if `BrandingProvider` is loaded in layout
4. Verify API endpoints are responding

### Preview looks different than live site?
- Preview is a simplified version
- Full site may have additional styling
- Test on actual pages after saving

---

## 📚 Related Documentation

- [BRANDING_GUIDE.md](./BRANDING_GUIDE.md) - Manual branding instructions (legacy)
- [ADMIN.md](./ADMIN.md) - Admin panel documentation
- Database schema: `prisma/schema.prisma` → `BrandingSettings` model

---

## 🎓 Examples

### Example 1: Corporate Blue Theme
```
Primary Color: #0066cc
Site Name: Blue Corp Marketplace
Logo: Blue corporate logo (PNG, 1200x300px)
Light Logo: White version for dark footer
```

### Example 2: Eco-Friendly Green
```
Primary Color: #28a745
Site Name: Green Local Deals
Logo: Leaf icon + text (SVG)
Favicon: Simple leaf icon (32x32px)
```

### Example 3: Vibrant Orange
```
Primary Color: #ff6600
Site Name: Orange Market Hub
Logo: Orange geometric design (SVG)
Light Logo: White outline version
```

---

## 💡 Pro Tips

1. **Test on mobile**: After changing branding, check on phone to ensure logos aren't too big

2. **Keep backups**: Save original logo files before uploading new ones

3. **Brand consistency**: Use the same colors across all materials (website, social media, print)

4. **Accessibility**: Run color contrast checker (WebAIM Contrast Checker) to ensure compliance

5. **Performance**: Optimize logo files (compress PNGs, minify SVGs) for faster loading

6. **Version control**: If unsure about changes, note down original settings before making changes

---

## 🆘 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify API endpoints are accessible
3. Check browser console for JavaScript errors
4. Review Prisma database connection
5. Check server logs for upload errors

---

**Last Updated**: February 2025  
**Version**: 1.0
