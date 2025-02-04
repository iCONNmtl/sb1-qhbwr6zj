import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import type { Generation } from '../types/mockup';

export function useGenerations() {
  const { user, setGenerations: setStoreGenerations } = useStore();
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    if (!user) {
      setGenerations([]);
      setStoreGenerations([]);
      setLoading(false);
      return;
    }

    const generationsQuery = query(
      collection(db, 'generations'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(generationsQuery, (snapshot) => {
      const generationsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Generation[];

      // Tri manuel par date de création décroissante
      generationsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setGenerations(generationsData);
      setStoreGenerations(generationsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching generations:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, setStoreGenerations]);

  return { generations, loading };
}