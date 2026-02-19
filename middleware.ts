import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './src/lib/auth'

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*']
}

export function middleware(req: NextRequest) {

  const protectedRoutes = ['/vendor', '/admin']
  const publicRoutes = ['/admin/login']

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {

    if (publicRoutes.some(route => req.nextUrl.pathname === route)) {
      return NextResponse.next()
    }

    const token = req.cookies.get('token')?.value

    if (!token)
      return NextResponse.redirect(new URL('/admin/login', req.url))

    try {
      const decoded: any = verifyToken(token)

      if (
        req.nextUrl.pathname.startsWith('/admin') &&
        decoded.role !== 'admin'
      )
        return NextResponse.redirect(new URL('/', req.url))

    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}
