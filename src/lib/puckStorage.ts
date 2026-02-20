import { Data } from "@measured/puck"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "puck-data.json")
const PAGES_DIR = path.join(process.cwd(), "puck-pages")

// Default page data structure
export const defaultPageData: Data = {
  content: [
    {
      type: "HeroBlock",
      props: {
        id: "hero-1",
        title: "Welcome to ShopMyNeighborhood",
        subtitle: "Discover amazing local deals in your area",
        backgroundImage: "/images/banner-8.jpg",
      },
    },
  ],
  root: {},
  zones: {},
}

/**
 * Save Puck data to storage (legacy — single page)
 */
export async function savePuckData(data: Data): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
    console.log("✅ Puck data saved successfully")
  } catch (error) {
    console.error("❌ Error saving Puck data:", error)
    throw new Error("Failed to save page data")
  }
}

/**
 * Load Puck data from storage (legacy — single page)
 */
export async function loadPuckData(): Promise<Data> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8")
    const data = JSON.parse(fileContent)
    console.log("✅ Puck data loaded successfully")
    return data
  } catch (error) {
    // If file doesn't exist, return default data
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("ℹ️ No saved data found, using default page data")
      return defaultPageData
    }
    console.error("❌ Error loading Puck data:", error)
    throw new Error("Failed to load page data")
  }
}

/**
 * Check if Puck data exists
 */
export async function puckDataExists(): Promise<boolean> {
  try {
    await fs.access(DATA_FILE)
    return true
  } catch {
    return false
  }
}

/* ────────────────────────────────────────────
   Multi-page Puck storage  (puck-pages/<id>.json)
   ──────────────────────────────────────────── */

function pageFile(pageId: string) {
  // Sanitise id to prevent directory traversal
  const safe = pageId.replace(/[^a-zA-Z0-9_-]/g, "")
  return path.join(PAGES_DIR, `${safe}.json`)
}

/**
 * Save Puck data for a specific page.
 */
export async function savePagePuckData(pageId: string, data: Data): Promise<void> {
  await fs.mkdir(PAGES_DIR, { recursive: true })
  await fs.writeFile(pageFile(pageId), JSON.stringify(data, null, 2), "utf-8")
  console.log(`✅ Puck page data saved for "${pageId}"`)
}

/**
 * Load Puck data for a specific page.
 * Returns null when no customisation exists (so the route can fall back to theme).
 */
export async function loadPagePuckData(pageId: string): Promise<Data | null> {
  try {
    const content = await fs.readFile(pageFile(pageId), "utf-8")
    return JSON.parse(content) as Data
  } catch {
    return null // no Puck override — use theme default
  }
}

/**
 * Delete Puck overrides for a page (revert to theme default).
 */
export async function deletePagePuckData(pageId: string): Promise<void> {
  try {
    await fs.unlink(pageFile(pageId))
  } catch {
    // already gone — fine
  }
}

/**
 * List all page IDs that have Puck overrides saved.
 */
export async function listPuckPages(): Promise<string[]> {
  try {
    const files = await fs.readdir(PAGES_DIR)
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
  } catch {
    return []
  }
}
