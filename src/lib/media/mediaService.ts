import fs from "fs/promises"
import path from "path"

const uploadsRoot = path.join(process.cwd(), "public", "uploads")

const ensurePosixPath = (value: string) => value.replace(/\\/g, "/")

export function getUploadsRoot() {
  return uploadsRoot
}

export function sanitizeFileName(originalName: string) {
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  const safeBase = baseName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")

  const safeExtension = extension
    .trim()
    .replace(/[^a-zA-Z0-9.]+/g, "")
    .toLowerCase()

  return {
    baseName: safeBase || "file",
    extension: safeExtension,
  }
}

export function buildUniqueFileName(originalName: string) {
  const { baseName, extension } = sanitizeFileName(originalName)
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  return `${timestamp}-${random}-${baseName}${extension}`
}

export function buildUploadDirectory(date = new Date()) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const relativeDir = path.join(year, month)
  const absoluteDir = path.join(uploadsRoot, relativeDir)
  return {
    year,
    month,
    relativeDir,
    absoluteDir,
  }
}

export async function saveUploadedFile(file: File) {
  const { relativeDir, absoluteDir } = buildUploadDirectory()
  await fs.mkdir(absoluteDir, { recursive: true })

  const fileName = buildUniqueFileName(file.name)
  const absolutePath = path.join(absoluteDir, fileName)
  const buffer = Buffer.from(await file.arrayBuffer())

  await fs.writeFile(absolutePath, buffer)

  const url = `/uploads/${ensurePosixPath(path.join(relativeDir, fileName))}`

  return { url, fileName, relativePath: path.join(relativeDir, fileName) }
}

async function walkDirectory(directory: string, entries: string[] = []) {
  const dirEntries = await fs.readdir(directory, { withFileTypes: true })

  for (const entry of dirEntries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await walkDirectory(absolutePath, entries)
    } else if (entry.isFile()) {
      entries.push(absolutePath)
    }
  }

  return entries
}

export async function listUploadedFiles() {
  try {
    await fs.access(uploadsRoot)
  } catch {
    return [] as string[]
  }

  const files = await walkDirectory(uploadsRoot)

  return files.map((filePath) => {
    const relative = ensurePosixPath(path.relative(uploadsRoot, filePath))
    return `/uploads/${relative}`
  })
}
