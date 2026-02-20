import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || 1)
    const pageSize = Number(searchParams.get("pageSize") || 50)
    const status = searchParams.get("status") || undefined
    const where = status ? { status: status as any } : {}
    const [items, total] = await Promise.all([
      prisma.voucher.findMany({
        where,
        include: { deal: { include: { vendor: { include: { business: true } } } } },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.voucher.count({ where })
    ])
    return NextResponse.json({ items, total, page, pageSize })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 })
  }
}
