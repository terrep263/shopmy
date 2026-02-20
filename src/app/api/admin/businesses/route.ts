import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTenant } from "@/lib/tenantContext"

export async function GET(req: NextRequest) {
  try {
    const tenant = await resolveTenant()
    const { searchParams } = new URL(req.url)

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25")))
    const search = searchParams.get("search")?.trim() || ""
    const cityId = searchParams.get("cityId") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const claimed = searchParams.get("claimed")
    const is_verified = searchParams.get("is_verified")
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    const where: Record<string, unknown> = {
      tenant_id: tenant.id,
    }

    if (!includeDeleted) {
      where.deleted_at = null
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { google_place_id: { contains: search, mode: "insensitive" } },
      ]
    }

    if (cityId) where.cityId = cityId
    if (categoryId) where.categoryId = categoryId
    if (claimed === "true") where.claimed = true
    if (claimed === "false") where.claimed = false
    if (is_verified === "true") where.is_verified = true
    if (is_verified === "false") where.is_verified = false

    const [data, total] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          city_rel: { select: { id: true, name: true } },
          category_rel: { select: { id: true, name: true } },
        },
      }),
      prisma.business.count({ where }),
    ])

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error"
    console.error("[/api/admin/businesses]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
