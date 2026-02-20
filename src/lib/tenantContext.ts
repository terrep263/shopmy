import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

let cachedTenant: { id: string; name: string } | null = null

export async function resolveTenant() {
  if (cachedTenant) return cachedTenant

  const headerList = await headers()
  const host = headerList.get("host")

  let tenantId = "tenant_lake_county"

  if (host) {
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { domain: host },
          { slug: host.split(".")[0] },
        ],
      },
    })

    if (tenant) {
      tenantId = tenant.id
    }
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  })

  if (tenant) {
    cachedTenant = tenant
    return tenant
  }

  return { id: tenantId, name: "Default Tenant" }
}
