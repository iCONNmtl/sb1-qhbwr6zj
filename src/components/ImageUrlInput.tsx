import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { validateImageUrl, getGoogleDriveImageUrl } from '../utils/validation';
import toast from 'react-hot-toast';

interface ImageUrlInputProps {
  mockupId: string;
  currentUrl?: string;
  onUpdate: (url: string) => Promise<void>;
}

export default function ImageUrlInput({ mockupId, currentUrl, onUpdate }: ImageUrlInputProps) {
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateImageUrl(url)) {
      toast.error('URL Google Drive invalide');
      return;
    }

    setLoading(true);
    try {
      const formattedUrl = getGoogleDriveImageUrl(url);
      await onUpdate(formattedUrl);
      setIsEditing(false);
      setUrl('');
      toast.success('Image mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'image');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
        title="Modifier l'image"
      >
        <Link className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL Google Drive"
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      />
      <div className="flex space-x-1">
        <button
          type="submit"
          disabled={loading || !url}
          className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? '...' : 'OK'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setUrl('');
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}