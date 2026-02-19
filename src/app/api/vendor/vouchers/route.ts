import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/currentUser"

export async function GET() {

  const user = await getCurrentUser()

  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } })

  const vendor = await prisma.vendor.findUnique({
    where: { user_id: user.userId }
  })

  if (!vendor)
    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } })

  const vouchers = await prisma.voucher.findMany({
    where: {
      deal: {
        vendor_id: vendor.id
      }
    },
    include: {
      deal: true
    },
    orderBy: { issued_at: "desc" }
  })

  return new Response(JSON.stringify(vouchers), {
    headers: { "Content-Type": "application/json" }
  })
}
