import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import type { Mockup, AspectRatio } from '../types/mockup';

interface MockupEditorProps {
  mockup: Mockup;
  onClose: () => void;
  onSuccess: () => void;
}

// Groupes de formats similaires
const ASPECT_RATIO_GROUPS = [
  {
    label: 'Format 8x10',
    ratios: [
      { value: '8x10', label: '8x10"', description: '20x25cm' }
    ]
  },
  {
    label: 'Formats rectangulaires larges',
    ratios: [
      { value: '8x12', label: '8x12"', description: '21x29,7cm' },
      { value: '12x18', label: '12x18"', description: '30x45cm' },
      { value: '24x36', label: '24x36"', description: '60x90cm' }
    ]
  },
  {
    label: 'Format 11x14',
    ratios: [
      { value: '11x14', label: '11x14"', description: '27x35cm' }
    ]
  },
  {
    label: 'Format 11x17',
    ratios: [
      { value: '11x17', label: '11x17"', description: '28x43cm' }
    ]
  },
  {
    label: 'Format 18x24',
    ratios: [
      { value: '18x24', label: '18x24"', description: '45x60cm' }
    ]
  },
  {
    label: 'Formats standards variés',
    ratios: [
      { value: 'A4', label: 'A4', description: '21x29,7cm' },
      { value: '5x7', label: '5x7"', description: '13x18cm' },
      { value: '20x28', label: '20x28"', description: '50x70cm' },
      { value: '28x40', label: '28x40"', description: '70x100cm' }
    ]
  },
  {
    label: 'Formats classiques',
    ratios: [
      { value: '16:9', label: 'Paysage 16:9' },
      { value: '3:2', label: 'Paysage 3:2' },
      { value: '4:3', label: 'Paysage 4:3' },
      { value: '1:1', label: 'Carré 1:1' },
      { value: '9:16', label: 'Portrait 16:9' },
      { value: '2:3', label: 'Portrait 3:2' },
      { value: '3:4', label: 'Portrait 4:3' }
    ]
  }
];

export default function MockupEditor({ mockup, onClose, onSuccess }: MockupEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: mockup.name,
    category: mockup.category,
    aspectRatio: mockup.aspectRatio,
    mockupUuid: mockup.mockupUuid,
    smartObjectUuid: mockup.smartObjectUuid,
    previewUrlAfter: mockup.previewUrlAfter || ''
  });

  const validateUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUUID(formData.mockupUuid)) {
      toast.error('UUID de mockup invalide');
      return;
    }

    if (!validateUUID(formData.smartObjectUuid)) {
      toast.error('UUID de smart object invalide');
      return;
    }

    setLoading(true);

    try {
      const mockupRef = doc(db, 'mockups', mockup.firestoreId);
      await updateDoc(mockupRef, {
        name: formData.name.trim(),
        category: formData.category.trim(),
        aspectRatio: formData.aspectRatio,
        mockupUuid: formData.mockupUuid,
        smartObjectUuid: formData.smartObjectUuid,
        previewUrlAfter: formData.previewUrlAfter.trim() || null
      });

      toast.success('Mockup mis à jour avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating mockup:', error);
      toast.error('Erreur lors de la mise à jour du mockup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier le mockup
          </h2>
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
              Nom du mockup
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mockup UUID
            </label>
            <input
              type="text"
              value={formData.mockupUuid}
              onChange={(e) => setFormData({ ...formData, mockupUuid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="3c0fac43-c32d-47e3-87d0-0848586a8ac1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Smart Object UUID
            </label>
            <input
              type="text"
              value={formData.smartObjectUuid}
              onChange={(e) => setFormData({ ...formData, smartObjectUuid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="87f83e41-5671-4918-9122-09e894ece8ea"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de l'aperçu "après"
            </label>
            <input
              type="url"
              value={formData.previewUrlAfter}
              onChange={(e) => setFormData({ ...formData, previewUrlAfter: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com/preview-after.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">
              URL de l'image à afficher après le survol (optionnel)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={formData.aspectRatio}
              onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as AspectRatio })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ASPECT_RATIO_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.ratios.map((ratio) => (
                    <option key={ratio.value} value={ratio.value}>
                      {ratio.label}{ratio.description ? ` - ${ratio.description}` : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Mise à jour...
              </span>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}