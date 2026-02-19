# Admin Tool Module System - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN TOOL MODULE SYSTEM                          │
│                         ShopMyNeighborhood Platform                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           REGISTRY LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  src/admin-tools/registry.ts                                             │
│                                                                          │
│  ADMIN_TOOL_REGISTRY: AdminTool[] = [                                   │
│    ┌──────────────────┬──────────────────┬──────────────────┐          │
│    │   OPERATIONS     │     CONTENT      │   MANAGEMENT     │          │
│    ├──────────────────┼──────────────────┼──────────────────┤          │
│    │ • Importer       │ • City Manager   │ • Vendor Manager │          │
│    │ • DealGuard      │ • Category Mgr   │ • Voucher Mgr    │          │
│    └──────────────────┴──────────────────┴──────────────────┘          │
│    ┌──────────────────┬──────────────────┐                             │
│    │     REPORTS      │   CUSTOMIZATION  │                             │
│    ├──────────────────┼──────────────────┤                             │
│    │ • Admin Logs     │ • 🎨 Branding Mgr│                             │
│    └──────────────────┴──────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CONTEXT PROVIDER LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│  src/admin-tools/context.tsx                                             │
│                                                                          │
│  <AdminToolProvider>                                                     │
│    ├─ launchTool(toolId)                                                │
│    ├─ closeTool()                                                       │
│    ├─ getTool(toolId)                                                   │
│    ├─ getEnabledTools()                                                 │
│    └─ getToolsByCategory(category)                                      │
│                                                                          │
│  useAdminTools() hook                                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  src/app/admin/dashboard/page.tsx                                        │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │  Platform Admin Dashboard                                    │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │  Stats Cards: Businesses • Deals • Vouchers • Vendors       │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │  Platform Operations                                         │       │
│  │  ┌─────────────────┬─────────────────┐                     │       │
│  │  │ 📥 Importer     │ 🛡️ DealGuard    │                     │       │
│  │  │ Launch Tool →   │ Launch Tool →   │                     │       │
│  │  └─────────────────┴─────────────────┘                     │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │  Content Management                                          │       │
│  │  ┌─────────────────┬─────────────────┐                     │       │
│  │  │ 🏙️ Cities       │ 🏷️ Categories   │                     │       │
│  │  │ Launch Tool →   │ Launch Tool →   │                     │       │
│  │  └─────────────────┴─────────────────┘                     │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │  Account Management                                          │       │
│  │  ┌─────────────────┬─────────────────┐                     │       │
│  │  │ 🏪 Vendors      │ 🎫 Vouchers     │                     │       │
│  │  │ Launch Tool →   │ Launch Tool →   │                     │       │
│  │  └─────────────────┴─────────────────┘                     │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │  Reports & Logs                                              │       │
│  │  ┌─────────────────┐                                        │       │
│  │  │ 📋 Admin Logs   │                                        │       │
│  │  │ Launch Tool →   │                                        │       │
│  │  └─────────────────┘                                        │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │  Platform Customization                                      │       │
│  │  ┌─────────────────┐                                        │       │
│  │  │ 🎨 Branding     │ NEW! Visual customization             │       │
│  │  │ Launch Tool →   │ • Colors • Logos • Site name          │       │
│  │  └─────────────────┘                                        │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
┌─────────────────────────┬─────────────────────────┬──────────────────────┐
│    TOOL UI PAGES        │   SERVICE LAYER         │   API ROUTES         │
├─────────────────────────┼─────────────────────────┼──────────────────────┤
│ /admin/tools/           │ src/services/admin/     │ /api/admin/          │
│                         │                         │                      │
│ • importer/page.tsx     │ • adminImport.service   │ • import-city        │
│ 🎨 /admin/branding/     │                         │ • branding/route     │
│    page.tsx (NEW!)      │                         │ • branding/upload    │
│ • dealguard/page.tsx    │ • adminDeal.service     │ • deals/generate     │
│ • cities/page.tsx       │ • adminCity.service     │ • cities             │
│ • categories/page.tsx   │ • adminCategory.service │ • categories         │
│ • vendors/page.tsx      │ • adminVendor.service   │ • vendors            │
│ • vouchers/page.tsx     │ • adminVoucher.service  │ • vouchers           │
│ • logs/page.tsx         │ • adminLog.service      │ • logs               │
│                         │                         │                      │
│ Each page:              │ Service features:       │ Route features:      │
│ ✓ AdminLayout wrapper   │ ✓ Business logic        │ ✓ requireAdminUser() │
│ ✓ Back to Dashboard     │ ✓ Database access       │ ✓ JSON responses     │
│ ✓ Form inputs           │ ✓ Validation            │ ✓ Error handling     │
│ ✓ Error handling        │ ✓ Logging               │ ✓ HTTP methods       │
│ ✓ Success feedback      │ ✓ Transactions          │                      │
└─────────────────────────┴─────────────────────────┴──────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  PostgreSQL via Prisma ORM                                               │
│                                                                          │
│  Tables:                                                                 │
│  ├─ User (admins, vendors, customers)                                   │
│  ├─ Business (imported from Google Places)                              │
│  ├─ City (for organizing imports)                                       │
│  ├─ Category (business types)                                           │
│  ├─ Vendor (approved business owners)                                   │
│  ├─ Deal (created by vendors or admins)                                 │
│  ├─ Voucher (purchased by customers)                                    │
│  └─ AdminAction (audit log)                                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────┘

EXAMPLE: Business Import Flow

1. Admin clicks "Launch Tool →" on Business Importer card
                    │
                    ▼
2. Dashboard calls launchTool('importer')
                    │
                    ▼
3. Context provider navigates to /admin/tools/importer
                    │
                    ▼
4. Importer page loads cities and categories
   GET /api/admin/cities
   GET /api/admin/categories
                    │
                    ▼
5. Admin selects city and category, clicks "Start Import"
                    │
                    ▼
6. POST /api/admin/import-city
   { cityId: 1, categoryId: 5 }
                    │
                    ▼
7. API route calls adminImport.service.importCityBusinesses()
                    │
                    ▼
8. Service validates city/category are active
                    │
                    ▼
9. Service calls googlePlaces.service.fetchBusinesses()
   (3 pages, 2-second delay between pages)
                    │
                    ▼
10. Service creates Business records in database
    (skips duplicates by google_place_id)
                    │
                    ▼
11. Service logs action to AdminAction table
                    │
                    ▼
12. API returns { totalFetched: 60, created: 45, skipped: 15 }
                    │
                    ▼
13. UI displays success message with statistics

┌─────────────────────────────────────────────────────────────────────────┐
│                     TOOL REGISTRATION PATTERN                            │
└─────────────────────────────────────────────────────────────────────────┘

To add a new tool:

1. Create tool module: src/admin-tools/tools/my-tool.ts
   ├─ Define AdminToolModule object
   └─ Export myTool

2. Register in registry: src/admin-tools/registry.ts
   ├─ Add to ADMIN_TOOL_REGISTRY array
   └─ Assign category and sort order

3. Create UI page: src/app/admin/tools/my-tool/page.tsx
   ├─ Wrap with AdminLayout
   ├─ Add form/display logic
   └─ Call API routes

4. Export from tools/index.ts
   └─ export { myTool } from './my-tool'

5. Tool automatically appears on dashboard!
   └─ Grouped by category
   └─ Launch button with routing

┌─────────────────────────────────────────────────────────────────────────┐
│                         LAUNCH MODE MATRIX                               │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┬────────────────┬──────────────────────────────────────┐
│ Launch Mode  │    Status      │          Description                 │
├──────────────┼────────────────┼──────────────────────────────────────┤
│ PAGE         │ ✅ Implemented │ Full-page tool with dedicated route  │
│ PANEL        │ 🔜 Planned     │ Sidebar panel (slides from right)    │
│ MODAL        │ 🔜 Planned     │ Overlay modal dialog                 │
└──────────────┴────────────────┴──────────────────────────────────────┘

Current Implementation: All 7 tools use PAGE mode
Future: Panel and Modal modes for quick actions

┌─────────────────────────────────────────────────────────────────────────┐
│                      PERMISSION SYSTEM                                   │
└─────────────────────────────────────────────────────────────────────────┘

Current: All tools require 'admin' permission
Future: Role-based access control

┌──────────────────┬─────────────────────────────────────────────┐
│  Permission      │              Access                         │
├──────────────────┼─────────────────────────────────────────────┤
│ admin            │ All 7 tools                                 │
│ super_admin      │ Reserved for enhanced permissions           │
└──────────────────┴─────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        FILE STRUCTURE                                    │
└─────────────────────────────────────────────────────────────────────────┘

src/
├── admin-tools/                      ← Admin Tool Module System
│   ├── types.ts                      ← TypeScript interfaces
│   ├── registry.ts                   ← Tool registry with 7 tools
│   ├── context.tsx                   ← React context provider
│   ├── index.ts                      ← Main export point
│   ├── README.md                     ← System documentation
│   └── tools/                        ← Tool modules
│       ├── importer.ts
│       ├── dealguard.ts
│       ├── city.ts
│       ├── category.ts
│       ├── vendor.ts
│       ├── voucher.ts
│       ├── logs.ts
│       └── index.ts
├── app/
│   └── admin/
│       ├── dashboard/
│       │   ├── page.tsx              ← Registry-based dashboard
│       │   └── page-old-tabbed.tsx   ← Backup of previous version
│       ├── branding/
│       │   └── page.tsx              ← 🎨 Branding Manager (NEW!)
│       └── tools/                    ← Tool UI pages
│           ├── importer/
│           │   └── page.tsx
│           ├── dealguard/
│           │   └── page.tsx
│           ├── cities/
│           │   └── page.tsx
│           ├── categories/
│           │   └── page.tsx
│           ├── vendors/
│           │   └── page.tsx
│           ├── vouchers/
│           │   └── page.tsx
│           └── logs/
│               └── page.tsx
├── components/
│   ├── BrandingProvider.tsx          ← 🎨 Dynamic branding loader (NEW!)
│   └── admin/
│       └── AdminLayout.tsx           ← Wrapped with AdminToolProvider
├── api/
│   └── admin/
│       └── branding/                 ← 🎨 Branding API (NEW!)
│           ├── route.ts              ← GET/POST settings
│           └── upload/
│               └── route.ts          ← File upload handler
└── services/
    └── admin/                        ← Admin service layer

┌─────────────────────────────────────────────────────────────────────────┐
│                  🎨 BRANDING MANAGER SYSTEM (NEW!)                       │
└─────────────────────────────────────────────────────────────────────────┘

A complete visual branding customization system for non-technical users.

┌─────────────────────────────────────────────────────────────────────────┐
│                       BRANDING ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   Admin UI       │  /admin/branding
│   Color Picker   │  • Visual color selection
│   Logo Upload    │  • Main & light logos
│   File Manager   │  • Favicon support
│   Live Preview   │  • Real-time preview
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   API Layer      │  /api/admin/branding
│   GET settings   │  • Fetch current branding
│   POST settings  │  • Save changes
│   POST upload    │  • Handle file uploads
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Database       │  BrandingSettings model
│   primary_color  │  • Hex color code
│   logo_url       │  • Main logo path
│   logo_light_url │  • Light logo path
│   site_name      │  • Site name
│   favicon_url    │  • Favicon path
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Runtime Apply   │  BrandingProvider component
│  CSS Variables   │  • Inject --bs-primary
│  Logo Updates    │  • Replace img sources
│  Title Updates   │  • Change page title
│  Favicon Inject  │  • Dynamic favicon
└──────────────────┘

Features:
✅ No-code color customization
✅ Visual color picker with hex input
✅ Drag & drop logo upload
✅ Live preview panel
✅ Instant application (no restart needed)
✅ File storage in /public/assets/
✅ Database-driven configuration
✅ Responsive design

Database Schema:
```prisma
model BrandingSettings {
  id                String   @id @default(uuid())
  primary_color     String   @default("#c71f37")
  logo_url          String?
  logo_light_url    String?
  site_name         String   @default("Shop My Neighborhood")
  favicon_url       String?
  updated_at        DateTime @updatedAt
  created_at        DateTime @default(now())
}
```

Documentation:
📖 BRANDING_MANAGER_GUIDE.md     - Complete user guide
📖 BRANDING_MANAGER_SUMMARY.md   - Technical overview
📖 BRANDING_GUIDE.md              - Legacy manual instructions

        ├── adminImport.service.ts
        ├── adminDeal.service.ts
        ├── adminCity.service.ts
        ├── adminCategory.service.ts
        ├── adminVendor.service.ts
        ├── adminVoucher.service.ts
        ├── adminLog.service.ts
        └── adminLogger.service.ts
