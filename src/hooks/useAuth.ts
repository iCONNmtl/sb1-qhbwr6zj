import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import type { UserProfile } from '../types/user';

export function useAuth() {
  const { setUser, setCredits, setGenerations } = useStore();

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

        // Set up real-time listener for generations
        const generationsQuery = query(
          collection(db, 'generations'),
          where('userId', '==', user.uid)
        );

        const unsubscribeGenerations = onSnapshot(generationsQuery, (snapshot) => {
          const generationsData = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setGenerations(generationsData);
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
        return () => {
          unsubscribeUser();
          unsubscribeGenerations();
        };
      } else {
        setUser(null);
        setCredits(0);
        setGenerations([]);
      }
    });

    return () => unsubscribe();
  }, [setUser, setCredits, setGenerations]);
}