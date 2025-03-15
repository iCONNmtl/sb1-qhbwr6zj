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

export const handler: Handler = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const shop = query.shop;
    const userId = query.state;
    const path = event.path;

    console.log('Shopify Auth Handler:', {
      path,
      query,
      userId
    });

    // Initial auth request
    if (path.includes('/init')) {
      if (!shop || !userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing shop or userId' })
        };
      }

      const redirectUri = `${APP_URL}/shopify-oauth/redirect`;
      const nonce = crypto.randomBytes(16).toString('hex');

      const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID!);
      authUrl.searchParams.append('scope', SCOPES);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', userId);
      authUrl.searchParams.append('grant_options[]', 'per-user');

      console.log('Redirecting to:', authUrl.toString());

      return {
        statusCode: 302,
        headers: {
          Location: authUrl.toString(),
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

    // OAuth callback
    if (path.includes('/redirect')) {
      console.log('Received callback:', query);

      if (!query.code || !query.shop || !query.state) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required parameters' })
        };
      }

      // Exchange code for access token
      const tokenResponse = await fetch(`https://${query.shop}/admin/oauth/access_token`, {
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
        throw new Error(`Token exchange failed: ${await tokenResponse.text()}`);
      }

      const { access_token, scope } = await tokenResponse.json();
      console.log('Token obtained successfully');

      // Store encrypted token in Firebase
      const userRef = doc(db, 'users', query.state);
      const encryptedTokens = btoa(JSON.stringify({
        access_token,
        scope,
        shop: query.shop,
        created_at: new Date().toISOString()
      }));

      await updateDoc(userRef, {
        'shopifyAuth.tokens': encryptedTokens,
        'shopifyAuth.connectedAt': new Date().toISOString(),
        'shopifyAuth.shop': query.shop
      });

      console.log('Token stored in Firebase');

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