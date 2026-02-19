import { requireAuth } from '@/lib/authGuard'

function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  const cookie = req.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(/token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    const decoded = requireAuth(token ?? undefined) as { userId: string; role: string }
    return new Response(
      JSON.stringify({ userId: decoded.userId, role: decoded.role }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
