import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { CognitoIdentityProviderClient, DeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider'

const region = 'us-east-1'
const cognitoClient = new CognitoIdentityProviderClient({ region })

export async function POST() {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    if (!session.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const cmd = new DeleteUserCommand({ AccessToken: session.accessToken })
    await cognitoClient.send(cmd)

    // Destroy session after deletion
    await session.destroy()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete account error:', error)
    const message = error instanceof Error ? error.message : 'Unable to delete account'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
