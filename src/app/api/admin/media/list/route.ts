import { NextResponse } from "next/server"
import { listUploadedFiles } from "@/lib/media"
import { requireAdmin } from "@/lib/adminGuard"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getStatusFromError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Forbidden") return 403
    if (error.message === "Unauthorized") return 401
  }
  return 500
}

export async function GET() {
  try {
    await requireAdmin()
    const files = await listUploadedFiles()
    return NextResponse.json({ success: true, files })
  } catch (error) {
    const status = getStatusFromError(error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to list uploads" },
      { status }
    )
  }
}
