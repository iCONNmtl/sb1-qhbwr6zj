import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

export const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const STRIPE_PRICES = {
  pro: 'price_1QS0X8HwswrHQeJgFSgpHnsW',
  expert: 'price_1QS0X8HwswrHQeJgELaberI'
};

export async function createCheckoutSession(planId: string, userId: string): Promise<string> {
  try {
    const priceId = STRIPE_PRICES[planId as keyof typeof STRIPE_PRICES];
    if (!priceId) {
      throw new Error('Invalid plan ID');
    }

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${FRONTEND_URL}/pricing`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function checkPaymentStatus(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(`/.netlify/functions/check-payment?sessionId=${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const { paid } = await response.json();
    return paid;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
}