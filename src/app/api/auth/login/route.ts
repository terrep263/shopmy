import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, password } = body

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    let user
    try {
      user = await prisma.user.findUnique({
        where: { email }
      })
    } catch (dbErr: any) {
      if (process.env.NODE_ENV === 'development') console.error('Database error:', dbErr?.message)
      return new Response(JSON.stringify({ error: 'Database connection failed. Please ensure DATABASE_URL is properly configured.' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
    }

    if (!user)
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

    const valid = await bcrypt.compare(password, user.password_hash)

    if (!valid)
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

    const token = signToken({
      userId: user.id,
      role: user.role
    })

    const headers = new Headers({ 'Content-Type': 'application/json' })
    headers.append('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`)

    return new Response(JSON.stringify({
      token,
      role: user.role
    }), { headers })

  } catch (err: any) {
    if (process.env.NODE_ENV === 'development') console.error('Login error:', err?.message || err)
    return new Response(JSON.stringify({ error: 'Login failed. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
