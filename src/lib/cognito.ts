import { Issuer, Client } from 'openid-client';

let cognitoClient: Client | null = null;

export async function getCognitoClient() {
  if (cognitoClient) return cognitoClient;

  try {
    const issuerUrl = process.env.COGNITO_ISSUER_URL || process.env.NEXT_PUBLIC_COGNITO_ISSUER_URL;
    if (!issuerUrl) {
      throw new Error('Missing COGNITO_ISSUER_URL (or NEXT_PUBLIC_COGNITO_ISSUER_URL).');
    }

    const CognitoIssuer = await Issuer.discover(issuerUrl);

    const clientId = process.env.COGNITO_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET;
    if (!clientId) {
      throw new Error('Missing COGNITO_CLIENT_ID (or NEXT_PUBLIC_COGNITO_CLIENT_ID).');
    }

    const redirectUri = process.env.COGNITO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_AMPLIFY_APP_URL ?? 'http://localhost:3000/'}api/auth/callback`;

    cognitoClient = new CognitoIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [
        // Prefer explicit server var, else fall back to Amplify URL, else localhost
        redirectUri,
      ],
      response_types: ['code'],
    });

    return cognitoClient;
  } catch (error) {
    console.error('Failed to initialize Cognito client:', error);
    throw error;
  }
}