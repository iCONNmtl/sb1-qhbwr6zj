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
  const map = Object.assign({}, query);
  delete map['hmac'];
  delete map['signature'];

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
    const params = new URLSearchParams(event.rawQuery);
    const query: { [key: string]: string } = {};
    params.forEach((value, key) => { query[key] = value; });

    // Vérifier l'HMAC pour les requêtes provenant de Shopify
    if (query.hmac && !verifyHmac(query)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Invalid HMAC' })
      };
    }

    // Installation initiale
    if (query.shop && !query.code) {
      const shop = query.shop;
      const nonce = generateNonce();
      
      // Construire l'URL d'autorisation Shopify
      const shopifyUrl = `https://${shop}/admin/oauth/authorize`;
      const redirectUri = `${APP_URL}/api/shopify/oauth/callback`;
      
      const authUrl = new URL(shopifyUrl);
      authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID!);
      authUrl.searchParams.append('scope', SCOPES);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', nonce);

      // Rediriger vers Shopify
      return {
        statusCode: 302,
        headers: {
          'Location': authUrl.toString(),
          'Set-Cookie': `shopify_nonce=${nonce}; Path=/; Secure; SameSite=Lax; HttpOnly`
        },
        body: ''
      };
    }

    // Callback OAuth avec code d'autorisation
    if (query.code && query.shop) {
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

      // Vérifier que l'app est bien installée
      const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json'
        }
      });

      if (!shopResponse.ok) {
        throw new Error('Failed to verify shop');
      }

      // Rediriger vers l'app avec le token
      return {
        statusCode: 302,
        headers: {
          'Location': `${APP_URL}/settings?shop=${shop}&token=${access_token}`
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