import { NextResponse } from 'next/server'
import { generators } from 'openid-client'
import { getCognitoClient } from '@/lib/cognito'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from '@/lib/session'

interface SessionData {
  state?: string
  nonce?: string
}
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
  try {
    const client = await getCognitoClient()

    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

    const state = generators.state()
    const nonce = generators.nonce()
    session.state = state
    session.nonce = nonce
    await session.save()

    // Build redirect_uri from the public origin to handle proxy environments
    const origin = getPublicOrigin(request)
    
    // For local development, always use the detected origin
    // For production, use COGNITO_REDIRECT_URI if set
    const isLocalhost = origin.includes('localhost')
    const redirectUri = isLocalhost 
      ? `${origin}/api/auth/callback`
      : (process.env.COGNITO_REDIRECT_URI || `${origin}/api/auth/callback`)

    console.log('Login - Using redirect URI:', redirectUri)
    console.log('Login - Origin detected:', origin)
    console.log('Login - Is localhost:', isLocalhost)

    const authorizationUrl = client.authorizationUrl({
      redirect_uri: redirectUri,
      scope: 'openid email',  // Make sure these scopes are enabled in Cognito App Client
      state,
      nonce,
    })

    console.log('Login - Authorization URL:', authorizationUrl)

    return NextResponse.redirect(authorizationUrl)
  } catch (err) {
    console.error('Auth login error:', err)
    // Surface a readable error and guidance
    return NextResponse.json({
      error: 'Failed to initialize Cognito login',
      message: (err as Error)?.message,
      hint: 'Check COGNITO_ISSUER_URL, COGNITO_CLIENT_ID/SECRET, and Callback URLs',
    }, { status: 500 })
  }
}
