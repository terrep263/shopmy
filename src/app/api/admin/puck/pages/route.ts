import { pageRegistry } from "@/puck/pageRegistry"
import { listPuckPages } from "@/lib/puckStorage"
import { NextResponse } from "next/server"

/**
 * GET /api/admin/puck/pages — list all registered pages + their customisation status.
 */
export async function GET() {
  const customised = await listPuckPages()

  const pages = pageRegistry.map((p) => ({
    ...p,
    hasOverride: customised.includes(p.pageId),
  }))

  return NextResponse.json(pages)
}
