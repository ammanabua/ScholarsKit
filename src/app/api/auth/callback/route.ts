import { NextResponse } from 'next/server'
import { getCognitoClient } from '@/lib/cognito'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(request: Request) {
  try {
    const client = await getCognitoClient()

    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

    const url = new URL(request.url)
    const params = client.callbackParams(request.url)

    // Use current origin to avoid env mismatches
    const redirectUri = `${url.origin}/api/auth/callback`

    if (!session.state || !session.nonce) {
      // Missing OAuth state/nonce -> restart login flow
      return NextResponse.redirect(new URL('/api/auth/login', url.origin))
    }

    const tokenSet = await client.callback(redirectUri, params, {
      state: session.state,
      nonce: session.nonce,
    })

    if (!tokenSet.access_token) {
      throw new Error('Missing access token in tokenSet')
    }

    const userInfo = await client.userinfo(tokenSet.access_token)

    // Persist access token for authenticated API calls
    session.accessToken = tokenSet.access_token as string
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
    await session.save()

    const after = url.searchParams.get('redirect') || '/dashboard?login=success'
    return NextResponse.redirect(new URL(after, url.origin))
  } catch (err) {
    console.error('Auth callback error:', err)
    // Fallback to sign-in on error
    const origin = new URL(request.url).origin
    return NextResponse.redirect(new URL('/sign-in?error=callback_failed', origin))
  }
}
