import toast from 'react-hot-toast';

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    // Ouvrir l'image dans un nouvel onglet
    window.open(url, '_blank');
    
    toast.success('Image ouverte dans un nouvel onglet');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Erreur lors de l\'ouverture de l\'image');
    throw error;
  }
}
