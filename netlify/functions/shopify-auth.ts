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
  'write_orders'
].join(' ');

const generateNonce = () => crypto.randomBytes(16).toString('hex');

const verifyHmac = (query: { [key: string]: string }): boolean => {
  const hmac = query.hmac;
  const map = Object.assign({}, query);
  delete map['hmac'];

  const message = Object.keys(map)
    .sort()
    .map(key => `${key}=${Array.isArray(map[key]) ? map[key].join(',') : map[key]}`)
    .join('&');

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_CLIENT_SECRET!)
    .update(message)
    .digest('hex');

  return hmac === generatedHash;
};

export const handler: Handler = async (event) => {
  try {
    console.log('Auth function called:', {
      path: event.path,
      httpMethod: event.httpMethod,
      queryStringParameters: event.queryStringParameters
    });

    const query = event.queryStringParameters || {};
    const shop = query.shop;

    // Vérifier l'HMAC si présent
    if (query.hmac && !verifyHmac(query as any)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Invalid HMAC' })
      };
    }

    // Installation initiale
    if (shop && !query.code) {
      console.log('Initial installation request for shop:', shop);
      const nonce = generateNonce();
      
      const redirectUri = `${APP_URL}/api/shopify/oauth/callback`;
      const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      authUrl.searchParams.set('client_id', SHOPIFY_CLIENT_ID!);
      authUrl.searchParams.set('scope', SCOPES);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('state', nonce);

      console.log('Redirecting to:', authUrl.toString());

      return {
        statusCode: 302,
        headers: {
          'Location': authUrl.toString(),
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

    // Callback OAuth
    if (query.code && shop) {
      console.log('Processing OAuth callback for shop:', shop);

      const accessTokenUrl = `https://${shop}/admin/oauth/access_token`;
      const accessTokenPayload = {
        client_id: SHOPIFY_CLIENT_ID,
        client_secret: SHOPIFY_CLIENT_SECRET,
        code: query.code
      };

      console.log('Requesting access token from:', accessTokenUrl);

      const tokenResponse = await fetch(accessTokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accessTokenPayload)
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        throw new Error(`Failed to get access token: ${error}`);
      }

      const { access_token } = await tokenResponse.json();
      console.log('Access token obtained successfully');

      // Vérifier l'accès à l'API
      const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json'
        }
      });

      if (!shopResponse.ok) {
        const error = await shopResponse.text();
        console.error('Shop verification failed:', error);
        throw new Error('Failed to verify shop access');
      }

      console.log('Shop access verified, redirecting to app');

      return {
        statusCode: 302,
        headers: {
          'Location': `${APP_URL}/settings?shop=${shop}&token=${access_token}`,
          'Cache-Control': 'no-cache'
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
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};