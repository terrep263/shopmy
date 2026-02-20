import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { signToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    console.log('[login] Attempting login with email:', email)

    if (!email || !password) {
      console.log('[login] Missing email or password')
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } }).catch((err) => {
      console.error('[login] Database error finding user:', err)
      return null
    })

    if (!user) {
      console.log('[login] User not found with email:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('[login] User found:', { id: user.id, role: user.role, hashPreview: user.password_hash?.substring(0, 20) })

    const valid = await bcrypt.compare(password, user.password_hash || '')
    console.log('[login] Password validation result:', valid)
    
    if (!valid) {
      console.log('[login] Invalid password for user:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      console.log('[login] User role is not admin:', user.role)
      return NextResponse.json({ error: 'Admin access only' }, { status: 403 })
    }

    console.log('[login] Generating token for user:', user.id)
    const token = signToken({ userId: user.id, role: user.role })

    const response = NextResponse.json({ success: true, role: user.role })

    // Single cookie — not httpOnly so client JS can read it for API calls
    response.cookies.set('admin_token', token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    console.log('[login] Login successful for user:', email)
    return response

  } catch (err: any) {
    console.error('[login] Error:', err?.message, err)
    return NextResponse.json({ error: 'Login failed', details: err?.message }, { status: 500 })
  }
}
