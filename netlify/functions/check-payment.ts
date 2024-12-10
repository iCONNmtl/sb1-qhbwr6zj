import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sessionId = event.queryStringParameters?.sessionId;

  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Session ID is required' }),
    };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ paid: session.payment_status === 'paid' }),
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to check payment status' }),
    };
  }
};

export { handler };