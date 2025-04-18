import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Search, Filter, Folder, Plus, Trash2, ChevronDown, ChevronUp, BookTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { DesignTemplate } from '../../types/designTemplate';

interface TemplateGalleryProps {
  userId: string;
  onSelectTemplate: (template: DesignTemplate) => void;
  onClose: () => void;
}

export default function TemplateGallery({
  userId,
  onSelectTemplate,
  onClose
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        console.log('Fetching templates for user:', userId);
        
        // Use the correct collection name: designTemplates
        const templatesRef = collection(db, 'designTemplates');
        const q = query(
          templatesRef, 
          where('userId', '==', userId)
        );
        
        const snapshot = await getDocs(q);
        console.log('Templates snapshot size:', snapshot.size);
        
        const templatesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DesignTemplate[];
        
        console.log('Templates data:', templatesData);
        setTemplates(templatesData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            templatesData
              .map(t => t.category)
              .filter(Boolean) as string[]
          )
        );
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Erreur lors du chargement des templates');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTemplates();
    }
  }, [userId]);

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === null || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteTemplate = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'designTemplates', templateId));
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Template supprimé');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erreur lors de la suppression du template');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Mes templates
            </h3>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Mes templates
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un template..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {categories.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {selectedCategory || 'Toutes les catégories'}
                </span>
                {showCategories ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {showCategories && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategories(false);
                      }}
                      className={clsx(
                        'flex items-center w-full px-4 py-2 text-sm',
                        selectedCategory === null 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      Toutes les catégories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategories(false);
                        }}
                        className={clsx(
                          'flex items-center w-full px-4 py-2 text-sm',
                          selectedCategory === category 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <Folder className="h-4 w-4 mr-2" />
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory
                  ? 'Aucun template ne correspond à votre recherche'
                  : 'Vous n\'avez pas encore de templates'}
              </p>
              {searchTerm || selectedCategory ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <div className="text-sm text-gray-500">
                  Créez un design et sauvegardez-le comme template pour le retrouver ici
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="group bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="aspect-square relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 truncate">
                      {template.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                      {template.category && (
                        <div className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {template.category}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete button for user templates */}
                  <button
                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Supprimer le template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}