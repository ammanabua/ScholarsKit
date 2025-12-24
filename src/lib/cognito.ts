import { Issuer, Client } from 'openid-client';

let cognitoClient: Client | null = null;

export async function getCognitoClient() {
  if (cognitoClient) return cognitoClient;

  try {
    let issuerUrl = process.env.COGNITO_ISSUER_URL;
    console.log('Cognito - COGNITO_ISSUER_URL exists:', !!issuerUrl);
    
    if (!issuerUrl) {
      throw new Error('Missing COGNITO_ISSUER_URL environment variable.');
    }
    // Normalize issuer URL: remove trailing slashes
    issuerUrl = issuerUrl.replace(/\/$/, '');
    
    // Validate issuer URL format
    if (!issuerUrl.includes('cognito-idp')) {
      console.warn('Warning: COGNITO_ISSUER_URL should be in format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}');
    }
    
    console.log('Cognito - Discovering issuer...');
    const CognitoIssuer = await Issuer.discover(issuerUrl);
    console.log('Cognito - Issuer discovered:', CognitoIssuer.metadata.issuer);

    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    console.log("Cognito - Client ID exists:", !!clientId);
    console.log("Cognito - Client Secret exists:", !!clientSecret);
    
    if (!clientId) {
      throw new Error('Missing COGNITO_CLIENT_ID environment variable.');
    }

    // Prefer explicit redirect URI; fallback to localhost for dev
    const redirectUri = process.env.COGNITO_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
    console.log('Cognito - Redirect URI:', redirectUri);

    // Configure client; if clientSecret provided, rely on default confidential auth method
    cognitoClient = new CognitoIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      response_types: ['code'],
    });

    console.log('Cognito - Client initialized successfully');
    return cognitoClient;
  } catch (error) {
    console.error('Failed to initialize Cognito client:', error);
    throw error;
  }
}