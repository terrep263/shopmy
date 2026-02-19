import { prisma } from "@/lib/prisma"

export async function listAdminActions(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize

  const [items, total] = await prisma.$transaction([
    prisma.adminAction.findMany({
      include: { admin: true },
      orderBy: { created_at: "desc" },
      skip,
      take: pageSize
    }),
    prisma.adminAction.count()
  ])

  return { items, total, page, pageSize }
}
