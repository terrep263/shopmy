import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { claimBusiness } from "@/services/vendorClaim.service"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization")
    const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get("token")?.value
    const token = bearer || cookieToken

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { businessId } = body

    if (!businessId) {
      return NextResponse.json({ error: "Missing businessId" }, { status: 400 })
    }

    const vendor = await claimBusiness(user.id, businessId)

    return NextResponse.json({
      message: "Business successfully claimed",
      vendor
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Claim failed" },
      { status: 400 }
    )
  }
}
