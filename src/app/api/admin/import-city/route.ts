import { NextRequest, NextResponse } from "next/server"
import { importCityBusinesses } from "@/services/admin/adminImport.service"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

async function getAdminId(req: NextRequest): Promise<string | null> {
  // First try header set by middleware
  const fromHeader = req.headers.get("x-admin-id")
  if (fromHeader) return fromHeader

  // Fallback: read token directly from cookie
  const token = req.cookies.get("admin_token")?.value
  if (!token) return null

  try {
    const decoded: any = verifyToken(token)
    return decoded.userId || null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminId = await getAdminId(req)
    const { city, category } = await req.json()

    if (!city || !category) return NextResponse.json({ error: "Missing city or category" }, { status: 400 })

    const cityRecord = await prisma.city.findFirst({ where: { name: city } })
    if (!cityRecord) return NextResponse.json({ error: `City not found: ${city}` }, { status: 400 })

    const categoryRecord = await prisma.category.findFirst({ where: { google_type: category } })
    if (!categoryRecord) return NextResponse.json({ error: `Category not found: ${category}` }, { status: 400 })

    const result = await importCityBusinesses(adminId, cityRecord.id, categoryRecord.id)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed"
    console.error("[import-city]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
