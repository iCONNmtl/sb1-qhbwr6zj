import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface GenerationResult {
  generationId: string;
  mockups: {
    id: string;
    name: string;
    url: string;
  }[];
}

export async function handleGenerationComplete(result: GenerationResult) {
  try {
    const generationRef = doc(db, 'generations', result.generationId);
    await updateDoc(generationRef, {
      status: 'completed',
      mockups: result.mockups,
      completedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating generation:', error);
    return { success: false, error: 'Failed to update generation' };
  }
}