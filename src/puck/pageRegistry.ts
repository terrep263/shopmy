/**
 * Puck Page Registry — maps pageId slugs to routes and metadata.
 * Used by the Puck editor to know which pages are editable.
 */

export interface PageRegistryEntry {
  /** Unique page slug (used as file key) */
  pageId: string
  /** Display label in editor UI */
  label: string
  /** App Router path this page lives at */
  route: string
  /** Description for the editor sidebar */
  description?: string
}

export const pageRegistry: PageRegistryEntry[] = [
  {
    pageId: "homepage",
    label: "Homepage",
    route: "/",
    description: "Main landing page — hero, categories, listings, reviews, blog",
  },
  {
    pageId: "explore",
    label: "Explore (Grid)",
    route: "/explore",
    description: "Grid listing page with filters",
  },
  {
    pageId: "exploreList",
    label: "Explore (List)",
    route: "/explore-list",
    description: "List layout listing page with filters",
  },
  {
    pageId: "business",
    label: "Business Detail",
    route: "/business/[slug]",
    description: "Single business / listing detail page",
  },
  {
    pageId: "deal",
    label: "Deal Detail",
    route: "/deal/[slug]",
    description: "Single deal detail page",
  },
  {
    pageId: "blog",
    label: "Blog",
    route: "/blog",
    description: "Blog listing page with featured post",
  },
  {
    pageId: "vendorDashboard",
    label: "Vendor Dashboard",
    route: "/vendor/dashboard",
    description: "Vendor portal dashboard",
  },
]

/** Look up a registry entry by pageId */
export function getPageById(pageId: string): PageRegistryEntry | undefined {
  return pageRegistry.find((p) => p.pageId === pageId)
}

/** Get all registered page IDs */
export function getPageIds(): string[] {
  return pageRegistry.map((p) => p.pageId)
}
