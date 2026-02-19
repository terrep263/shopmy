import { NextResponse } from 'next/server'

export async function POST() {
  const response = new NextResponse(
    JSON.stringify({ message: 'Logged out successfully' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )

  response.cookies.set('token', '', { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax',
    maxAge: 0 
  })

  return response
}
