import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/currentUser"

export async function GET() {

  const user = await getCurrentUser()

  if (!user)
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), { status: 401, headers: { "Content-Type": "application/json" } })

  const vendor = await prisma.vendor.findUnique({
    where: {
      user_id: user.userId
    }
  })

  if (!vendor)
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" }
    })

  const deals = await prisma.deal.findMany({
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
