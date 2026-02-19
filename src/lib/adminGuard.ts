import { cookies } from "next/headers"
import { verifyToken } from "./auth"

export async function requireAdmin() {

  const cookieStore = await cookies()

  const token = cookieStore.get("token")?.value

  if (!token)
    throw new Error("Unauthorized")

  const decoded = verifyToken(token) as { userId: string; role: string }

  if (decoded.role !== "admin")
    throw new Error("Forbidden")

  return decoded
}
