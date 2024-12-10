import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function getMockupUsageCount(mockupId: string): Promise<number> {
  try {
    const generationsRef = collection(db, 'generations');
    const generationsSnap = await getDocs(generationsRef);
    
    let usageCount = 0;
    generationsSnap.docs.forEach(doc => {
      const generation = doc.data();
      if (generation.mockups && Array.isArray(generation.mockups)) {
        const mockupUsed = generation.mockups.some((m: any) => m.id === mockupId);
        if (mockupUsed) usageCount++;
      }
    });
    
    return usageCount;
  } catch (error) {
    console.error('Error getting mockup usage count:', error);
    return 0;
  }
}

export function validateMockupData(name: string, category: string): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Le nom du mockup est requis' };
  }
  
  if (!category.trim()) {
    return { isValid: false, error: 'La catégorie est requise' };
  }
  
  return { isValid: true };
}