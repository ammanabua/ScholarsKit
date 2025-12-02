import { NextResponse } from 'next/server'
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.NEXT_PUBLIC_AWS_REGION })

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const params = {
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  }

  try {
    const command = new SignUpCommand(params)
    await cognitoClient.send(command)
    return NextResponse.json({ message: 'User registered successfully. Please check your email to confirm your account.' })
  } catch (error: any) {
    console.error('Cognito SignUp error:', error)
    return NextResponse.json({ error: error.name || 'An error occurred during registration' }, { status: 500 })
  }
}
