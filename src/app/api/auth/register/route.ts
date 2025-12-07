import { NextResponse } from 'next/server'
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import crypto from 'crypto'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_AWS_REGION })

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const clientId = process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET

  const SecretHash = clientSecret
    ? crypto.createHmac('sha256', clientSecret).update(email + clientId).digest('base64')
    : undefined

  const params = {
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
    ...(SecretHash ? { SecretHash } : {}),
  }

  try {
    const command = new SignUpCommand(params)
    await cognitoClient.send(command)
    return NextResponse.json({ message: 'User registered successfully. Please check your email to confirm your account.' })
  } catch (error: unknown) {
    console.error('Cognito SignUp error:', error)
    const errorMessage = error instanceof Error ? error.name : 'An error occurred during registration'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
