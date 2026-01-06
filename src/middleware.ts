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
  
  console.log('Middleware - Cookie present:', !!cookie?.value)
  
  if (!cookie?.value) {
    return null
  }

  try {
    const password = process.env.SESSION_PASSWORD
    console.log('Middleware - SESSION_PASSWORD set:', !!password)
    
    if (!password) {
      console.error('SESSION_PASSWORD is not set')
      return null
    }

    const session = await unsealData<{ user?: { id: string; email: string } }>(cookie.value, {
      password,
    })
    
    console.log('Middleware - Session unsealed, user:', !!session?.user)
    
    return session
  } catch (error) {
    console.error('Failed to unseal session:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('Middleware - pathname:', pathname)
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  console.log('Middleware - isProtectedRoute:', isProtectedRoute, 'isAuthRoute:', isAuthRoute)
  
  // Skip middleware for non-protected, non-auth routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Get session from cookie
  const session = await getSessionFromCookie(request)
  const isAuthenticated = !!session?.user

  console.log('Middleware - isAuthenticated:', isAuthenticated)

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (they handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
