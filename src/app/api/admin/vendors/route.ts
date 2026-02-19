import { NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { listVendors, updateVendorStatus } from "@/services/admin/adminVendor.service"

export async function GET() {
  try {
    await requireAdminUser()
    const vendors = await listVendors()
    return NextResponse.json(vendors)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdminUser()
    const body = await req.json()
    const { vendorId, status } = body

    if (!vendorId || !status) {
      return NextResponse.json({ error: "Missing vendorId or status" }, { status: 400 })
    }

    const vendor = await updateVendorStatus(admin.id, vendorId, status)
    return NextResponse.json({ vendor })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
