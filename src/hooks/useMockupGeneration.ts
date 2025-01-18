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
import type { ExportFormat } from '../types/mockup';

export function useMockupGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, addGeneration } = useStore();
  const navigate = useNavigate();

  const generate = async (
    designFile: File,
    selectedMockups: string[],
    selectedMockupData: any[],
    userProfile: UserProfile,
    exportFormat: ExportFormat,
    customHtml?: string
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
      const processedDesign = await processDesignFile(designFile);
      await updateUserCredits(user.uid, selectedMockups.length);
      
      const uuidPairs = selectedMockupData.map(m => ({
        mockupUuid: m.mockupUuid,
        smartObjectUuid: m.smartObjectUuid
      }));

      const result = await generateMockups(
        processedDesign, 
        uuidPairs, 
        generationId, 
        exportFormat,
        customHtml
      );

      if (result.success && result.mockups) {
        const generationData = {
          id: generationId,
          userId: user.uid,
          designName: designFile.name,
          mockups: result.mockups,
          exportFormat,
          customHtml,
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