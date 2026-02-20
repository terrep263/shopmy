import { tenantScope } from "@/lib/prismaTenant"

export async function GET() {
  const db = await tenantScope()
  const businesses = await db.business.findMany({
    orderBy: { name: "asc" }
  })

  return new Response(JSON.stringify(businesses), {
    headers: { "Content-Type": "application/json" }
  })
}
