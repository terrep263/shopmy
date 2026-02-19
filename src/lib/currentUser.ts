import { cookies } from "next/headers"
import { verifyToken } from "./auth"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    const decoded = verifyToken(token) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}
