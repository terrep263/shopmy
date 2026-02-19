/**
 * Admin Tool Module Registry
 * 
 * Centralized registry of all admin tools available in the platform.
 * Add new tools here to make them available in the admin dashboard.
 */

import { AdminTool } from "./types";

export const ADMIN_TOOL_REGISTRY: AdminTool[] = [
  // =========================================
  // OPERATIONS CATEGORY
  // =========================================
  {
    id: "importer",
    name: "Business Importer",
    description: "Import businesses from Google Places by city and category",
    icon: "mdi-import",
    launchMode: "page",
    route: "/admin/tools/importer",
    permission: "admin",
    enabled: true,
    category: "operations",
    sortOrder: 1,
  },
  {
    id: "dealguard",
    name: "DealGuard Studio",
    description: "AI-powered deal generation and validation",
    icon: "mdi-shield-check",
    launchMode: "page",
    route: "/admin/tools/dealguard",
    permission: "admin",
    enabled: true,
    category: "operations",
    sortOrder: 2,
  },

  // =========================================
  // CONTENT CATEGORY
  // =========================================
  {
    id: "city-manager",
    name: "City Manager",
    description: "Create and manage cities for business imports",
    icon: "mdi-city",
    launchMode: "page",
    route: "/admin/tools/cities",
    permission: "admin",
    enabled: true,
    category: "content",
    sortOrder: 1,
  },
  {
    id: "category-manager",
    name: "Category Manager",
    description: "Create and manage business categories",
    icon: "mdi-tag-multiple",
    launchMode: "page",
    route: "/admin/tools/categories",
    permission: "admin",
    enabled: true,
    category: "content",
    sortOrder: 2,
  },

  // =========================================
  // MANAGEMENT CATEGORY
  // =========================================
  {
    id: "vendor-manager",
    name: "Vendor Manager",
    description: "Review and manage vendor accounts and status",
    icon: "mdi-store",
    launchMode: "page",
    route: "/admin/tools/vendors",
    permission: "admin",
    enabled: true,
    category: "management",
    sortOrder: 1,
  },
  {
    id: "voucher-manager",
    name: "Voucher Manager",
    description: "View and manage customer vouchers",
    icon: "mdi-ticket-confirmation",
    launchMode: "page",
    route: "/admin/tools/vouchers",
    permission: "admin",
    enabled: true,
    category: "management",
    sortOrder: 2,
  },

  // =========================================
  // REPORTS CATEGORY
  // =========================================
  {
    id: "admin-logs",
    name: "Admin Logs",
    description: "View platform admin action logs",
    icon: "mdi-file-document-multiple",
    launchMode: "page",
    route: "/admin/tools/logs",
    permission: "admin",
    enabled: true,
    category: "reports",
    sortOrder: 1,
  },
];

/**
 * Get a tool by its ID
 */
export function getToolById(toolId: string): AdminTool | undefined {
  return ADMIN_TOOL_REGISTRY.find((tool) => tool.id === toolId);
}

/**
 * Get all enabled tools
 */
export function getEnabledTools(): AdminTool[] {
  return ADMIN_TOOL_REGISTRY.filter((tool) => tool.enabled);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(
  category: AdminTool["category"]
): AdminTool[] {
  return ADMIN_TOOL_REGISTRY.filter(
    (tool) => tool.category === category && tool.enabled
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Get all categories with their tools
 */
export function getToolsByAllCategories(): Record<
  AdminTool["category"],
  AdminTool[]
> {
  return {
    operations: getToolsByCategory("operations"),
    content: getToolsByCategory("content"),
    management: getToolsByCategory("management"),
    reports: getToolsByCategory("reports"),
  };
}
