import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const p = new PrismaClient({ adapter })

async function main() {
  const total = await p.business.count()

  // Check what photo_references actually contains
  const samples = await p.business.findMany({
    take: 3,
    select: { name: true, google_place_id: true, photo_references: true },
  })
  for (const s of samples) {
    console.log(`"${s.name}" | placeId: ${s.google_place_id} | photo_references: ${JSON.stringify(s.photo_references)} (type: ${typeof s.photo_references})`)
  }

  // Check with DbNull
  const { Prisma } = await import("@prisma/client")
  const dbNull = await p.business.count({
    where: { photo_references: { equals: Prisma.DbNull } },
  })
  const jsonNull = await p.business.count({
    where: { photo_references: { equals: Prisma.JsonNull } },
  })
  const hasArray = await p.business.count({
    where: { photo_references: { not: Prisma.DbNull } },
  })
  console.log(`\nTotal: ${total} | DbNull: ${dbNull} | JsonNull: ${jsonNull} | Not DbNull: ${hasArray}`)

  // Check on-disk photos
  const fs = await import("fs")
  const path = await import("path")
  const uploadDir = path.join(process.cwd(), "public", "uploads", "businesses")
  if (fs.existsSync(uploadDir)) {
    const dirs = fs.readdirSync(uploadDir).filter(d => fs.statSync(path.join(uploadDir, d)).isDirectory())
    const withFiles = dirs.filter(d => fs.readdirSync(path.join(uploadDir, d)).length > 0)
    console.log(`\nDisk: ${dirs.length} place folders, ${withFiles.length} with images`)
  }

  await p.$disconnect()
}

main()
