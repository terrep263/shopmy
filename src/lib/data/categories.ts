/**
 * Server-side data loaders for categories.
 * Uses Prisma directly — do NOT import from client components.
 */
import { prisma } from '@/lib/prisma'
import type { SerializableCategory } from './types'

const DEFAULT_TENANT_ID = "tenant_lake_county"

/**
 * Fetch all active categories for the default tenant.
 * Returns serializable data safe for Server→Client prop passing.
 */
export async function getCategories(): Promise<SerializableCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        tenant_id: DEFAULT_TENANT_ID,
        active: true,
      },
      orderBy: { name: 'asc' },
    })

    // Count businesses per category
    const counts = await prisma.business.groupBy({
      by: ['categoryId'],
      where: {
        tenant_id: DEFAULT_TENANT_ID,
        deleted_at: null,
      },
      _count: { id: true },
    })

    const countMap = new Map(
      counts.map(c => [c.categoryId, c._count.id])
    )

    return categories.map(c => ({
      id: c.id,
      name: c.name,
      google_type: c.google_type,
      active: c.active,
      businessCount: countMap.get(c.id) ?? 0,
    }))
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}
