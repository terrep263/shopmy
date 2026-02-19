import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function requireAdminUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    throw new Error("Unauthorized")
  }

  const decoded = verifyToken(token) as { userId?: string; id?: string; role?: string }
  const userId = decoded.userId ?? decoded.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user || user.role !== "admin") {
    throw new Error("Forbidden")
  }

  return user
}
