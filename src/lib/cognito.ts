import { Client, Issuer } from 'openid-client'

let client: Client;

export async function getCognitoClient() {
  if (!client) {
    const issuer = await Issuer.discover(process.env.NEXT_PUBLIC_COGNITO_ISSUER_URL || '');
    client = new issuer.Client({
      client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET!,
      redirect_uris: [`${process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI}/api/auth/callback`],
      response_types: ['code'],
    }); 
  }

  return client;
}