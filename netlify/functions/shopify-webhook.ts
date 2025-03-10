import { Handler } from '@netlify/functions';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const SHOPIFY_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

export const handler: Handler = async (event) => {
  // Verify Shopify webhook
  const hmac = event.headers['x-shopify-hmac-sha256'];
  if (!hmac || !SHOPIFY_SECRET) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { shop_domain, access_token } = payload;

    // Update user's Shopify connection status
    const userRef = doc(db, 'users', payload.userId);
    await updateDoc(userRef, {
      'shopifyAuth.status': 'connected',
      'shopifyAuth.shop': shop_domain,
      'shopifyAuth.updatedAt': new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Shopify webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};