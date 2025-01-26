import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ImageLoader from '../ImageLoader';
import toast from 'react-hot-toast';

interface LogoUploaderProps {
  userId: string;
  currentLogo?: string;
}

export default function LogoUploader({ userId, currentLogo }: LogoUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return;
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2MB');
      return;
    }

    setLoading(true);

    try {
      // Créer un FormData
      const formData = new FormData();
      formData.append('logo', file);
      formData.append('userId', userId);

      // Appeler le webhook
      const response = await fetch('https://hook.eu1.make.com/ey6z51k4qkq5c8wgxuaqrfialucqf95e', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      
      if (!data.logoUrl) {
        throw new Error('URL du logo manquante dans la réponse');
      }

      // Mettre à jour l'URL du logo dans Firebase
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        logoUrl: data.logoUrl
      });

      toast.success('Logo mis à jour avec succès');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erreur lors de l\'upload du logo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Logo</h3>
        <label className="relative cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <span className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
            loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                {currentLogo ? 'Changer le logo' : 'Ajouter un logo'}
              </>
            )}
          </span>
        </label>
      </div>

      {/* Prévisualisation du logo */}
      {currentLogo ? (
        <div className="relative aspect-video w-full max-w-sm bg-gray-50 rounded-lg overflow-hidden">
          <ImageLoader
            src={currentLogo}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center aspect-video w-full max-w-sm bg-gray-50 rounded-lg">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun logo</p>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Format recommandé : PNG ou JPEG, max 2MB
      </p>
    </div>
  );
}