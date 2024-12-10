import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import type { UserSubscription } from '../types/user';

export function useSubscription() {
  const { user } = useStore();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setSubscription(userData.subscription);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { subscription, loading };
}