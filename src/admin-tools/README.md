# Admin Tool Module System

A centralized, registry-based system for managing platform administration tools in ShopMyNeighborhood.

## Overview

The Admin Tool Module System provides a unified approach to creating, registering, and launching admin tools. Each tool is self-contained with its own route, UI, and launch logic.

## Architecture

```
src/admin-tools/
├── types.ts          # TypeScript type definitions
├── registry.ts       # Centralized tool registry
├── context.tsx       # React context provider
├── index.ts          # Main export point
└── tools/            # Individual tool modules
    ├── importer.ts
    ├── dealguard.ts
    ├── city.ts
    ├── category.ts
    ├── vendor.ts
    ├── voucher.ts
    └── logs.ts
```

## Tool Categories

### Operations
- **Business Importer**: Import businesses from Google Places by city and category
- **DealGuard Studio**: AI-powered deal generation and validation

### Content Management
- **City Manager**: Create and manage cities for business imports
- **Category Manager**: Create and manage business categories

### Account Management
- **Vendor Manager**: Review and manage vendor accounts and status
- **Voucher Manager**: View and manage customer vouchers

### Reports & Logs
- **Admin Logs**: View platform admin action logs

## Creating a New Tool

### 1. Define Tool Module

Create a new file in `src/admin-tools/tools/`:

```typescript
import { AdminToolModule } from "../types";

export const myNewTool: AdminToolModule = {
  id: "my-new-tool",
  name: "My New Tool",
  description: "Description of what this tool does",
  icon: "mdi-icon-name",
  launchMode: "page",
  route: "/admin/tools/my-tool",
  permission: "admin",
  enabled: true,
  category: "operations",
  sortOrder: 10,

  launch: async () => {
    window.location.href = "/admin/tools/my-tool";
  },
};
```

### 2. Register Tool

Add to `ADMIN_TOOL_REGISTRY` in `src/admin-tools/registry.ts`:

```typescript
export const ADMIN_TOOL_REGISTRY: AdminTool[] = [
  // ... existing tools
  {
    id: "my-new-tool",
    name: "My New Tool",
    description: "Description of what this tool does",
    icon: "mdi-icon-name",
    launchMode: "page",
    route: "/admin/tools/my-tool",
    permission: "admin",
    enabled: true,
    category: "operations",
    sortOrder: 10,
  },
];
```

### 3. Create Tool UI Page

Create page at `src/app/admin/tools/my-tool/page.tsx`:

```tsx
'use client'
import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function MyNewToolPage() {
  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>My New Tool</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>
            {/* Tool content here */}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
```

### 4. Export Tool Module

Add to `src/admin-tools/tools/index.ts`:

```typescript
export { myNewTool } from "./my-tool";
```

## Launch Modes

### Page Mode (Recommended)
Full-page tool with its own route:
```typescript
launchMode: "page"
route: "/admin/tools/my-tool"
```

### Panel Mode (Future)
Sidebar panel that slides in from the side:
```typescript
launchMode: "panel"
```

### Modal Mode (Future)
Overlay modal dialog:
```typescript
launchMode: "modal"
```

## Usage in Components

### Access Registry

```typescript
import { getToolsByCategory, getEnabledTools } from '@/admin-tools/registry'

// Get all operations tools
const operationsTools = getToolsByCategory('operations')

// Get all enabled tools
const enabledTools = getEnabledTools()
```

### Use Context

```typescript
import { useAdminTools } from '@/admin-tools/context'

function MyComponent() {
  const { launchTool, getTool } = useAdminTools()
  
  const handleLaunch = () => {
    launchTool('importer')
  }
  
  return (
    <button onClick={handleLaunch}>
      Launch Importer
    </button>
  )
}
```

## Permission Levels

- `admin`: Standard platform admin access
- `super_admin`: Reserved for future enhanced permissions

## Tool Status

- `enabled: true`: Tool is visible and launchable
- `enabled: false`: Tool is hidden from dashboard

## Best Practices

1. **Self-Contained**: Each tool should be self-contained with its own logic
2. **Consistent UI**: Use AdminLayout wrapper for consistent navigation
3. **Back Navigation**: Always provide a "Back to Dashboard" link
4. **Error Handling**: Implement proper error states and loading indicators
5. **Responsive**: Ensure tools work on all screen sizes
6. **Accessibility**: Include proper ARIA labels and keyboard navigation

## Admin Dashboard Integration

The dashboard automatically renders tools from the registry:

```tsx
import { getToolsByAllCategories } from '@/admin-tools/registry'

const toolsByCategory = getToolsByAllCategories()

// Render tools grouped by category
Object.entries(toolsByCategory).map(([category, tools]) => (
  // ... render tool cards
))
```

## Future Enhancements

- [ ] Panel and modal launch modes
- [ ] Role-based permission system
- [ ] Tool search and filtering
- [ ] Tool favorites/pinning
- [ ] Tool analytics and usage tracking
- [ ] Tool keyboard shortcuts
- [ ] Tool configuration UI
- [ ] Dynamic tool loading/lazy loading

## Related Documentation

- [Admin Operations Architecture](../../ADMIN.md)
- [Service Layer Documentation](../services/admin/README.md)
- [API Routes Documentation](../app/api/admin/README.md)
