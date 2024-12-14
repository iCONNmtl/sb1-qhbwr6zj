import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { PlanConfig } from '../types/user';

export function usePlans() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansSnap = await getDocs(collection(db, 'plans'));
        const plansData = plansSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PlanConfig[];
        setPlans(plansData.sort((a, b) => a.price - b.price));
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading };
}