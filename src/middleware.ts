import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth']
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Get the session token from cookies
  const isAuthenticated = request.cookies.get('expense-auth')?.value === 'true'
  
  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
