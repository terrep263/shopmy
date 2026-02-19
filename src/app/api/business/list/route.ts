import { prisma } from "@/lib/prisma"

export async function GET() {
  const businesses = await prisma.business.findMany({
    orderBy: { name: "asc" }
  })

  return new Response(JSON.stringify(businesses), {
    headers: { "Content-Type": "application/json" }
  })
}
