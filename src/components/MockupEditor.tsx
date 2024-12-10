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

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: 'Paysage 16:9' },
  { value: '3:2', label: 'Paysage 3:2' },
  { value: '4:3', label: 'Paysage 4:3' },
  { value: '1:1', label: 'Carré 1:1' },
  { value: '9:16', label: 'Portrait 16:9' },
  { value: '2:3', label: 'Portrait 3:2' },
  { value: '3:4', label: 'Portrait 4:3' }
];

export default function MockupEditor({ mockup, onClose, onSuccess }: MockupEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: mockup.name,
    category: mockup.category,
    aspectRatio: mockup.aspectRatio,
    mockupUuid: mockup.mockupUuid,
    smartObjectUuid: mockup.smartObjectUuid
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
        smartObjectUuid: formData.smartObjectUuid
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
              Format
            </label>
            <select
              value={formData.aspectRatio}
              onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as AspectRatio })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              {aspectRatios.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
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