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

  const authorizationUrl = client.authorizationUrl({
    scope: 'openid email profile',
    state,
    nonce,
  })

  return NextResponse.redirect(authorizationUrl)
}
