import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import type { UserSubscription, UserPlan } from '../types/user';

export const PLAN_NAMES = {
  BASIC: 'Basic',
  PRO: 'Pro',
  EXPERT: 'Expert'
} as const;

export const PLAN_LIMITS = {
  Basic: 1,
  Pro: 10,
  Expert: 15
} as const;

export function getPlanMockupLimit(plan: UserPlan): number {
  return PLAN_LIMITS[plan];
}

export async function updateUserCredits(userId: string, creditsToDeduct: number): Promise<{success: boolean, error?: string}> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }
    
    await updateDoc(userRef, {
      'subscription.credits': increment(-creditsToDeduct)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user credits:', error);
    return { success: false, error: 'Failed to update credits' };
  }
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

  // Ne pas changer le plan immédiatement, mais marquer comme annulé
  // Le plan sera changé automatiquement à la fin de la période de facturation
  await updateDoc(userRef, {
    'subscription.canceledAt': new Date().toISOString(),
    'subscription.willDowngradeToPlan': PLAN_NAMES.BASIC
  });
}

// Fonction pour ajouter des crédits bonus pour les utilisateurs Expert
export async function addExpertBonusCredits(userId: string, baseCredits: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error('User not found');
  }
  
  const userData = userSnap.data();
  const isExpert = userData.subscription?.plan === PLAN_NAMES.EXPERT;
  
  if (isExpert) {
    const bonusCredits = Math.round(baseCredits * 0.1); // 10% bonus
    await updateDoc(userRef, {
      'subscription.credits': increment(bonusCredits)
    });
    
    return;
  }
}