import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TextTemplate } from '../types/textTemplate';

export async function saveTemplate(userId: string, template: Omit<TextTemplate, 'id'>): Promise<string> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const templatesRef = collection(db, 'templates');
    const docRef = await addDoc(templatesRef, {
      ...template,
      userId,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving template:', error);
    throw new Error('Erreur lors de la sauvegarde du template');
  }
}

export async function getUserTemplates(userId: string): Promise<TextTemplate[]> {
  if (!userId) {
    return [];
  }

  try {
    const templatesRef = collection(db, 'templates');
    const q = query(templatesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TextTemplate[];
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Erreur lors du chargement des templates');
  }
}

export async function deleteTemplate(templateId: string): Promise<void> {
  if (!templateId) {
    throw new Error('Template ID is required');
  }

  try {
    await deleteDoc(doc(db, 'templates', templateId));
  } catch (error) {
    console.error('Error deleting template:', error);
    throw new Error('Erreur lors de la suppression du template');
  }
}