import prisma from "@/lib/prisma"

const DEFAULT_TENANT_ID = "tenant_lake_county"

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  })
}

export async function createCategory(name: string, googleType: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '_')
  const id = `cat_${slug}`
  
  return prisma.category.create({
    data: {
      id,
      name,
      google_type: googleType,
      tenant_id: DEFAULT_TENANT_ID
    }
  })
}

export async function toggleCategory(id: string, active: boolean) {
  return prisma.category.update({
    where: { id },
    data: { active }
  })
}
