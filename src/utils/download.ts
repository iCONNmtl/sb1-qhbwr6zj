import { saveAs } from 'file-saver';
import axios from 'axios';
import toast from 'react-hot-toast';

export async function downloadImage(url: string, filename: string): Promise<void> {
  const loadingToast = toast.loading('Téléchargement en cours...');
  
  try {
    // Use the Google Drive view URL directly
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'image/jpeg,image/*,*/*',
      },
      timeout: 30000, // 30 second timeout
    });
    
    // Validate content type
    const contentType = response.headers['content-type'];
    if (!contentType?.includes('image')) {
      throw new Error('Le fichier n\'est pas une image valide');
    }
    
    // Create file name with extension
    const extension = contentType.includes('jpeg') ? 'jpg' : 'png';
    const fullFilename = `${filename}.${extension}`;
    
    // Save file using file-saver
    saveAs(new Blob([response.data]), fullFilename);
    
    toast.success('Image téléchargée avec succès', { id: loadingToast });
  } catch (error: any) {
    console.error('Download error:', error);
    
    let errorMessage = 'Erreur lors du téléchargement';
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Le téléchargement a pris trop de temps';
      } else if (error.response?.status === 404) {
        errorMessage = 'L\'image n\'est plus disponible';
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès non autorisé à l\'image';
      }
    }
    
    toast.error(errorMessage, { id: loadingToast });
    throw error;
  }
}