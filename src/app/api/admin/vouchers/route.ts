import { NextResponse } from "next/server"
import { requireAdminUser } from "@/services/admin/adminAuth.service"
import { listVouchers } from "@/services/admin/adminVoucher.service"

export async function GET(req: Request) {
  try {
    await requireAdminUser()

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const pageSize = Number(searchParams.get("pageSize") || 20)
    const status = searchParams.get("status") || undefined

    const result = await listVouchers({ page, pageSize, status })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
