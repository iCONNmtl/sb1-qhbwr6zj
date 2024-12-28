import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import type { UserProfile } from '../types/user';

export function useAuthState() {
  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get or create user profile
        const userRef = doc(db, 'users', user.uid);
        
        // Check if user exists, if not create profile
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUser: UserProfile = {
            email: user.email!,
            subscription: {
              plan: 'Basic',
              startDate: new Date().toISOString(),
              credits: 5,
              active: true
            },
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newUser);
        }

        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
}