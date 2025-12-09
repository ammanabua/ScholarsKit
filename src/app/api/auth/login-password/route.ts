import { NextResponse } from 'next/server'
import { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from '@/lib/session'
import crypto from 'crypto'

export interface SessionData {
  user?: {
    id: string
    username: string
    email: string
  }
}

const region = process.env.NEXT_PUBLIC_AWS_REGION
const cognitoClient = new CognitoIdentityProviderClient({ region })

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const clientId = process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET

    const SecretHash = clientSecret
      ? crypto.createHmac('sha256', clientSecret).update(email + clientId).digest('base64')
      : undefined

    const initiate = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        ...(SecretHash ? { SECRET_HASH: SecretHash } : {}),
      },
    })
    const authRes = await cognitoClient.send(initiate)
    const tokens = authRes.AuthenticationResult
    if (!tokens?.AccessToken) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    const getUser = new GetUserCommand({ AccessToken: tokens.AccessToken })
    const userRes = await cognitoClient.send(getUser)
    const attrs = Object.fromEntries((userRes.UserAttributes ?? []).map(a => [a.Name!, a.Value!]))

    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    session.user = {
      id: attrs.sub || '',
      username: attrs.email || attrs.preferred_username || attrs.sub || email,
      email: attrs.email,
    }
    await session.save()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Password login error:', error)
    const message = error instanceof Error ? error.message : 'Login failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
