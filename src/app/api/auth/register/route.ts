import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { signToken } from '@/lib/auth'
import { resolveTenant } from '@/lib/tenantContext'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, password, role } = body

    if (!email || !password)
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } })

    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing)
      return new Response(JSON.stringify({ error: 'User exists' }), { status: 400, headers: { 'Content-Type': 'application/json' } })

    const hashed = await bcrypt.hash(password, 10)
    const tenantId = await resolveTenant()

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashed,
        role: role || 'customer',
        tenant_id: tenantId
      }
    })

    const token = signToken({
      userId: user.id,
      role: user.role
    })

    const { password_hash: _, ...safeUser } = user
    const headers = new Headers({ 'Content-Type': 'application/json' })
    headers.append('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`)
    return new Response(JSON.stringify({
      token,
      user: safeUser
    }), {
      status: 201,
      headers
    })

  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('Register error:', err)
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
