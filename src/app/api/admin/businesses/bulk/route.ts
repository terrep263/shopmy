import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTenant } from "@/lib/tenantContext"

export async function POST(req: NextRequest) {
  try {
    const tenant = await resolveTenant()
    const { action, ids } = await req.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      )
    }

    // Ensure all businesses belong to this tenant
    const businesses = await prisma.business.findMany({
      where: { id: { in: ids }, tenant_id: tenant.id },
      select: { id: true },
    })
    const validIds = businesses.map((b) => b.id)

    if (validIds.length === 0) {
      return NextResponse.json(
        { error: "No valid businesses found" },
        { status: 404 }
      )
    }

    switch (action) {
      case "verify": {
        const result = await prisma.business.updateMany({
          where: { id: { in: validIds } },
          data: { is_verified: true, updated_at: new Date() },
        })
        return NextResponse.json({ success: true, updated: result.count })
      }
      case "unverify": {
        const result = await prisma.business.updateMany({
          where: { id: { in: validIds } },
          data: { is_verified: false, updated_at: new Date() },
        })
        return NextResponse.json({ success: true, updated: result.count })
      }
      case "delete": {
        // Soft delete
        const result = await prisma.business.updateMany({
          where: { id: { in: validIds } },
          data: { deleted_at: new Date(), updated_at: new Date() },
        })
        return NextResponse.json({ success: true, deleted: result.count })
      }
      case "restore": {
        const result = await prisma.business.updateMany({
          where: { id: { in: validIds } },
          data: { deleted_at: null, updated_at: new Date() },
        })
        return NextResponse.json({ success: true, restored: result.count })
      }
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error"
    console.error("[/api/admin/businesses/bulk]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
