import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from '@/lib/session'

// Helper to get the public origin behind proxies (e.g., AWS Amplify)
function getPublicOrigin(request: Request): string {
  const headers = new Headers(request.headers)
  const forwardedHost = headers.get('x-forwarded-host')
  const forwardedProto = headers.get('x-forwarded-proto')
  const host = headers.get('host')

  // Behind a proxy (like Amplify), use forwarded headers
  if (forwardedHost) {
    return `${forwardedProto || 'https'}://${forwardedHost}`
  }
  
  // For localhost development, use http
  if (host?.includes('localhost')) {
    return `http://${host}`
  }
  
  // For other hosts (direct access), use the host header with https
  if (host) {
    return `https://${host}`
  }
  
  return new URL(request.url).origin
}

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const session = await getIronSession(cookieStore, sessionOptions)

  // Destroy local session
  session.destroy()

  const origin = getPublicOrigin(request)
  const isLocalhost = origin.includes('localhost')
  
  // For localhost, just redirect to home (skip Cognito logout)
  if (isLocalhost) {
    return NextResponse.redirect(new URL('/sign-in', origin))
  }

  // For production, redirect to Cognito hosted UI logout if configured
  const clientId = process.env.COGNITO_CLIENT_ID
  const hostedDomain = process.env.COGNITO_HOSTED_UI_DOMAIN
  // Ensure logout URI matches exactly what's in Cognito allowed sign-out URLs
  const postLogout = process.env.COGNITO_LOGOUT_REDIRECT_URI || `${origin}/`

  console.log('Logout - clientId:', clientId ? 'SET' : 'NOT SET')
  console.log('Logout - hostedDomain:', hostedDomain)
  console.log('Logout - postLogout:', postLogout)

  if (clientId && hostedDomain) {
    // Build Cognito logout URL
    // Format: https://{domain}/logout?client_id={client_id}&logout_uri={logout_uri}
    const logoutUrl = new URL(`https://${hostedDomain}/logout`)
    logoutUrl.searchParams.set('client_id', clientId)
    logoutUrl.searchParams.set('logout_uri', postLogout)
    
    console.log('Logout - redirecting to:', logoutUrl.toString())
    return NextResponse.redirect(logoutUrl.toString())
  }

  // Fallback: just redirect to sign-in
  return NextResponse.redirect(new URL('/sign-in', origin))
}
