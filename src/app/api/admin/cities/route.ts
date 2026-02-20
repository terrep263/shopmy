import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(cities)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-admin-id")!
    const { name } = await req.json()
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 })
    const city = await prisma.city.create({ data: { name, tenant_id: "tenant_lake_county" } })
    await prisma.adminAction.create({ data: { admin_id: adminId, action_type: "CREATE_CITY", entity_type: "City", entity_id: city.id } })
    return NextResponse.json(city)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-admin-id")!
    const { id, active } = await req.json()
    if (!id || typeof active !== "boolean") return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const city = await prisma.city.update({ where: { id }, data: { active } })
    await prisma.adminAction.create({ data: { admin_id: adminId, action_type: "TOGGLE_CITY", entity_type: "City", entity_id: id, metadata: { active } } })
    return NextResponse.json(city)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}
