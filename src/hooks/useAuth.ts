import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import type { UserProfile } from '../types/user';

export function useAuth() {
  const { setUser, setCredits } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get or create user profile
        const userRef = doc(db, 'users', user.uid);
        
        // Set up real-time listener for user document
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data() as UserProfile;
            if (userData.subscription.plan === 'Basic') {
              setCredits(userData.subscription.credits || 0);
            }
          }
        });

        // Check if user exists, if not create profile
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUser: UserProfile = {
            email: user.email!,
            subscription: {
              plan: 'Basic',
              startDate: new Date().toISOString(),
              credits: 25,
              active: true
            },
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newUser);
        }

        setUser(user);
        return () => unsubscribeUser();
      } else {
        setUser(null);
        setCredits(0);
      }
    });

    return () => unsubscribe();
  }, [setUser, setCredits]);
}