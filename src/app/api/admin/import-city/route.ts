import { NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { importCityBusinesses } from "@/services/admin/adminImport.service"

export async function POST(req: Request) {
  try {
    const admin = await requireAdminUser()
    const body = await req.json()
    const { cityId, categoryId } = body

    if (!cityId || !categoryId) {
      return NextResponse.json({ error: "Missing cityId or categoryId" }, { status: 400 })
    }

    const result = await importCityBusinesses(admin.id, cityId, categoryId)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Import failed"
    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
