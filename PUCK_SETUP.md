# Puck Visual Page Editor Integration

## Overview
Puck is now fully integrated into ShopMyNeighborhood, allowing you to visually build and edit pages using drag-and-drop components.

## Accessing the Editor

1. **Login as Admin**
   - Go to: http://localhost:3000/admin/login
   - Use credentials: `admin@shopmyneighborhood.com` / `changeme`

2. **Open Puck Editor**
   - From admin dashboard, click "🎨 Page Editor (Puck)"
   - Or go directly to: http://localhost:3000/admin/editor

## Available Components

### HeroBlock
- **Title**: Main hero heading
- **Subtitle**: Optional subheading
- **Background Image**: Path to background image

### BusinessGridBlock
- **Title**: Section title
- **Limit**: Number of businesses to show (placeholder for now)

### DealGridBlock
- **Title**: Section title  
- **Limit**: Number of deals to show (placeholder for now)

### BlogListBlock
- **Title**: Section title
- **Limit**: Number of blog posts to show (placeholder for now)

## How to Use

1. **Drag components** from the left sidebar onto the canvas
2. **Click any component** to edit its properties in the right panel
3. **Rearrange components** by dragging them up/down
4. **Delete components** using the trash icon
5. **Click "Publish"** to save your changes

## Viewing Your Page

After publishing, view your created page at:
- http://localhost:3000/puck-page

## Data Storage

Page data is stored in:
- `puck-data.json` at the project root
- Can be version-controlled or backed up

## API Endpoints

- `GET /api/puck/load` - Load saved page data
- `POST /api/puck/save` - Save page data

## Next Steps

### Connect Real Data

The current blocks show placeholder content. To connect real Prisma data:

1. **Update BusinessGridBlock** in `/puck/puck.config.tsx`
   - Import your business service
   - Fetch real businesses from database
   - Pass to component

2. **Update DealGridBlock**
   - Import deal service
   - Fetch real deals
   - Render with actual data

3. **Update BlogListBlock**
   - Import blog service
   - Fetch real blog posts
   - Display live content

### Add More Blocks

Create new blocks in `/puck/puck.config.tsx`:

```typescript
YourNewBlock: {
  fields: {
    title: { type: "text" },
    // Add more fields
  },
  defaultProps: {
    title: "Default Title",
  },
  render: ({ title }) => (
    <div>
      <h2>{title}</h2>
      {/* Your component JSX */}
    </div>
  ),
}
```

### Integrate ListingHub Components

Replace placeholder renders with actual ListingHub components:

```typescript
import { ExploreListingOne } from "@/components/listinghub/business"

BusinessGridBlock: {
  // ... fields
  render: (props) => <ExploreListingOne {...props} />
}
```

## Troubleshooting

**Editor not loading?**
- Check that `@measured/puck` is installed
- Verify admin authentication is working

**Changes not saving?**
- Check browser console for API errors
- Verify write permissions on project directory

**Components not rendering?**
- Check `/puck/puck.config.tsx` for syntax errors
- Verify config is properly exported

## Files Created

```
/puck/puck.config.tsx              # Puck component configuration
/src/lib/puckStorage.ts            # Data persistence layer
/src/app/admin/editor/page.tsx     # Editor UI route
/src/app/puck-page/page.tsx        # Rendered page route
/src/app/api/puck/save/route.ts    # Save API endpoint
/src/app/api/puck/load/route.ts    # Load API endpoint
/src/app/puck.css                  # Puck styling
puck-data.json                     # Saved page data (created on first publish)
```

## Security

- ✅ Editor is protected by admin middleware
- ✅ Only admins can access `/admin/editor`
- ✅ Login required at `/admin/login`
- ✅ JWT token verification enabled

## Current Status

✅ Puck editor fully functional  
✅ Data persistence working  
✅ Admin authentication integrated  
✅ Basic component blocks available  
⚠️ Blocks show placeholder content (connect to Prisma next)  
⚠️ ListingHub components not yet integrated into blocks  

Ready to build your pages visually! 🎨
