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
    const redirectUri = process.env.COGNITO_REDIRECT_URI ||
      `${origin}/api/auth/callback`

    const authorizationUrl = client.authorizationUrl({
      redirect_uri: redirectUri,
      scope: 'openid email profile',
      state,
      nonce,
    })

    return NextResponse.redirect(authorizationUrl)
  } catch (err) {
    console.log('Auth login error:', (err as Error)?.message)
    // Surface a readable error and guidance
    return NextResponse.json({
      error: 'Failed to initialize Cognito login',
      hint: 'Check COGNITO_ISSUER_URL, COGNITO_CLIENT_ID/SECRET, and Callback URLs',
    }, { status: 500 })
  }
}
