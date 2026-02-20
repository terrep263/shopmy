import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/currentUser"
import { generateDeal } from "@/services/dealGuard"
import { resolveTenant } from "@/lib/tenantContext"

export async function POST(req: Request) {

  try {

    const user = await getCurrentUser()

    if (!user)
      return new Response(JSON.stringify({
        error: "Unauthorized"
      }), { status: 401, headers: { "Content-Type": "application/json" } })

    const tenantId = await resolveTenant()

    const vendor = await prisma.vendor.findFirst({
      where: {
        user_id: user.userId,
        tenant_id: tenantId
      },
      include: {
        business: true
      }
    })

    if (!vendor)
      return new Response(JSON.stringify({
        error: "Vendor not found"
      }), { status: 404, headers: { "Content-Type": "application/json" } })

    const body = await req.json()

    const { price, originalValue, expirationDate } = body

    if (!price || !originalValue || !expirationDate)
      return new Response(JSON.stringify({
        error: "Missing fields"
      }), { status: 400, headers: { "Content-Type": "application/json" } })

    const aiDeal = await generateDeal({
      businessName: vendor.business.name,
      city: vendor.business.city,
      category: vendor.business.category,
      price: Number(price),
      originalValue: Number(originalValue)
    })

    const qualityScore = Math.min(100, Math.max(50, Number(aiDeal.quality_score) || 75))

    const deal = await prisma.deal.create({
      data: {
        vendor_id: vendor.id,
        title: aiDeal.title || `${vendor.business.name} Special Offer`,
        description: aiDeal.description || `Get an exclusive deal at ${vendor.business.name}.`,
        price: Number(price),
        original_value: Number(originalValue),
        expiration_date: new Date(expirationDate),
        quality_score: qualityScore,
        status: qualityScore >= 50 ? "published" : "pending_review",
        tenant_id: tenantId
      }
    })

    return new Response(JSON.stringify({
      success: true,
      deal
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {

    console.error(err)

    return new Response(JSON.stringify({
      error: "Deal creation failed"
    }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
