import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';
import type { ExportFormat } from '../types/mockup';

interface TextCustomization {
  enabled: boolean;
  appliedMockups: number[];
  html: string;
}

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
  design: File | null,
  designUrl: string | undefined,
  uuidPairs: Array<{ mockupUuid: string; smartObjectUuid: string }>,
  generationId: string,
  exportFormat: ExportFormat,
  textCustomization: TextCustomization
): Promise<GenerationResponse> {
  const formData = new FormData();
  
  // Add either the file or URL
  if (design) {
    formData.append('design', design);
  } else if (designUrl) {
    formData.append('designUrl', designUrl);
  }

  formData.append('generationId', generationId);
  formData.append('uuidPairs', JSON.stringify(uuidPairs));
  formData.append('mockupCount', uuidPairs.length.toString());
  formData.append('exportFormat', exportFormat);
  
  // Separate text customization into distinct fields
  formData.append('textCustomizationEnabled', textCustomization.enabled.toString());
  formData.append('textCustomizationMockups', JSON.stringify(textCustomization.appliedMockups));
  formData.append('textCustomizationHtml', textCustomization.enabled ? textCustomization.html : '');

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

    return { 
      success: true,
      mockups: result.mockups.map(mockup => ({
        ...mockup,
        url: mockup.url.includes('drive.google.com/file/d/') 
          ? `https://drive.google.com/uc?export=view&id=${mockup.url.split('/')[5]}`
          : mockup.url
      }))
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