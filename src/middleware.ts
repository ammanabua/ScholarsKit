import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { unsealData } from 'iron-session'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/files', '/courses', '/groups', '/settings']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/sign-in', '/sign-up']

const COOKIE_NAME = 'app_session'

async function getSessionFromCookie(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)
    
  if (!cookie?.value) {
    return null
  }

  try {
    const password = process.env.SESSION_PASSWORD
    
    if (!password) {
      console.error('SESSION_PASSWORD is not set')
      return null
    }

    const session = await unsealData<{ user?: { id: string; email: string } }>(cookie.value, {
      password,
    })
    
    return session
  } catch (error) {
    console.error('Failed to unseal session:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Skip middleware for non-protected, non-auth routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Get session from cookie
  const session = await getSessionFromCookie(request)
  const isAuthenticated = !!session?.user

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    console.log('Middleware - Redirecting to sign-in')
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For protected routes, add cache-control headers to prevent browser caching
  // This helps prevent the back button from showing stale authenticated pages
  if (isProtectedRoute) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Explicitly match protected routes
    '/dashboard/:path*',
    '/files/:path*',
    '/courses/:path*',
    '/groups/:path*',
    '/settings/:path*',
    // Match auth routes
    '/sign-in/:path*',
    '/sign-up/:path*',
  ],
}
