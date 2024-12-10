import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';

export function useCredits() {
  const { user } = useStore();
  const [credits, setCredits] = useState<number>(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCredits(5);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.subscription?.plan === 'Basic') {
            setCredits(userData.subscription.credits || 0);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching credits:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { credits, loading };
}