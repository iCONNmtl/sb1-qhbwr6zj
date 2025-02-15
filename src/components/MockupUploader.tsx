import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { validateMockupData } from '../utils/mockups';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import type { AspectRatio } from '../types/mockup';

interface MockupUploaderProps {
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

export default function MockupUploader({ onClose, onSuccess }: MockupUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [mockupData, setMockupData] = useState({
    name: '',
    category: '',
    aspectRatio: '8x10' as AspectRatio,
    mockupUuid: '',
    smartObjectUuid: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mockupsSnap = await getDocs(collection(db, 'mockups'));
        const uniqueCategories = new Set<string>();
        mockupsSnap.docs.forEach(doc => {
          const category = doc.data().category;
          if (category) uniqueCategories.add(category);
        });
        setCategories(Array.from(uniqueCategories));
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Erreur lors du chargement des catégories');
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    if (categories.includes(newCategory.trim())) {
      toast.error('Cette catégorie existe déjà');
      return;
    }
    setCategories(prev => [...prev, newCategory.trim()]);
    setMockupData(prev => ({ ...prev, category: newCategory.trim() }));
    setNewCategory('');
    setShowNewCategory(false);
  };

  const validateUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = mockupData.category || newCategory.trim();
    const validation = validateMockupData(mockupData.name, selectedCategory);
    
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    if (!validateUUID(mockupData.mockupUuid)) {
      toast.error('UUID de mockup invalide');
      return;
    }

    if (!validateUUID(mockupData.smartObjectUuid)) {
      toast.error('UUID de smart object invalide');
      return;
    }

    setLoading(true);
    try {
      const mockupId = nanoid(10);
      
      await addDoc(collection(db, 'mockups'), {
        id: mockupId,
        name: mockupData.name.trim(),
        category: selectedCategory,
        aspectRatio: mockupData.aspectRatio,
        mockupUuid: mockupData.mockupUuid,
        smartObjectUuid: mockupData.smartObjectUuid,
        createdAt: new Date().toISOString(),
        active: true
      });

      toast.success('Mockup ajouté avec succès');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating mockup:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du mockup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Ajouter un mockup
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
              value={mockupData.name}
              onChange={(e) => setMockupData({ ...mockupData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="MacBook Pro 16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mockup UUID
            </label>
            <input
              type="text"
              value={mockupData.mockupUuid}
              onChange={(e) => setMockupData({ ...mockupData, mockupUuid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="3c0fac43-c32d-47e3-87d0-0848586a8ac1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Smart Object UUID
            </label>
            <input
              type="text"
              value={mockupData.smartObjectUuid}
              onChange={(e) => setMockupData({ ...mockupData, smartObjectUuid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="87f83e41-5671-4918-9122-09e894ece8ea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={mockupData.aspectRatio}
              onChange={(e) => setMockupData({ ...mockupData, aspectRatio: e.target.value as AspectRatio })}
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
            {showNewCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nouvelle catégorie"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Ajouter
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={mockupData.category}
                  onChange={(e) => setMockupData({ ...mockupData, category: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="Ajouter une nouvelle catégorie"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le mockup'}
          </button>
        </form>
      </div>
    </div>
  );
}