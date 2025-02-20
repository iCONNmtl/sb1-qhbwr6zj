import React, { useState } from 'react';
import { Book, Plus, Edit, Trash2, Crown, Eye, EyeOff, Loader2 } from 'lucide-react';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Training, TrainingStatus, TrainingAccess } from '../../types/training';

interface TrainingManagerProps {
  trainings: Training[];
  onRefresh: () => Promise<void>;
}

const CATEGORIES = [
  { id: 'tool', name: 'Utilisation de l\'outil' },
  { id: 'etsy', name: 'Vendre sur Etsy' },
  { id: 'shopify', name: 'Vendre sur Shopify' },
  { id: 'social', name: 'Marketing sur les réseaux sociaux' },
  { id: 'design', name: 'Créer ses designs' }
];

export default function TrainingManager({ trainings, onRefresh }: TrainingManagerProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: CATEGORIES[0].id,
    access: 'free' as TrainingAccess,
    credits: 0,
    sections: [{ id: '1', title: '', content: '', videoUrl: '' }]
  });

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems: paginatedTrainings
  } = usePagination(trainings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.thumbnail) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setLoading(true);
    try {
      const trainingData = {
        ...formData,
        status: 'draft' as TrainingStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingTraining) {
        await updateDoc(doc(db, 'trainings', editingTraining.id), trainingData);
        toast.success('Formation mise à jour');
      } else {
        await addDoc(collection(db, 'trainings'), trainingData);
        toast.success('Formation créée');
      }

      setShowEditor(false);
      setEditingTraining(null);
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
        category: CATEGORIES[0].id,
        access: 'free',
        credits: 0,
        sections: [{ id: '1', title: '', content: '', videoUrl: '' }]
      });
      await onRefresh();
    } catch (error) {
      console.error('Error saving training:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (trainingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      await deleteDoc(doc(db, 'trainings', trainingId));
      toast.success('Formation supprimée');
      await onRefresh();
    } catch (error) {
      console.error('Error deleting training:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusToggle = async (training: Training) => {
    try {
      const trainingRef = doc(db, 'trainings', training.id);
      const newStatus: TrainingStatus = training.status === 'draft' ? 'published' : 'draft';
      
      await updateDoc(trainingRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'published' ? { publishedAt: new Date().toISOString() } : {})
      });

      toast.success(`Formation ${newStatus === 'published' ? 'publiée' : 'dépubliée'}`);
      await onRefresh();
    } catch (error) {
      console.error('Error toggling training status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Book className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Formations
              </h2>
              <p className="text-sm text-gray-500">
                {trainings.length} formation{trainings.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle formation
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {paginatedTrainings.map((training) => (
          <div key={training.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-40 aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={training.thumbnail}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {training.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {training.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-500">
                        {training.sections.length} section{training.sections.length > 1 ? 's' : ''}
                      </span>
                      <span className={clsx(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        training.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      )}>
                        {training.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                      {training.access === 'premium' && (
                        <div className="flex items-center text-amber-600">
                          <Crown className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">
                            {training.credits} crédits
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusToggle(training)}
                      className={clsx(
                        'p-2 rounded-lg transition-colors',
                        training.status === 'published'
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-yellow-600 hover:bg-yellow-50'
                      )}
                      title={training.status === 'published' ? 'Dépublier' : 'Publier'}
                    >
                      {training.status === 'published' ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingTraining(training);
                        setFormData({
                          title: training.title,
                          description: training.description,
                          thumbnail: training.thumbnail,
                          category: training.category,
                          access: training.access,
                          credits: training.credits,
                          sections: training.sections
                        });
                        setShowEditor(true);
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(training.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTraining ? 'Modifier la formation' : 'Nouvelle formation'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la miniature
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accès
                  </label>
                  <select
                    value={formData.access}
                    onChange={(e) => setFormData({ ...formData, access: e.target.value as TrainingAccess })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="free">Gratuit</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {formData.access === 'premium' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crédits requis
                    </label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Sections</h4>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      sections: [
                        ...formData.sections,
                        { id: Date.now().toString(), title: '', content: '', videoUrl: '' }
                      ]
                    })}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Ajouter une section
                  </button>
                </div>

                {formData.sections.map((section, index) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">
                        Section {index + 1}
                      </h5>
                      {formData.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            sections: formData.sections.filter((_, i) => i !== index)
                          })}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titre de la section
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const newSections = [...formData.sections];
                            newSections[index].title = e.target.value;
                            setFormData({ ...formData, sections: newSections });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL de la vidéo (optionnel)
                        </label>
                        <input
                          type="url"
                          value={section.videoUrl}
                          onChange={(e) => {
                            const newSections = [...formData.sections];
                            newSections[index].videoUrl = e.target.value;
                            setFormData({ ...formData, sections: newSections });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contenu
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) => {
                            const newSections = [...formData.sections];
                            newSections[index].content = e.target.value;
                            setFormData({ ...formData, sections: newSections });
                          }}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingTraining(null);
                    setFormData({
                      title: '',
                      description: '',
                      thumbnail: '',
                      category: CATEGORIES[0].id,
                      access: 'free',
                      credits: 0,
                      sections: [{ id: '1', title: '', content: '', videoUrl: '' }]
                    });
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}