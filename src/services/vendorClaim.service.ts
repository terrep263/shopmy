import { prisma } from "@/lib/prisma"

export async function claimBusiness(userId: string, businessId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user || user.role !== "vendor") {
    throw new Error("Unauthorized")
  }

  const existingVendor = await prisma.vendor.findUnique({
    where: { user_id: userId }
  })

  if (existingVendor) {
    throw new Error("User already owns a business")
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId }
  })

  if (!business) {
    throw new Error("Business not found")
  }

  if (business.claimed) {
    throw new Error("Business already claimed")
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.business.update({
      where: { id: businessId },
      data: { claimed: true }
    })

    const vendor = await tx.vendor.create({
      data: {
        user_id: userId,
        business_id: businessId,
        subscription_status: "inactive"
      }
    })

    return vendor
  })

  return result
}
