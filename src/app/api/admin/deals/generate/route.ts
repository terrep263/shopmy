import { NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { generateAdminDeal } from "@/services/admin/adminDeal.service"

export async function POST(req: Request) {
  try {
    const admin = await requireAdminUser()
    const body = await req.json()
    const { vendorId, price, originalValue, expirationDate } = body

    if (!vendorId || !price || !originalValue || !expirationDate) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const result = await generateAdminDeal(admin.id, vendorId, Number(price), Number(originalValue), expirationDate)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deal generation failed"
    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
