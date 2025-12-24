import { NextResponse } from 'next/server'
import { getCognitoClient } from '@/lib/cognito'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/session'

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

    const url = new URL(request.url)
    const origin = getPublicOrigin(request)
    const params = client.callbackParams(request.url)

    // For local development, always use the detected origin
    // For production, use COGNITO_REDIRECT_URI if set
    const isLocalhost = origin.includes('localhost')
    const redirectUri = isLocalhost 
      ? `${origin}/api/auth/callback`
      : (process.env.COGNITO_REDIRECT_URI || `${origin}/api/auth/callback`)

    if (!session.state || !session.nonce) {
      // Missing OAuth state/nonce -> restart login flow
      return NextResponse.redirect(new URL('/api/auth/login', origin))
    }

    const tokenSet = await client.callback(redirectUri, params, {
      state: session.state,
      nonce: session.nonce,
    })

    if (!tokenSet.access_token) {
      throw new Error('Missing access token in tokenSet')
    }

    const userInfo = await client.userinfo(tokenSet.access_token)

    // Store minimal session data to avoid cookie size limits
    // Note: Access tokens are large JWTs, so we don't store them in the cookie
    // If you need to make authenticated API calls to Cognito, consider using a database/Redis for token storage
    session.user = {
      id: userInfo.sub as string,
      username:
        (userInfo.preferred_username as string) ||
        (userInfo.email as string) ||
        (userInfo.sub as string),
      email: userInfo.email as string,
    }
    delete session.state
    delete session.nonce
    delete session.accessToken  // Don't store large tokens in cookie
    delete session.refreshToken
    await session.save()

    const after = url.searchParams.get('redirect') || '/dashboard?login=success'
    return NextResponse.redirect(new URL(after, origin))
  } catch (err) {
    console.error('Auth callback error:', err)
    // Fallback to sign-in on error using forwarded headers
    const headers = new Headers(request.headers)
    const forwardedHost = headers.get('x-forwarded-host')
    const forwardedProto = headers.get('x-forwarded-proto') || 'https'
    const fallbackOrigin = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : new URL(request.url).origin
    return NextResponse.redirect(new URL('/sign-in?error=callback_failed', fallbackOrigin))
  }
}
