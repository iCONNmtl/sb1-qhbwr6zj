import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { PlanConfig } from '../types/user';

export async function initializePlans() {
  const defaultPlans: PlanConfig[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      credits: 5,
      description: 'Parfait pour découvrir',
      features: [
        'Accès à tous les mockups',
        'Export JPG haute qualité',
        'Support par email'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      credits: 100,
      description: 'Pour les professionnels',
      features: [
        'Accès prioritaire aux nouveautés',
        'Export JPG haute qualité',
        'Support prioritaire',
        'Pas de filigrane'
      ]
    },
    {
      id: 'expert',
      name: 'Expert',
      price: 149,
      credits: 500,
      description: 'Pour les équipes',
      features: [
        'Accès prioritaire aux nouveautés',
        'Export JPG haute qualité',
        'Support dédié 24/7',
        'Pas de filigrane',
        'API access'
      ]
    }
  ];

  const plansRef = collection(db, 'plans');
  const plansSnap = await getDocs(plansRef);
  
  if (plansSnap.empty) {
    for (const plan of defaultPlans) {
      await setDoc(doc(plansRef, plan.id), plan);
    }
  }
}