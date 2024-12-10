import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const customerEmail = session.customer_details?.email;

        if (!customerEmail) {
          throw new Error('No customer email provided');
        }

        // Find user by email
        const usersSnapshot = await admin.firestore()
          .collection('users')
          .where('email', '==', customerEmail)
          .get();

        if (usersSnapshot.empty) {
          throw new Error('No user found with the given email');
        }

        const userId = usersSnapshot.docs[0].id;
        const userRef = admin.firestore().collection('users').doc(userId);

        // Determine plan based on amount
        let planDetails = {
          plan: 'Pro' as const,
          credits: 100
        };

        if (session.amount_total === 9900) {
          planDetails = {
            plan: 'Enterprise' as const,
            credits: 500
          };
        }

        // Update user subscription
        await userRef.update({
          subscription: {
            plan: planDetails.plan,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            credits: planDetails.credits,
            active: true,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId
          }
        });

        // Record payment
        await admin.firestore().collection('payments').add({
          userId,
          customerId,
          subscriptionId,
          amount: session.amount_total,
          currency: session.currency,
          status: session.payment_status,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const usersSnapshot = await admin.firestore()
          .collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .get();

        if (!usersSnapshot.empty) {
          const userRef = usersSnapshot.docs[0].ref;
          await userRef.update({
            'subscription.endDate': new Date(subscription.current_period_end * 1000).toISOString(),
            'subscription.active': subscription.status === 'active'
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const usersSnapshot = await admin.firestore()
          .collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .get();

        if (!usersSnapshot.empty) {
          const userRef = usersSnapshot.docs[0].ref;
          await userRef.update({
            subscription: {
              plan: 'Basic',
              startDate: new Date().toISOString(),
              credits: 5,
              active: true
            }
          });
        }

        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});