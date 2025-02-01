import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    // Récupérer l'image
    const response = await fetch(url);
    const blob = await response.blob();

    // Déterminer l'extension en fonction du type MIME
    let extension = 'jpg'; // Par défaut
    if (blob.type === 'image/webp') {
      extension = 'webp';
    } else if (blob.type === 'image/png') {
      extension = 'png';
    }

    // Télécharger avec file-saver
    saveAs(blob, `${filename}.${extension}`);
    
    toast.success('Image téléchargée avec succès');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Erreur lors du téléchargement');
    throw error;
  }
}
