import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/adminGuard"

export async function GET() {

  try {

    await requireAdmin()

    const deals = await prisma.deal.findMany({

      include: {
        vendor: {
          include: {
            business: true
          }
        }
      },

      orderBy: {
        created_at: "desc"
      }

    })

    return new Response(JSON.stringify(deals), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {

    const message = err instanceof Error ? err.message : "Unauthorized"
    if (message === "Forbidden")
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } })
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } })
  }
}
