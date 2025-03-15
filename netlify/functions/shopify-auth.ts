import { Handler } from '@netlify/functions';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'https://pixmock.com';

const SCOPES = [
  'read_customers',
  'write_customers',
  'read_orders',
  'write_orders',
  'write_products',
  'read_products'
].join(',');

export const handler: Handler = async (event) => {
  try {
    const path = event.path.replace('/.netlify/functions/shopify-auth', '');
    const query = event.queryStringParameters || {};
    
    console.log('Shopify Auth Handler:', { path, query });

    // Initial auth request
    if (path === '/init') {
      const { shop, state } = query;
      
      if (!shop || !state) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing shop or state parameter' })
        };
      }

      const redirectUri = `${APP_URL}/shopify-oauth/redirect`;
      const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scope=${SCOPES}&redirect_uri=${redirectUri}&state=${state}`;

      console.log('Redirecting to:', authUrl);

      return {
        statusCode: 302,
        headers: {
          Location: authUrl,
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

    // OAuth callback
    if (path === '/redirect') {
      const { code, shop, state } = query;

      if (!code || !shop || !state) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required parameters' })
        };
      }

      // Exchange code for access token
      const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: SHOPIFY_CLIENT_ID,
          client_secret: SHOPIFY_CLIENT_SECRET,
          code
        })
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${await tokenResponse.text()}`);
      }

      const { access_token, scope } = await tokenResponse.json();

      // Store encrypted token in Firebase
      const userRef = doc(db, 'users', state);
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

      // Redirect back to settings
      return {
        statusCode: 302,
        headers: {
          Location: `${APP_URL}/settings?shopifyConnected=true`,
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
    console.error('Shopify auth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};