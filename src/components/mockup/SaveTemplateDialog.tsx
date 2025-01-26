import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { saveTemplate, getUserTemplates } from '../../services/templateService';
import toast from 'react-hot-toast';
import type { TextLayer, ImageLayer } from '../../types/mockup';

interface SaveTemplateDialogProps {
  userId: string;
  layers: (TextLayer | ImageLayer)[];
  onClose: () => void;
  onSuccess: () => void;
}

const TEMPLATE_CATEGORIES = ['Promotions', 'Produits', 'Social Media'] as const;
const MAX_TEMPLATES = 10;

export default function SaveTemplateDialog({ userId, layers, onClose, onSuccess }: SaveTemplateDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<typeof TEMPLATE_CATEGORIES[number]>(TEMPLATE_CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [templateCount, setTemplateCount] = useState(0);

  useEffect(() => {
    const fetchTemplateCount = async () => {
      try {
        const templates = await getUserTemplates(userId);
        setTemplateCount(templates.length);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplateCount();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (templateCount >= MAX_TEMPLATES) {
      toast.error(`Vous avez atteint la limite de ${MAX_TEMPLATES} templates`);
      return;
    }

    if (!name.trim() || !category.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      // Convertir les calques en format de template
      const templateLayers = layers.map(({ id, ...layer }) => {
        if (layer.type === 'text') {
          return {
            type: 'text' as const,
            text: layer.text,
            style: layer.style,
            position: layer.position
          };
        } else {
          return {
            type: 'image' as const,
            url: layer.url,
            style: layer.style,
            position: layer.position
          };
        }
      });

      await saveTemplate(userId, {
        name: name.trim(),
        category: category.trim(),
        layers: templateLayers
      });
      
      toast.success('Template sauvegardé');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
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

        {templateCount >= MAX_TEMPLATES ? (
          <div className="text-center p-4 bg-red-50 rounded-lg mb-4">
            <p className="text-red-600 font-medium">
              Vous avez atteint la limite de {MAX_TEMPLATES} templates
            </p>
            <p className="text-sm text-red-500 mt-1">
              Supprimez d'anciens templates pour en créer de nouveaux
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            {MAX_TEMPLATES - templateCount} template{MAX_TEMPLATES - templateCount > 1 ? 's' : ''} restant{MAX_TEMPLATES - templateCount > 1 ? 's' : ''}
          </p>
        )}

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
              placeholder="Ex: Promo Moderne"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof TEMPLATE_CATEGORIES[number])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || templateCount >= MAX_TEMPLATES}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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
        </form>
      </div>
    </div>
  );
}