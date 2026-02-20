import { NextRequest, NextResponse } from "next/server"
import { backfillPhotos } from "@/services/business.service"

export async function POST(req: NextRequest) {
  try {
    // Auth is handled by middleware — no cookie/header check needed here
    const body = await req.json().catch(() => ({}))
    const limit = Math.min(body.limit ?? 50, 200) // cap at 200 per request

    const result = await backfillPhotos({ limit })

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Backfill failed"
    console.error("[backfill-photos]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
