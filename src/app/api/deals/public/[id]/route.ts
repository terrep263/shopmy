import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  const deal = await prisma.deal.findUnique({

    where: {
      id
    },

    include: {
      vendor: {
        include: {
          business: true
        }
      }
    }

  })

  if (!deal)
    return new Response(JSON.stringify({
      error: "Deal not found"
    }), { status: 404, headers: { "Content-Type": "application/json" } })

  if (deal.status !== "published")
    return new Response(JSON.stringify({
      error: "Deal not found"
    }), { status: 404, headers: { "Content-Type": "application/json" } })

  return new Response(JSON.stringify(deal), {
    headers: { "Content-Type": "application/json" }
  })
}
