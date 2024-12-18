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

async function retryWithBackoff(
  fn: () => Promise<Response>, 
  retries: number = API_CONFIG.retry.attempts
): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.retry.backoff));
    return retryWithBackoff(fn, retries - 1);
  }
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeouts.generation);

  try {
    // Use retry mechanism for the fetch call
    const response = await retryWithBackoff(async () => {
      const res = await fetch(API_CONFIG.webhooks.mockupGeneration, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'GENERATION_ERROR');
      }

      return res;
    });

    const result = await response.json();
    
    if (!result.mockups || !Array.isArray(result.mockups)) {
      throw new Error('INVALID_RESPONSE');
    }

    // Process and validate each mockup URL
    const processedMockups = await Promise.all(
      result.mockups.map(async mockup => {
        let url = mockup.url;
        
        // Handle Google Drive URLs
        if (url.includes('drive.google.com/file/d/')) {
          const fileId = url.split('/')[5];
          url = `https://drive.google.com/uc?export=view&id=${fileId}`;
          
          // Validate URL is accessible
          try {
            const checkResponse = await fetch(url, { method: 'HEAD' });
            if (!checkResponse.ok) {
              throw new Error('URL_INACCESSIBLE');
            }
          } catch {
            throw new Error('URL_VALIDATION_FAILED');
          }
        }

        return {
          ...mockup,
          url
        };
      })
    );

    return { 
      success: true,
      mockups: processedMockups
    };
  } catch (error: any) {
    console.error('Generation error:', error);
    
    let errorMessage = 'Erreur lors de la génération des mockups';
    
    if (error.name === 'AbortError') {
      errorMessage = 'La génération a pris trop de temps';
    } else if (error.message === 'INVALID_RESPONSE') {
      errorMessage = 'Format de réponse invalide';
    } else if (error.message === 'URL_VALIDATION_FAILED') {
      errorMessage = 'Impossible d\'accéder aux mockups générés';
    } else if (error.message === 'GENERATION_ERROR') {
      errorMessage = 'Erreur lors de la génération, veuillez réessayer';
    }
    
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    clearTimeout(timeoutId);
  }
}