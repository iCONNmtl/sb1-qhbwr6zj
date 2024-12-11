import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Mockup } from '../types/mockup';
import type { UserProfile } from '../types/user';

export function useMockups() {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const mockupsQuery = query(
          collection(db, 'mockups'),
          where('active', '==', true)
        );
        const snapshot = await getDocs(mockupsQuery);
        const mockupsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        })) as Mockup[];
        
        setMockups(mockupsData);
      } catch (error) {
        console.error('Error fetching mockups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMockups();
  }, []);

  return { mockups, loading };
}

export function useUserProfile(userId: string | undefined) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { userProfile, loading };
}

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setFavorites(userData.favorites || []);
        }
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return favorites;
}