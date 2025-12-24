import { NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from '@/lib/session'

// Helper to get the public origin behind proxies (e.g., AWS Amplify)
function getPublicOrigin(request: Request): string {
  const headers = new Headers(request.headers)
  const forwardedHost = headers.get('x-forwarded-host')
  const forwardedProto = headers.get('x-forwarded-proto') || 'https'
  const host = headers.get('host')

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }
  if (host && !host.includes('localhost')) {
    return `${forwardedProto}://${host}`
  }
  return new URL(request.url).origin
}

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const session = await getIronSession(cookieStore, sessionOptions)

  // Destroy local session
  session.destroy()

  // If a hosted UI logout is configured, redirect there
  const origin = getPublicOrigin(request)
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
