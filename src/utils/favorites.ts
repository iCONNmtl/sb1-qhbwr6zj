import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export async function toggleFavorite(userId: string, mockupId: string, isFavorite: boolean) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: isFavorite ? arrayRemove(mockupId) : arrayUnion(mockupId)
    });
    
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  } catch (error) {
    console.error('Error toggling favorite:', error);
    toast.error('Erreur lors de la mise à jour des favoris');
    throw error;
  }
}