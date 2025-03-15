import { Handler } from '@netlify/functions';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';
import crypto from 'crypto';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_APP_PROXY_KEY || 'e2b20adf1c1b49a62ec2d42c0c119355';
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_APP_PROXY_SECRET || 'c31a40911d06210a0fd1ff8ca4aa9715';
const APP_URL = process.env.APP_URL || 'https://pixmock.com';

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
  delete query.hmac;
  
  const message = Object.keys(query)
    .sort()
    .map(key => `${key}=${Array.isArray(query[key]) ? query[key].join(',') : query[key]}`)
    .join('&');

  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_CLIENT_SECRET!)
    .update(message)
    .digest('hex');

  return hmac === generatedHash;
};

export const handler: Handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const shop = query.shop;
    const { path } = event;
    const userId = query.state; // Using state parameter to pass userId

    console.log('Auth function called:', {
      path,
      httpMethod: event.httpMethod,
      query,
      userId
    });

    // Vérifier que le shop est un domaine Shopify valide
    if (shop && !shop.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid shop domain' })
      };
    }

    // Installation initiale
    if (path.includes('/init')) {
      if (!shop || !userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required parameters' })
        };
      }

      const redirectUri = `${APP_URL}/shopify-oauth/redirect`;
      
      const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID!);
      authUrl.searchParams.append('scope', SCOPES);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', userId);
      authUrl.searchParams.append('grant_options[]', 'per-user');

      console.log('Redirecting to Shopify auth:', authUrl.toString());

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
    if (path.includes('/redirect')) {
      if (!shop || !query.code || !query.state) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required parameters' })
        };
      }

      // Vérifier l'HMAC
      if (!verifyHmac(query as any)) {
        console.error('HMAC verification failed');
        return {
          statusCode: 403,
          body: JSON.stringify({ error: 'Invalid signature' })
        };
      }

      // Échanger le code contre un token
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
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        throw new Error(`Failed to get access token: ${error}`);
      }

      const { access_token, scope } = await tokenResponse.json();
      console.log('Access token obtained successfully');

      // Store encrypted tokens in Firebase
      const userId = query.state;
      const userRef = doc(db, 'users', userId);
      
      const encryptedTokens = btoa(JSON.stringify({
        access_token,
        scope,
        shop,
        created_at: new Date().toISOString()
      }));

      await updateDoc(userRef, {
        'shopifyAuth.tokens': encryptedTokens,
        'shopifyAuth.connectedAt': new Date().toISOString(),
        'shopifyAuth.shop': shop
      });

      // Redirect to settings page with success parameter
      const settingsUrl = `${APP_URL}/settings?shopifyConnected=true`;
      console.log('Redirecting to settings:', settingsUrl);

      return {
        statusCode: 302,
        headers: {
          'Location': settingsUrl,
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' })
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