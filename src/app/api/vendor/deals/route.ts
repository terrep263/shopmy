import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/currentUser"
import { resolveTenant } from "@/lib/tenantContext"
import { tenantScope } from "@/lib/prismaTenant"

export async function GET() {

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
    }
  })

  if (!vendor)
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" }
    })

  const db = await tenantScope()
  const deals = await db.deal.findMany({
    where: {
      vendor_id: vendor.id
    },
    orderBy: {
      created_at: "desc"
    }
  })

  return new Response(JSON.stringify(deals), {
    headers: { "Content-Type": "application/json" }
  })
}
