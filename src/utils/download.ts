import toast from 'react-hot-toast';

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    // Créer un élément a temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.jpg`; // Extension par défaut
    
    // Ajouter et cliquer sur le lien
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image téléchargée avec succès');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Erreur lors du téléchargement');
    throw error;
  }
}