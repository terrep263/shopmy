import { tenantScope } from "@/lib/prismaTenant"

export async function GET() {
  const db = await tenantScope()
  const deals = await db.deal.findMany({

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
