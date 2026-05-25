import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const isLogged =
    request.cookies.get('admin-auth')?.value

  const pathname = request.nextUrl.pathname

  const protectedRoutes = [
    '/admin',
    '/admin/services',
    '/admin/professionals',
    '/admin/appointments'
  ]

  const isProtectedRoute =
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

  if (isProtectedRoute && !isLogged) {

    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}