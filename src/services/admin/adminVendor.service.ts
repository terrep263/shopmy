import { prisma } from "@/lib/prisma"
import { logAdminAction } from "./adminLogger.service"

export async function listVendors() {
  return prisma.vendor.findMany({
    include: {
      business: true,
      user: true,
      deals: true
    },
    orderBy: { created_at: "desc" }
  })
}

export async function updateVendorStatus(adminId: string, vendorId: string, status: "active" | "inactive" | "expired") {
  const vendor = await prisma.vendor.update({
    where: { id: vendorId },
    data: { subscription_status: status }
  })

  await logAdminAction(adminId, "UPDATE_VENDOR_STATUS", "Vendor", vendorId, { status })

  return vendor
}
