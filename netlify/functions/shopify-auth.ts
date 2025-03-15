import { Handler } from '@netlify/functions';
import crypto from 'crypto';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'https://pixmock.com';

// Scopes nécessaires pour l'application
const SCOPES = [
  'read_customers',
  'write_customers',
  'read_orders',
  'write_orders',
  'write_products',
  'read_products'
].join(',');

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
      console.log('HMAC verification failed');
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Invalid HMAC' })
      };
    }

    // Installation initiale (/shopify-oauth/init)
    if (event.path.includes('/init') && shop) {
      console.log('Initial installation request for shop:', shop);
      const nonce = generateNonce();
      
      const redirectUri = `${APP_URL}/shopify-oauth/redirect`;
      const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}&grant_options[]=per-user`;

      console.log('Redirecting to:', authUrl);

      return {
        statusCode: 302,
        headers: {
          'Location': authUrl,
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

    // Callback OAuth (/shopify-oauth/redirect)
    if (event.path.includes('/redirect') && query.code && shop) {
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

      // Rediriger vers l'admin Shopify
      return {
        statusCode: 302,
        headers: {
          'Location': `https://${shop}/admin/apps?shop=${shop}`,
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