import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

interface GenerationResponse {
  success: boolean;
  mockups?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  error?: string;
}

export async function generateMockups(
  design: File,
  uuidPairs: Array<{ mockupUuid: string; smartObjectUuid: string }>,
  generationId: string
): Promise<GenerationResponse> {
  const formData = new FormData();
  formData.append('design', design);
  formData.append('generationId', generationId);
  formData.append('uuidPairs', JSON.stringify(uuidPairs));
  formData.append('mockupCount', uuidPairs.length.toString());

  // Add individual mockup IDs for backward compatibility
  uuidPairs.forEach((pair, index) => {
    formData.append(`mockupUuid${index + 1}`, pair.mockupUuid);
    formData.append(`smartObjectUuid${index + 1}`, pair.smartObjectUuid);
  });

  try {
    const response = await fetch(API_CONFIG.webhooks.mockupGeneration, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('GENERATION_ERROR');
    }

    const result = await response.json();
    
    if (!result.mockups || !Array.isArray(result.mockups)) {
      throw new Error('INVALID_RESPONSE');
    }

    // Process mockup URLs
    const processedMockups = result.mockups.map(mockup => {
      let url = mockup.url;
      
      // Handle Google Drive URLs
      if (url.includes('drive.google.com/file/d/')) {
        const fileId = url.split('/')[5];
        url = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }

      return {
        ...mockup,
        url
      };
    });

    return { 
      success: true,
      mockups: processedMockups
    };
  } catch (error: any) {
    console.error('Generation error:', error);
    
    let errorMessage = 'Erreur lors de la génération des mockups';
    
    if (error.message === 'INVALID_RESPONSE') {
      errorMessage = 'Format de réponse invalide';
    } else if (error.message === 'GENERATION_ERROR') {
      errorMessage = 'Erreur lors de la génération, veuillez réessayer';
    }
    
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}