import React, { useState } from 'react';
import { Layout, ChevronDown, Trash2 } from 'lucide-react';
import { TEXT_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/textTemplates';
import { deleteTemplate } from '../../services/templateService';
import toast from 'react-hot-toast';
import type { TextTemplate } from '../../types/textTemplate';
import clsx from 'clsx';

interface TextTemplateSelectorProps {
  onSelect: (template: TextTemplate) => void;
  userTemplates: TextTemplate[];
}

export default function TextTemplateSelector({ onSelect, userTemplates }: TextTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Combine default and user templates
  const allTemplates = [...TEXT_TEMPLATES, ...userTemplates];

  const filteredTemplates = allTemplates.filter(template => 
    selectedCategory === 'Tous' || template.category === selectedCategory
  );

  const handleDeleteTemplate = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTemplate(templateId);
      toast.success('Template supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Layout className="h-5 w-5 mr-2" />
        Templates de texte
      </h3>

      <div className="space-y-4">
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {TEMPLATE_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="relative p-4 border border-gray-200 rounded-lg hover:border-indigo-600 transition-colors text-left group cursor-pointer"
              onClick={() => onSelect(template)}
            >
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-500">
                {template.layers.length} couche{template.layers.length > 1 ? 's' : ''} de texte
              </p>

              {/* Delete button for user templates */}
              {'userId' in template && (
                <button
                  onClick={(e) => handleDeleteTemplate(template.id, e)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Supprimer le template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}