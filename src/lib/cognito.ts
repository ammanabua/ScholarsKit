import { Issuer, Client } from 'openid-client';

let cognitoClient: Client | null = null;

export async function getCognitoClient() {
  if (cognitoClient) return cognitoClient;

  try {
    let issuerUrl = process.env.COGNITO_ISSUER_URL;
    if (!issuerUrl) {
      throw new Error('Missing COGNITO_ISSUER_URL (or NEXT_PUBLIC_COGNITO_ISSUER_URL).');
    }
    // Normalize issuer URL: remove trailing slashes
    issuerUrl = issuerUrl.replace(/\/$/, '');

    const CognitoIssuer = await Issuer.discover(issuerUrl);

    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    if (!clientId) {
      throw new Error('Missing COGNITO_CLIENT_ID (or NEXT_PUBLIC_COGNITO_CLIENT_ID).');
    }

    // Prefer explicit redirect URI; fallback to localhost for dev
    const redirectUri = process.env.COGNITO_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

    // Configure client; if clientSecret provided, rely on default confidential auth method
    cognitoClient = new CognitoIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      response_types: ['code'],
    });

    return cognitoClient;
  } catch (error) {
    console.error('Failed to initialize Cognito client:')
    console.log(error);
    throw error;
  }
}