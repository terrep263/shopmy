import { readdir, stat } from 'fs/promises'
import { join } from 'path'

/**
 * Valid image extensions
 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

/**
 * Recursively scan /public/uploads/ and return all image URLs
 */
export async function scanMediaFiles(
  dirPath: string = 'public/uploads',
  prefix: string = '/uploads'
): Promise<string[]> {
  const urls: string[] = []

  try {
    const fullPath = join(process.cwd(), dirPath)
    const entries = await readdir(fullPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = join(fullPath, entry.name)
      const entryUrl = `${prefix}/${entry.name}`

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subUrls = await scanMediaFiles(
          join(dirPath, entry.name),
          entryUrl
        )
        urls.push(...subUrls)
      } else if (entry.isFile()) {
        // Check if it's an image file
        const ext = entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase()
        if (IMAGE_EXTENSIONS.includes(ext)) {
          urls.push(entryUrl)
        }
      }
    }
  } catch (error) {
    console.error('Error scanning media files:', error)
  }

  return urls.sort().reverse() // Most recent first
}
