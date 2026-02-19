import { NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { createCity, listCities, toggleCity } from "@/services/admin/adminCity.service"
import { logAdminAction } from "@/services/admin/adminLogger.service"

export async function GET() {
  try {
    await requireAdminUser()
    const cities = await listCities()
    return NextResponse.json(cities)
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
    const { name } = body

    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 })

    const city = await createCity(name)
    await logAdminAction(admin.id, "CREATE_CITY", "City", city.id, { name })

    return NextResponse.json(city)
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

    const city = await toggleCity(id, active)
    await logAdminAction(admin.id, "TOGGLE_CITY", "City", id, { active })

    return NextResponse.json(city)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
