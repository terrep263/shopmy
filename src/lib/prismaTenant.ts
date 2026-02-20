import { prisma } from "@/lib/prisma"
import { resolveTenant } from "@/lib/tenantContext"

export async function tenantScope() {
  const tenantId = await resolveTenant()

  return {
    tenantId,

    business: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.business.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },

    city: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.city.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },

    category: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.category.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },

    vendor: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.vendor.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },

    deal: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.deal.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },

    voucher: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.voucher.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },

    user: {
      findMany: (args: Record<string, unknown> = {}) =>
        prisma.user.findMany({
          ...(args as object),
          where: {
            ...(args as { where?: object }).where,
            tenant_id: tenantId,
          },
        }),
    },
  }
}
