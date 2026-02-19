import { NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { createCategory, listCategories, toggleCategory } from "@/services/admin/adminCategory.service"
import { logAdminAction } from "@/services/admin/adminLogger.service"

export async function GET() {
  try {
    await requireAdminUser()
    const categories = await listCategories()
    return NextResponse.json(categories)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdminUser()
    const body = await req.json()
    const { name, googleType } = body

    if (!name || !googleType) return NextResponse.json({ error: "Missing name or googleType" }, { status: 400 })

    const category = await createCategory(name, googleType)
    await logAdminAction(admin.id, "CREATE_CATEGORY", "Category", category.id, { name, googleType })

    return NextResponse.json(category)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdminUser()
    const body = await req.json()
    const { id, active } = body

    if (!id || typeof active !== "boolean") {
      return NextResponse.json({ error: "Missing id or active" }, { status: 400 })
    }

    const category = await toggleCategory(id, active)
    await logAdminAction(admin.id, "TOGGLE_CATEGORY", "Category", id, { active })

    return NextResponse.json(category)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
