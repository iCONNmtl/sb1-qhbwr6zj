import React, { useState } from 'react';
import { Layout, ChevronDown } from 'lucide-react';
import { TEXT_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/textTemplates';
import type { TextTemplate } from '../../types/textTemplate';
import clsx from 'clsx';

interface TextTemplateSelectorProps {
  onSelect: (template: TextTemplate) => void;
}

export default function TextTemplateSelector({ onSelect }: TextTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTemplates = TEXT_TEMPLATES.filter(template => 
    selectedCategory === 'Tous' || template.category === selectedCategory
  );

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
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-600 transition-colors text-left"
            >
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-500">
                {template.layers.length} couches de texte
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}