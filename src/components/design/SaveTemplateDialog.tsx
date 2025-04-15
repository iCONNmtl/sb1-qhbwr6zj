import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import type { DesignState } from '../../types/design';

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  designState: DesignState;
  thumbnailUrl: string;
  userId: string;
}

export default function SaveTemplateDialog({
  isOpen,
  onClose,
  onSuccess,
  designState,
  thumbnailUrl,
  userId
}: SaveTemplateDialogProps) {
  const [name, setName] = useState(designState.designName || 'My Template');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Le nom du template est requis');
      return;
    }

    setLoading(true);
    try {
      // Prepare template data
      const templateData = {
        userId,
        name: name.trim(),
        description: description.trim() || null,
        thumbnail: thumbnailUrl,
        elements: designState.elements,
        backgroundColor: designState.backgroundColor,
        canvasWidth: designState.canvasWidth,
        canvasHeight: designState.canvasHeight,
        sizeId: designState.currentSize,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
        category: category.trim() || null
      };

      // Save to Firestore
      await addDoc(collection(db, 'designTemplates'), templateData);
      
      toast.success('Template sauvegardé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde du template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Sauvegarder comme template
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du template
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Mon template"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnelle)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Description du template..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie (optionnelle)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Affiche, Flyer, Carte de visite..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: minimaliste, moderne, business..."
            />
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Aperçu</h4>
              <div className="text-sm text-gray-500">
                {designState.canvasWidth} × {designState.canvasHeight}px
              </div>
            </div>
            <div className="aspect-square w-full max-w-[200px] mx-auto bg-gray-100 rounded-lg overflow-hidden">
              {thumbnailUrl && (
                <img 
                  src={thumbnailUrl} 
                  alt="Template preview" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}