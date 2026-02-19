import { prisma } from "@/lib/prisma"

export async function GET() {

  const deals = await prisma.deal.findMany({

    where: {
      status: "published"
    },

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
    headers: {
      "Content-Type": "application/json"
    }
  })
}
