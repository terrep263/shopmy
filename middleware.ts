import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './src/lib/auth'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow login page and login API
  if (pathname === '/admin/login' || pathname === '/api/auth/login') {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = req.cookies.get('admin_token')?.value

  // No token — redirect pages, reject API calls
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Verify token
  try {
    const decoded: any = verifyToken(token)

    if (decoded.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Inject userId into request header so routes can use it without re-verifying
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-admin-id', decoded.userId)
    requestHeaders.set('x-admin-role', decoded.role)

    return NextResponse.next({ request: { headers: requestHeaders } })

  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}
