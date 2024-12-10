import toast from 'react-hot-toast';

const MAKE_WEBHOOK_URL = {
  mockupCreation: 'https://hook.eu1.make.com/bsbuo7abdrxgb94txqo02qrq31531oeq',
  mockupGeneration: 'https://hook.eu1.make.com/yp4gvxyfd6mctqgln6wqwg31uvla5f6u'
};

interface WebhookResponse {
  success: boolean;
  error?: string;
  mockups?: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface MockupCreationData {
  mockupId: string;
  mockupUuid: string;
  smartObjectUuid: string;
  name: string;
  category: string;
}

interface MockupGenerationData {
  generationId: string;
  mockupIds: string[];
  mockupUuids: string[];
  smartObjectUuids: string[];
  design: File;
}

export async function triggerMakeWebhook(data: MockupCreationData): Promise<WebhookResponse> {
  try {
    const payload = {
      mockup: {
        id: data.mockupId,
        mockupUuid: data.mockupUuid,
        smartObjectUuid: data.smartObjectUuid,
        name: data.name,
        category: data.category
      }
    };

    const response = await fetch(MAKE_WEBHOOK_URL.mockupCreation, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'WEBHOOK_ERROR');
    }

    const result = await response.json();
    return { success: true, ...result };
  } catch (error: any) {
    console.error('Error triggering webhook:', error);
    const errorMessage = error.message === 'WEBHOOK_ERROR' 
      ? 'Erreur lors de la communication avec Make'
      : 'Erreur lors de l\'envoi vers Make';
    throw new Error(errorMessage);
  }
}

export async function triggerGenerationWebhook(data: MockupGenerationData): Promise<WebhookResponse> {
  try {
    const formData = new FormData();
    formData.append('design', data.design);
    formData.append('generationId', data.generationId);
    
    // Create array of UUID pairs for Make iterator
    const uuidPairs = data.mockupIds.map((_, index) => ({
      mockupUuid: data.mockupUuids[index],
      smartObjectUuid: data.smartObjectUuids[index]
    }));
    
    // Add UUID pairs as JSON string
    formData.append('uuidPairs', JSON.stringify(uuidPairs));
    
    // Add mockup IDs count
    formData.append('mockupCount', data.mockupIds.length.toString());
    
    // Add individual mockup IDs for backward compatibility
    data.mockupIds.forEach((id, index) => {
      formData.append(`mockupId${index + 1}`, id);
    });

    const response = await fetch(MAKE_WEBHOOK_URL.mockupGeneration, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'GENERATION_WEBHOOK_ERROR');
    }

    const result = await response.json();
    
    if (!result.mockups || !Array.isArray(result.mockups)) {
      throw new Error('INVALID_RESPONSE_FORMAT');
    }

    return { 
      success: true,
      mockups: result.mockups.map(mockup => ({
        ...mockup,
        url: mockup.url.startsWith('https://drive.google.com/file/d/') 
          ? `https://drive.google.com/uc?export=view&id=${mockup.url.split('/')[5]}`
          : mockup.url
      }))
    };
  } catch (error: any) {
    console.error('Error triggering generation webhook:', error);
    
    let errorMessage = 'Erreur lors de la génération des mockups';
    if (error.message === 'INVALID_RESPONSE_FORMAT') {
      errorMessage = 'Format de réponse invalide du serveur';
    } else if (error.message === 'GENERATION_WEBHOOK_ERROR') {
      errorMessage = 'Erreur lors de la communication avec Make';
    }
    
    throw new Error(errorMessage);
  }
}