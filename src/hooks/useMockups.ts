import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import type { Mockup } from '../types/mockup';

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
        toast.error('Erreur lors du chargement des mockups');
      } finally {
        setLoading(false);
      }
    };

    fetchMockups();
  }, []);

  return { mockups, loading };
}