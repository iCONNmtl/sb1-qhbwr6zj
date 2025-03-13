import { Handler } from '@netlify/functions';
import crypto from 'crypto';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'https://pixmock.com';

// Scopes nécessaires pour l'application
const SCOPES = [
  'read_products',
  'write_products',
  'read_orders',
  'write_orders',
  'read_inventory',
  'write_inventory'
].join(',');

const generateNonce = () => crypto.randomBytes(16).toString('hex');

const verifyHmac = (query: { [key: string]: string }): boolean => {
  const hmac = query.hmac;
  delete query.hmac;
  
  const message = Object.keys(query)
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('&');

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_CLIENT_SECRET!)
    .update(message)
    .digest('hex');

  return hmac === generatedHash;
};

export const handler: Handler = async (event) => {
  try {
    const params = new URLSearchParams(event.rawQuery);
    const query: { [key: string]: string } = {};
    params.forEach((value, key) => { query[key] = value; });

    // Vérifier HMAC si présent
    if (query.hmac && !verifyHmac(query)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid HMAC' })
      };
    }

    // Installation initiale
    if (query.shop && !query.code) {
      const nonce = generateNonce();
      const redirectUri = `${APP_URL}/api/shopify/oauth/callback`;
      
      const authUrl = new URL(`https://${query.shop}/admin/oauth/authorize`);
      authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID!);
      authUrl.searchParams.append('scope', SCOPES);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', nonce);

      return {
        statusCode: 302,
        headers: {
          Location: authUrl.toString(),
          'Set-Cookie': `shopify_nonce=${nonce}; Path=/; Secure; SameSite=Lax`
        },
        body: ''
      };
    }

    // Callback OAuth avec code d'autorisation
    if (query.code) {
      const shop = query.shop;
      
      // Échanger le code contre un token d'accès
      const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: SHOPIFY_CLIENT_ID,
          client_secret: SHOPIFY_CLIENT_SECRET,
          code: query.code
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const { access_token } = await tokenResponse.json();

      // Rediriger vers l'app avec le token et le shop
      return {
        statusCode: 302,
        headers: {
          Location: `${APP_URL}/settings?shop=${shop}&token=${access_token}`
        },
        body: ''
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' })
    };

  } catch (error: any) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};