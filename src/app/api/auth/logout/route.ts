import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST() {
  const headerStore = await headers()
  const host = headerStore.get('host') || ''
  const forwardedProto = headerStore.get('x-forwarded-proto') || ''
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  const isHttps = forwardedProto === 'https'

  const response = new NextResponse(
    JSON.stringify({ message: 'Logged out successfully' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )

  response.cookies.set('token', '', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production' && isHttps && !isLocalhost, 
    sameSite: 'lax',
    maxAge: 0 
  })

  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && isHttps && !isLocalhost,
    sameSite: 'lax',
    maxAge: 0
  })

  return response
}
