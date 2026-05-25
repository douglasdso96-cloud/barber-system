import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

  const accessToken = request.cookies
    .getAll()
    .find(cookie =>
      cookie.name.includes('access-token')
    )

  const isAdminRoute =
    request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !accessToken) {

    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}