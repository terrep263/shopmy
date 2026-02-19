import { NextResponse } from 'next/server'
import { importBusinesses } from '@/services/business.service'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded: any = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { city, category } = body

    if (!city || !category) {
      return NextResponse.json({ error: 'Missing required parameters: city and category' }, { status: 400 })
    }

    const result = await importBusinesses(city, category)

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error: any) {
    console.error('Business import error:', error)
    return NextResponse.json({ 
      error: 'Import failed', 
      details: error.message 
    }, { status: 500 })
  }
}
