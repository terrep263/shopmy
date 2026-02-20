import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(categories)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-admin-id")!
    const { name, googleType } = await req.json()
    if (!name || !googleType) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const category = await prisma.category.create({ data: { name, google_type: googleType, tenant_id: "tenant_lake_county" } })
    await prisma.adminAction.create({ data: { admin_id: adminId, action_type: "CREATE_CATEGORY", entity_type: "Category", entity_id: category.id } })
    return NextResponse.json(category)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-admin-id")!
    const { id, active } = await req.json()
    if (!id || typeof active !== "boolean") return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const category = await prisma.category.update({ where: { id }, data: { active } })
    await prisma.adminAction.create({ data: { admin_id: adminId, action_type: "TOGGLE_CATEGORY", entity_type: "Category", entity_id: id, metadata: { active } } })
    return NextResponse.json(category)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}
