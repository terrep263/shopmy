import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export function getAdminIdFromRequest(req: NextRequest): string | null {
  const fromHeader = req.headers.get("x-admin-id")
  if (fromHeader) return fromHeader

  const token = req.cookies.get("admin_token")?.value
  if (!token) return null

  try {
    const decoded: any = verifyToken(token)
    return decoded.userId || null
  } catch {
    return null
  }
}
