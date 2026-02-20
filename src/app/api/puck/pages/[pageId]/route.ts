import { loadPagePuckData } from "@/lib/puckStorage"
import { getPageById } from "@/puck/pageRegistry"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/puck/pages/[pageId] — load Puck data for a specific page.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params

  const entry = getPageById(pageId)
  if (!entry) {
    return NextResponse.json({ error: `Unknown page: ${pageId}` }, { status: 404 })
  }

  const data = await loadPagePuckData(pageId)

  // Return saved data or an empty Puck document
  return NextResponse.json(data ?? { content: [], root: {}, zones: {} })
}
