import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

app.use(cors());
app.use(bodyParser.json());

// Webhook raw body handler
app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook endpoint
app.post('/api/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature']!;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        throw new Error('No user ID provided in session');
      }

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

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export const handler = app;