import { Data } from "@measured/puck"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "puck-data.json")

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
 * Save Puck data to storage
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
 * Load Puck data from storage
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
