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
    designFile: File | null,
    designUrl: string | undefined,
    selectedMockups: string[],
    selectedMockupData: any[],
    userProfile: UserProfile,
    exportFormat: ExportFormat,
    customHtml?: string,
    customizedMockups: number[] = []
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!designFile && !designUrl) {
      toast.error('Veuillez sélectionner un design');
      return;
    }

    if (selectedMockups.length === 0) {
      toast.error('Veuillez sélectionner au moins un mockup');
      return;
    }

    // Calculate total credits needed
    const baseCredits = selectedMockups.length * 5;
    const customizationCredits = customizedMockups.length * 5;
    const totalCredits = baseCredits + customizationCredits;

    if ((userProfile.subscription.credits || 0) < totalCredits) {
      toast.error(`Crédits insuffisants. Il vous faut ${totalCredits} crédits pour cette génération.`);
      return;
    }

    setIsGenerating(true);
    const generationId = nanoid();

    try {
      // Process design file if provided
      const processedDesign = designFile ? await processDesignFile(designFile) : null;
      
      const uuidPairs = selectedMockupData.map(m => ({
        mockupUuid: m.mockupUuid,
        smartObjectUuid: m.smartObjectUuid
      }));

      const textCustomization = {
        enabled: Boolean(customHtml),
        appliedMockups: customizedMockups,
        html: customHtml || ''
      };

      const result = await generateMockups(
        processedDesign,
        designUrl,
        uuidPairs,
        generationId,
        exportFormat,
        textCustomization
      );

      if (result.success && result.mockups) {
        // Deduct credits before saving generation
        await updateUserCredits(user.uid, totalCredits);

        // Create generation document with valid data
        const generationData = {
          id: generationId,
          userId: user.uid,
          designName: designFile?.name || 'Design existant',
          mockups: result.mockups.map(mockup => ({
            id: mockup.id,
            name: mockup.name,
            url: mockup.url
          })),
          exportFormat,
          customHtml: customHtml || null,
          customizedMockups: customizedMockups || [],
          creditsUsed: totalCredits,
          createdAt: new Date().toISOString(),
          status: 'completed'
        };

        // Add generation to Firestore
        const docRef = await addDoc(collection(db, 'generations'), generationData);
        
        // Add to local store
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