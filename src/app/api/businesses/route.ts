/**
 * Public API route — returns all active businesses as JSON.
 * GET /api/businesses
 */
import { prisma } from '@/lib/prisma'

const DEFAULT_TENANT_ID = "tenant_lake_county"

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        tenant_id: DEFAULT_TENANT_ID,
        OR: [
          { business_status: 'OPERATIONAL' },
          { business_status: null },
        ],
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
    })

    // Serialize Decimal / DateTime fields for JSON output
    const data = businesses.map(b => ({
      ...b,
      rating: b.rating != null ? Number(b.rating) : null,
      created_at: b.created_at.toISOString(),
      updated_at: b.updated_at?.toISOString() ?? null,
      deleted_at: null,
      claim_date: b.claim_date?.toISOString() ?? null,
      ai_last_updated: b.ai_last_updated?.toISOString() ?? null,
      google_last_sync: b.google_last_sync?.toISOString() ?? null,
    }))

    return Response.json({ success: true, count: data.length, data })
  } catch (error) {
    console.error('GET /api/businesses error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}
