import prisma from "@/lib/prisma"

export async function listVouchers(params: { page: number; pageSize: number; status?: string }) {
  const { page, pageSize, status } = params
  const skip = (page - 1) * pageSize
  const where = status ? { status: status as any } : {}

  const [items, total] = await prisma.$transaction([
    prisma.voucher.findMany({
      where,
      include: {
        deal: {
          include: {
            vendor: {
              include: { business: true }
            }
          }
        }
      },
      orderBy: { issued_at: "desc" },
      skip,
      take: pageSize
    }),
    prisma.voucher.count({ where })
  ])

  return { items, total, page, pageSize }
}
