import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { CognitoIdentityProviderClient, ChangePasswordCommand } from '@aws-sdk/client-cognito-identity-provider'

const region = process.env.NEXT_PUBLIC_AWS_REGION
const cognitoClient = new CognitoIdentityProviderClient({ region })

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 })
    }

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    if (!session.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const cmd = new ChangePasswordCommand({
      AccessToken: session.accessToken,
      PreviousPassword: currentPassword,
      ProposedPassword: newPassword,
    })
    await cognitoClient.send(cmd)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Change password error:', error)
    const message = error instanceof Error ? error.message : 'Unable to change password'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
