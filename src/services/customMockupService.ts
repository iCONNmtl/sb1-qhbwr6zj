import { collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';
import type { Mockup } from '../types/mockup';

const MAKE_WEBHOOKS = {
  initialize: 'https://hook.eu1.make.com/r8zt6ofgwnpbej8egj75l6kj1c76viky',
  create: 'https://hook.eu1.make.com/uqr3vqaslf5ok7tw4pq4pnwhvo1anks5'
};

interface InitializeResponse {
  mockupId: string;
  driveUrl: string;
}

interface MakeWebhookResponse {
  success: boolean;
  data?: {
    driveUrl?: string;
    mockup?: {
      id: string;
      name: string;
      category: string;
      aspectRatio: string;
      previewUrl: string;
      mockupUuid: string;
      smartObjectUuid: string;
    };
    error?: string;
  };
}

async function callMakeWebhook(url: string, data: any): Promise<MakeWebhookResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (typeof result.success !== 'boolean') {
      throw new Error('Invalid response format: missing success field');
    }

    return result;
  } catch (error: any) {
    console.error('Webhook error:', error);
    throw new Error(error.message || 'Failed to call webhook');
  }
}

export async function initializeCustomMockup(userId: string): Promise<InitializeResponse> {
  const mockupId = nanoid();

  try {
    // Create initial mockup document
    const mockupRef = collection(db, 'mockups');
    await addDoc(mockupRef, {
      id: mockupId,
      userId,
      name: 'Custom Mockup',
      category: 'custom',
      aspectRatio: '16:9',
      active: false,
      createdAt: new Date().toISOString()
    });

    // Call Make webhook
    const result = await callMakeWebhook(MAKE_WEBHOOKS.initialize, { 
      mockupId,
      userId 
    });

    if (!result.success) {
      throw new Error(result.data?.error || 'Failed to initialize mockup');
    }

    if (!result.data?.driveUrl) {
      throw new Error('Missing drive URL in response');
    }

    return { 
      mockupId, 
      driveUrl: result.data.driveUrl 
    };
  } catch (error: any) {
    console.error('Error initializing mockup:', error);
    throw new Error(error.message || 'Failed to initialize mockup');
  }
}

export async function createCustomMockup(mockupId: string): Promise<void> {
  try {
    // Call Make webhook
    const result = await callMakeWebhook(MAKE_WEBHOOKS.create, { mockupId });

    if (!result.success) {
      throw new Error(result.data?.error || 'Failed to create mockup');
    }

    if (!result.data?.mockup) {
      throw new Error('Missing mockup data in response');
    }

    // Get mockup document
    const mockupsRef = collection(db, 'mockups');
    const q = query(mockupsRef, where('id', '==', mockupId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Mockup not found');
    }

    const mockupDoc = querySnapshot.docs[0];
    const { mockup } = result.data;

    // Update mockup with generated data
    await updateDoc(mockupDoc.ref, {
      name: mockup.name,
      aspectRatio: mockup.aspectRatio,
      previewUrl: mockup.previewUrl,
      mockupUuid: mockup.mockupUuid,
      smartObjectUuid: mockup.smartObjectUuid,
      active: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error creating mockup:', error);
    throw new Error(error.message || 'Failed to create mockup');
  }
}