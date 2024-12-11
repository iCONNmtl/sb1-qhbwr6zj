import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { triggerGenerationWebhook } from '../lib/webhooks';
import { updateUserCredits } from '../utils/subscription';
import { processDesignFile } from '../utils/imageProcessing';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import type { UserProfile } from '../types/user';

export function useMockupGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, addGeneration } = useStore();
  const navigate = useNavigate();

  const generateMockups = async (
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
    try {
      // Process design file
      const processedDesign = await processDesignFile(designFile);

      // Update credits
      await updateUserCredits(user.uid, selectedMockups.length);
      
      const generationId = nanoid();
      
      const result = await triggerGenerationWebhook({
        generationId,
        mockupIds: selectedMockups,
        mockupUuids: selectedMockupData.map(m => m.mockupUuid),
        smartObjectUuids: selectedMockupData.map(m => m.smartObjectUuid),
        design: processedDesign
      });

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
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la génération des mockups');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateMockups
  };
}