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
export async function GET() {
  const client = await getCognitoClient()
  
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  

  const state = generators.state()
  const nonce = generators.nonce()
  session.state = state
  session.nonce = nonce
  await session.save()

  // Use explicit redirect_uri to match Cognito App Client configuration
  const redirectUri = process.env.COGNITO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_AMPLIFY_APP_URL ?? 'http://localhost:3000/'}api/auth/callback`

  const authorizationUrl = client.authorizationUrl({
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    state,
    nonce,
  })

  return NextResponse.redirect(authorizationUrl)
}
