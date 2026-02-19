import { NextResponse, type NextRequest } from "next/server"
import { saveUploadedFile } from "@/lib/media"
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

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    const { url } = await saveUploadedFile(file)

    return NextResponse.json({ success: true, url })
  } catch (error) {
    const status = getStatusFromError(error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status }
    )
  }
}
