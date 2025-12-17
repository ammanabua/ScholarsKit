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

    // Build redirect_uri from the current request origin to avoid env mismatches
    const origin = new URL(request.url).origin
    const redirectUri =
      process.env.COGNITO_REDIRECT_URI ||
      process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI ||
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
