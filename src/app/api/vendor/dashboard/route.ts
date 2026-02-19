import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/currentUser"

export async function GET() {

  const user = await getCurrentUser()

  if (!user)
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), { status: 401, headers: { "Content-Type": "application/json" } })

  const vendor = await prisma.vendor.findUnique({
    where: { user_id: user.userId },
    include: {
      business: true,
      deals: true
    }
  })

  if (!vendor)
    return new Response(JSON.stringify({
      error: "Vendor profile not found"
    }), { status: 404, headers: { "Content-Type": "application/json" } })

  return new Response(JSON.stringify(vendor), {
    headers: { "Content-Type": "application/json" }
  })
}
