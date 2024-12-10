import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateUserSubscription(userId: string, session: Stripe.Checkout.Session) {
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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature']!;
  const buf = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (!userId) {
          throw new Error('No user ID provided in session');
        }

        await updateUserSubscription(userId, session);
        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
}