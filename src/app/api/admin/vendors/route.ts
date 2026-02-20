import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const vendors = await prisma.vendor.findMany({ include: { business: true } })
    return NextResponse.json(vendors)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { vendorId, status } = await req.json()
    if (!vendorId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    const vendor = await prisma.vendor.update({ where: { id: vendorId }, data: { subscription_status: status } })
    return NextResponse.json({ vendor })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}
