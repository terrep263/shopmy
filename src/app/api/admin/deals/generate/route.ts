import { NextRequest, NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { generateAdminDeal } from "@/services/admin/adminDeal.service"

export async function POST(req: NextRequest) {
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
    console.error("[deals/generate]", err)
    return NextResponse.json({ error: "Deal generation failed" }, { status: 500 })
  }
}
