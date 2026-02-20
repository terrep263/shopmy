import prisma from "@/lib/prisma"
import { generateDeal } from "@/services/dealGuard"
import { logAdminAction } from "./adminLogger.service"

const DEFAULT_TENANT_ID = "tenant_lake_county"

export async function generateAdminDeal(
  adminId: string,
  vendorId: string,
  price: number,
  originalValue: number,
  expirationDate: string
) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: { business: true }
  })

  if (!vendor || !vendor.business) throw new Error("Vendor not found")

  const ai = await generateDeal({
    businessName: vendor.business.name,
    city: vendor.business.city,
    category: vendor.business.category,
    price,
    originalValue
  })

  const qualityScore = Number(ai.quality_score) || 50
  const status = qualityScore >= 50 ? "published" : "draft"

  const deal = await prisma.deal.create({
    data: {
      vendor_id: vendor.id,
      title: ai.title || `${vendor.business.name} Deal`,
      description: ai.description || "",
      price,
      original_value: originalValue,
      expiration_date: new Date(expirationDate),
      status,
      quality_score: qualityScore,
      tenant_id: vendor.tenant_id || DEFAULT_TENANT_ID
    }
  })

  await logAdminAction(adminId, "GENERATE_DEAL", "Deal", deal.id, {
    vendorId: vendor.id,
    qualityScore,
    status
  })

  return { deal, ai }
}
