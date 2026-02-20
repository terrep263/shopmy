import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import type { File } from 'buffer'

/**
 * Sanitize filename by removing special characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\s.-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove consecutive dashes
    .toLowerCase()
}

/**
 * Generate unique filename with timestamp
 */
function generateUniqueFilename(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename)
  const timestamp = Date.now()
  const name = sanitized.replace(/\.[^.]+$/, '') // Remove extension
  const ext = sanitized.match(/\.[^.]+$/)?.[0] || ''
  return `${timestamp}-${name}${ext}`
}

/**
 * Get folder path based on current date (YYYY/MM)
 */
function getFolderPath(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}/${month}`
}

/**
 * Upload file to /public/uploads/YYYY/MM/
 */
export async function uploadMedia(
  buffer: Buffer,
  originalFilename: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file
    if (!buffer || buffer.length === 0) {
      return { success: false, error: 'File is empty' }
    }

    if (buffer.length > 10 * 1024 * 1024) {
      return { success: false, error: 'File too large (max 10MB)' }
    }

    // Generate paths
    const folderPath = getFolderPath()
    const uniqueFilename = generateUniqueFilename(originalFilename)
    const uploadDir = join(process.cwd(), 'public', 'uploads', folderPath)
    const filepath = join(uploadDir, uniqueFilename)
    const url = `/uploads/${folderPath}/${uniqueFilename}`

    // Create directories
    await mkdir(uploadDir, { recursive: true })

    // Write file
    await writeFile(filepath, buffer)

    return { success: true, url }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Failed to upload file' }
  }
}
