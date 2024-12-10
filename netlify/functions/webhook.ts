import { Handler } from '@netlify/functions';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../src/lib/firebase';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { session } = JSON.parse(event.body!);
    const userId = session.client_reference_id;

    if (!userId) {
      throw new Error('No user ID provided in session');
    }

    // Update user subscription in Firebase
    const userRef = doc(db, 'users', userId);
    const planDetails = session.amount_total === 9900 
      ? { plan: 'Enterprise' as const, credits: 500 }
      : { plan: 'Pro' as const, credits: 100 };

    await updateDoc(userRef, {
      subscription: {
        plan: planDetails.plan,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        credits: planDetails.credits,
        active: true,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription
      }
    });

    // Record payment in Firebase
    await addDoc(collection(db, 'payments'), {
      userId,
      customerId: session.customer,
      subscriptionId: session.subscription,
      amount: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      createdAt: new Date().toISOString(),
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook error' }),
    };
  }
};

export { handler };