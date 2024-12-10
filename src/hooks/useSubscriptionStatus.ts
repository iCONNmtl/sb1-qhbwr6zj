import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserSubscription } from '../types/user';

export function useSubscriptionStatus(userId: string | undefined) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setSubscription(userData.subscription);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscription status:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { subscription, loading };
}