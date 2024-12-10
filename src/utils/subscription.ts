import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import type { UserSubscription } from '../types/user';

export const PLAN_NAMES = {
  BASIC: 'Basic',
  PRO: 'Pro',
  EXPERT: 'Expert'
} as const;

export async function updateUserCredits(userId: string, creditsToDeduct: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error('User not found');
  }
  
  await updateDoc(userRef, {
    'subscription.credits': increment(-creditsToDeduct)
  });
}

export async function updateUserSubscription(
  userId: string, 
  subscription: Partial<UserSubscription>
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error('User not found');
  }

  const currentData = userSnap.data();
  const updatedSubscription = {
    ...currentData.subscription,
    ...subscription,
    plan: subscription.plan ? 
      Object.values(PLAN_NAMES).find(p => p.toLowerCase() === subscription.plan?.toLowerCase()) || 
      currentData.subscription.plan : 
      currentData.subscription.plan
  };

  await updateDoc(userRef, {
    subscription: updatedSubscription
  });
}

async function triggerCancellationWebhook(stripeSubscriptionId: string) {
  try {
    const response = await fetch('https://hook.eu1.make.com/uoqgtewdffae53lrklq037lywowpspw4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stripeSubscriptionId
      })
    });

    if (!response.ok) {
      throw new Error('Webhook failed');
    }
  } catch (error) {
    console.error('Error triggering cancellation webhook:', error);
    throw error;
  }
}

export async function cancelSubscription(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error('User not found');
  }

  const userData = userSnap.data();
  const stripeSubscriptionId = userData.subscription?.stripeSubscriptionId;

  if (stripeSubscriptionId) {
    try {
      await triggerCancellationWebhook(stripeSubscriptionId);
    } catch (error) {
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
      throw error;
    }
  }

  await updateUserSubscription(userId, {
    plan: PLAN_NAMES.BASIC,
    startDate: new Date().toISOString(),
    credits: 5,
    active: true,
    stripeCustomerId: null,
    stripeSubscriptionId: null
  });
}