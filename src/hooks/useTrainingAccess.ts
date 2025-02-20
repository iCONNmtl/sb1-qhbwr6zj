import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile } from '../types/user';

export function useTrainingAccess(userId: string | undefined, trainingId: string | undefined) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!userId || !trainingId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
          setHasAccess(false);
          return;
        }

        const userData = userDoc.data() as UserProfile;
        setUserProfile(userData);
        
        // Check if user has purchased the training
        const purchasedTrainings = userData.purchasedTrainings || [];
        setHasAccess(purchasedTrainings.includes(trainingId));
      } catch (error) {
        console.error('Error checking training access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [userId, trainingId]);

  return { hasAccess, loading, userProfile };
}