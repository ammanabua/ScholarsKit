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
  
  // For localhost, just redirect to sign-in (skip Cognito logout)
  if (isLocalhost) {
    return NextResponse.redirect(new URL('/sign-in', origin))
  }

  // For production, redirect to Cognito hosted UI logout if configured
  const clientId = process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
  const hostedDomain = process.env.COGNITO_HOSTED_UI_DOMAIN || process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_DOMAIN
  const postLogout = process.env.COGNITO_LOGOUT_REDIRECT_URI || `${origin}/`

  if (clientId && hostedDomain) {
    const logoutUrl = new URL(`https://${hostedDomain}/logout`)
    logoutUrl.searchParams.set('client_id', clientId)
    logoutUrl.searchParams.set('logout_uri', postLogout)
    return NextResponse.redirect(logoutUrl.toString())
  }

  return NextResponse.redirect(postLogout)
}
