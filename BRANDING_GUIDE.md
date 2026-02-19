# 🎨 Branding Guide: How to Change Logo and Colors

This guide explains how to customize your Shop My Neighborhood application's logo and color scheme.

---

## 📍 Quick Reference

**Logo Files:** Place in `/public/assets/` or `/public/img/`  
**Main Colors File:** `src/styles/listinghub/_custom.scss`  
**Current Primary Color:** `#c71f37` (Red)

---

## 1️⃣ Change the Logo

### Step 1: Add Your Logo File

Place your logo files in the public directory:
```
/public/
  assets/
    logo.png          ← Replace this file (main logo)
  img/
    logo-light.svg    ← Light version (for dark backgrounds)
    logo.svg          ← Dark version (for light backgrounds)
```

**Recommended sizes:**
- PNG: 200x200px or larger (transparent background)
- SVG: Vector format (best for scaling)

### Step 2: Update Logo Component

Edit [src/components/Logo.tsx](src/components/Logo.tsx):

```tsx
export default function Logo({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <img
      src="/assets/logo.png"        ← Change this path to your logo
      alt="ShopMyNeighborhood"      ← Update alt text
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}
```

### Step 3: Update Navbar/Footer Logos

These components reference logo files directly:

**Navbar:** [src/components/theme/navbar/them-navbar.tsx](src/components/theme/navbar/them-navbar.tsx)
```tsx
// Line 52:
<img src='/img/logo-light.svg' className="logo" alt=""/>
// Line 70:
<img src='/img/logo.svg' className='img-fluid lightLogo' alt='Logo'/>
```

**Footer:** [src/components/listinghub/shared/Footer.tsx](src/components/listinghub/shared/Footer.tsx)
```tsx
// Line 19:
<Image src='/img/logo-light.svg' width={160} height={0} alt="Footer Logo" className="img-fluid" />
```

**Admin Navbar:** [src/components/listinghub/layout/AdminNavbar.tsx](src/components/listinghub/layout/AdminNavbar.tsx)
```tsx
// Line 52:
<img src='/img/logo-light.svg' className="logo" alt="" />
```

---

## 2️⃣ Change Colors

### Primary Color (Brand Color)

Edit [src/styles/listinghub/_custom.scss](src/styles/listinghub/_custom.scss):

```scss
:root,
[data-bs-theme=light] {
  // MAIN BRAND COLOR
  --bs-primary: #c71f37;              ← Change this to your brand color
  --bs-primary-2: #d02b38;            ← Slightly lighter variant
  --bs-primary-rgb: 226, 55, 68;      ← RGB values (update to match)
  --bs-primary-text-emphasis: #c71f37;
  --bs-primary-bg-subtle: #fae8eb;    ← Light background tint
  --bs-primary-bg-dark: #dd2e3b;      ← Dark variant
  --bs-primary-border-subtle: #ffdee2; ← Border tint
  
  // HOVER STATE
  --bs-link-hover-color: #c71f37;     ← Link hover color
}
```

### Example Color Schemes

**Blue Theme:**
```scss
--bs-primary: #0d6efd;
--bs-primary-2: #2680ff;
--bs-primary-rgb: 13, 110, 253;
--bs-primary-bg-subtle: #e7f1ff;
--bs-link-hover-color: #0d6efd;
```

**Green Theme:**
```scss
--bs-primary: #28a745;
--bs-primary-2: #34ce57;
--bs-primary-rgb: 40, 167, 69;
--bs-primary-bg-subtle: #d4edda;
--bs-link-hover-color: #28a745;
```

**Purple Theme:**
```scss
--bs-primary: #6f42c1;
--bs-primary-2: #8359d3;
--bs-primary-rgb: 111, 66, 193;
--bs-primary-bg-subtle: #e7e0f7;
--bs-link-hover-color: #6f42c1;
```

### Other Customizable Colors

In the same file ([_custom.scss](src/styles/listinghub/_custom.scss)):

