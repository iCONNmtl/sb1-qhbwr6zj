import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { generateMockups } from '../services/mockupService';
import { updateUserCredits } from '../utils/subscription';
import { processDesignFile } from '../utils/imageProcessing';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import type { UserProfile } from '../types/user';

export function useMockupGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, addGeneration } = useStore();
  const navigate = useNavigate();

  const generate = async (
    designFile: File,
    selectedMockups: string[],
    selectedMockupData: any[],
    userProfile: UserProfile
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!designFile) {
      toast.error('Veuillez uploader un design');
      return;
    }

    if (selectedMockups.length === 0) {
      toast.error('Veuillez sélectionner au moins un mockup');
      return;
    }

    if ((userProfile.subscription.credits || 0) < selectedMockups.length) {
      toast.error('Crédits insuffisants');
      return;
    }

    setIsGenerating(true);
    const generationId = nanoid();

    try {
      // Process design file
      const processedDesign = await processDesignFile(designFile);

      // Update credits before generation
      await updateUserCredits(user.uid, selectedMockups.length);
      
      // Prepare UUID pairs
      const uuidPairs = selectedMockupData.map(m => ({
        mockupUuid: m.mockupUuid,
        smartObjectUuid: m.smartObjectUuid
      }));

      // Generate mockups
      const result = await generateMockups(processedDesign, uuidPairs, generationId);

      if (result.success && result.mockups) {
        const generationData = {
          id: generationId,
          userId: user.uid,
          designName: designFile.name,
          mockups: result.mockups,
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'generations'), generationData);
        addGeneration(generationData);
        
        toast.success('Génération réussie !');
        navigate('/dashboard');
      } else {
        throw new Error(result.error || 'Erreur lors de la génération');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Erreur lors de la génération des mockups');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateMockups: generate
  };
}