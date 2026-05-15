import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']
const PUBLIC_PREFIXES = ['/_next', '/favicon', '/api']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isStaticAsset = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))

  if (isStaticAsset) return NextResponse.next()

  const session = request.cookies.get('af_session')?.value

  // Authenticated user trying to access auth pages → send to dashboard
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Unauthenticated user trying to access protected routes → send to login
  if (!session && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
