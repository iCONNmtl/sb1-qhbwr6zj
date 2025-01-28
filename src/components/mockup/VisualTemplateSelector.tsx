import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { VISUAL_TEMPLATES, VISUAL_CATEGORIES } from '../../data/visualTemplates';
import clsx from 'clsx';
import type { ImageLayer } from '../../types/mockup';

interface VisualTemplateSelectorProps {
  onSelect: (layer: Omit<ImageLayer, 'id'>) => void;
  userLogo?: string;
}

export default function VisualTemplateSelector({ onSelect, userLogo }: VisualTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof VISUAL_CATEGORIES[number]>('Tous');

  const filteredTemplates = VISUAL_TEMPLATES.filter(template => 
    selectedCategory === 'Tous' ? true : template.category === selectedCategory
  );

  const handleSelect = (template: typeof VISUAL_TEMPLATES[number]) => {
    if (!userLogo) {
      return;
    }

    onSelect({
      type: 'image',
      url: userLogo,
      style: template.layer.style,
      position: template.layer.position
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Éléments visuels
        </h3>
      </div>

      {/* Catégories */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {VISUAL_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={clsx(
              'px-4 py-2 rounded-lg transition-colors',
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {!userLogo ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            Ajoutez votre logo dans les paramètres pour utiliser les éléments visuels
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Image className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-900">
                  {template.name}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {template.category}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}