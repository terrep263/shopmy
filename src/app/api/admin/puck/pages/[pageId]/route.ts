import { savePagePuckData, deletePagePuckData } from "@/lib/puckStorage"
import { getPageById } from "@/puck/pageRegistry"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/admin/puck/pages/[pageId] — save Puck data for a page.
 * DELETE — revert page to theme default (remove Puck override).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params

  const entry = getPageById(pageId)
  if (!entry) {
    return NextResponse.json({ error: `Unknown page: ${pageId}` }, { status: 404 })
  }

  const data = await req.json()
  await savePagePuckData(pageId, data)

  return NextResponse.json({ success: true, message: `Page "${entry.label}" saved` })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params

  const entry = getPageById(pageId)
  if (!entry) {
    return NextResponse.json({ error: `Unknown page: ${pageId}` }, { status: 404 })
  }

  await deletePagePuckData(pageId)

  return NextResponse.json({ success: true, message: `Page "${entry.label}" reverted to theme default` })
}
