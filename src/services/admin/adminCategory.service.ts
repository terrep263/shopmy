import { prisma } from "@/lib/prisma"

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createCategory(name: string, googleType: string) {
  return prisma.category.create({
    data: {
      name,
      google_type: googleType
    }
  })
}

export async function toggleCategory(id: string, active: boolean) {
  return prisma.category.update({
    where: { id },
    data: { active }
  })
}