```scss
// BACKGROUND COLORS
--bs-body-bg: #ffffff;        // Page background
--bs-card-bg: #ffffff;        // Card backgrounds
--bs-light: #f7f7f7;          // Light gray sections

// TEXT COLORS
--bs-body-color: #2b2b2b;     // Main text color
--paragraphColor: #2b2b2b;    // Paragraph text
--headingColor: #2b2b2b;      // Heading color
--bs-muted: #444c55;          // Muted/secondary text

// LINK COLORS
--bs-link-color: #212529;     // Default link color
--bs-link-hover-color: #c71f37; // Link hover color

// DARK THEME
--bs-dark: #212529;           // Dark sections
--bs-dark-text: #212529;      // Dark text
```

---

## 3️⃣ RGB Conversion Helper

When changing `--bs-primary`, update `--bs-primary-rgb` to match:

**Hex to RGB:**
- `#c71f37` → `199, 31, 55`
- `#0d6efd` → `13, 110, 253`
- `#28a745` → `40, 167, 69`

**Online Tool:** https://www.rapidtables.com/convert/color/hex-to-rgb.html

---

## 4️⃣ Testing Your Changes

### Step 1: Build and Run
```bash
npm run dev
```

### Step 2: Check These Pages
- Homepage: `/`
- Business page: `/business`
- Deals page: `/deals`
- Admin: `/admin/dashboard`

### Step 3: Verify Logo Appears In
- ✅ Navbar (top navigation)
- ✅ Footer (bottom)
- ✅ Admin panel
- ✅ Mobile menu

### Step 4: Verify Colors Changed
- ✅ Primary buttons
- ✅ Links (hover state)
- ✅ Badges/tags
- ✅ Active menu items
- ✅ Call-to-action sections

---

## 5️⃣ File Locations Summary

| What | File Path |
|------|-----------|
| Main logo component | [src/components/Logo.tsx](src/components/Logo.tsx) |
| Theme navbar | [src/components/theme/navbar/them-navbar.tsx](src/components/theme/navbar/them-navbar.tsx) |
| Footer | [src/components/listinghub/shared/Footer.tsx](src/components/listinghub/shared/Footer.tsx) |
| Admin navbar | [src/components/listinghub/layout/AdminNavbar.tsx](src/components/listinghub/layout/AdminNavbar.tsx) |
| **Colors (main)** | [src/styles/listinghub/_custom.scss](src/styles/listinghub/_custom.scss) |
| Logo files | `/public/assets/logo.png` |
| Logo files (alt) | `/public/img/logo.svg`, `/public/img/logo-light.svg` |

---

## 6️⃣ Pro Tips

### Logo Best Practices
1. **Use SVG when possible** - Scales perfectly on all screens
2. **Transparent background** - Works on light and dark sections
3. **Two versions** - Light logo for dark backgrounds, dark logo for light backgrounds
4. **Appropriate size** - 150-200px width recommended

### Color Best Practices
1. **Test contrast** - Ensure text is readable on colored backgrounds
2. **Use color picker** - Get exact hex values from your brand guide
3. **Update all variants** - Change primary, hover, subtle, dark versions
4. **Clear cache** - Hard refresh browser (Ctrl+Shift+R) after changes

### After Making Changes
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Check in multiple browsers
4. Test mobile responsive views

---

## 🎨 Color Palette Generator

Need help choosing colors? Try:
- **Coolors:** https://coolors.co/
- **Adobe Color:** https://color.adobe.com/
- **Material Palette:** https://www.materialpalette.com/

---

## ❓ Troubleshooting

**Logo not showing?**
- Check file path is correct
- Verify file exists in `/public/` folder
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors

**Colors not changing?**
- Make sure you're editing `_custom.scss` not regular `.css`
- Restart dev server after SCSS changes
- Check if build completed successfully
- Update RGB values to match hex color

**Logo appears pixelated?**
- Use higher resolution image (at least 200x200px)
- Switch to SVG format for crisp scaling
- Check image has transparent background

---

*Happy Branding! 🚀*
