import { Handler } from '@netlify/functions';
import crypto from 'crypto';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'https://pixmock.com';

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

    // Verify HMAC if present
    if (query.hmac && !verifyHmac(query)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid HMAC' })
      };
    }

    // Initial installation request
    if (query.shop && !query.code) {
      const nonce = generateNonce();
      const redirectUri = `${APP_URL}/.netlify/functions/shopify-auth`;
      
      const authUrl = new URL(`https://${query.shop}/admin/oauth/authorize`);
      authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID!);
      authUrl.searchParams.append('scope', 'read_products,write_products,read_orders');
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', nonce);

      return {
        statusCode: 302,
        headers: {
          Location: authUrl.toString()
        },
        body: ''
      };
    }

    // OAuth callback with authorization code
    if (query.code) {
      const shop = query.shop;
      
      // Exchange code for access token
      const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      // Redirect back to app with success
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