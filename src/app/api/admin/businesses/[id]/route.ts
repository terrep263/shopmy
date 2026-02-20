import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { resolveTenant } from "@/lib/tenantContext"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await resolveTenant()
    const { id } = await params
    const business = await prisma.business.findFirst({
      where: { id, tenant_id: tenant.id },
      include: {
        city_rel: { select: { id: true, name: true } },
        category_rel: { select: { id: true, name: true } },
      },
    })
    if (!business)
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    return NextResponse.json(business)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await resolveTenant()
    const { id } = await params
    const body = await req.json()

    const business = await prisma.business.findFirst({
      where: { id, tenant_id: tenant.id },
    })
    if (!business)
      return NextResponse.json({ error: "Business not found" }, { status: 404 })

    const updated = await prisma.business.update({
      where: { id },
      data: {
        name: body.name ?? business.name,
        address: body.address ?? business.address,
        city: body.city ?? business.city,
        category: body.category ?? business.category,
        cityId:
          body.cityId !== undefined ? body.cityId || null : business.cityId,
        categoryId:
          body.categoryId !== undefined
            ? body.categoryId || null
            : business.categoryId,
        national_phone_number:
          body.national_phone_number !== undefined
            ? body.national_phone_number
            : business.national_phone_number,
        international_phone_number:
          body.international_phone_number !== undefined
            ? body.international_phone_number
            : business.international_phone_number,
        website_uri:
          body.website_uri !== undefined
            ? body.website_uri
            : business.website_uri,
        is_verified:
          body.is_verified !== undefined
            ? body.is_verified
            : business.is_verified,
        editorial_summary:
          body.editorial_summary !== undefined
            ? body.editorial_summary
            : business.editorial_summary,
        updated_at: new Date(),
      },
      include: {
        city_rel: { select: { id: true, name: true } },
        category_rel: { select: { id: true, name: true } },
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await resolveTenant()
    const { id } = await params

    const business = await prisma.business.findFirst({
      where: { id, tenant_id: tenant.id },
    })
    if (!business)
      return NextResponse.json({ error: "Business not found" }, { status: 404 })

    // Soft delete
    await prisma.business.update({
      where: { id },
      data: { deleted_at: new Date(), updated_at: new Date() },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    )
  }
}
