import React from 'react';
import { FileImage, Zap } from 'lucide-react';
import clsx from 'clsx';
import type { ExportFormat } from '../../types/mockup';

interface ExportFormatSelectorProps {
  format: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const FORMATS = [
  {
    id: 'webp' as const,
    name: 'WebP',
    icon: FileImage,
    description: 'Format optimisé pour le web',
    features: [
      'Meilleure compression',
      'Qualité optimale',
      'Taille réduite'
    ],
    recommended: true
  },
  {
    id: 'png' as const,
    name: 'PNG',
    icon: FileImage,
    description: 'Format universel',
    features: [
      'Compatible partout',
      'Sans perte de qualité',
      'Transparence supportée'
    ]
  }
];

export default function ExportFormatSelector({ format, onChange }: ExportFormatSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Format d'export
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Choisissez le format qui correspond le mieux à vos besoins
        </p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {FORMATS.map((exportFormat) => {
            const Icon = exportFormat.icon;
            const isSelected = format === exportFormat.id;
            
            return (
              <button
                key={exportFormat.id}
                onClick={() => onChange(exportFormat.id)}
                className={clsx(
                  'relative p-6 rounded-xl text-left transition-all duration-200',
                  'border-2',
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {/* Badge Recommandé */}
                {exportFormat.recommended && (
                  <div className="absolute -top-3 -right-2">
                    <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full shadow-sm flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      Recommandé
                    </div>
                  </div>
                )}

                {/* Icon et Titre */}
                <div className="flex items-center mb-4">
                  <div className={clsx(
                    'p-2 rounded-lg mr-3',
                    isSelected ? 'bg-indigo-100' : 'bg-gray-100'
                  )}>
                    <Icon className={clsx(
                      'h-5 w-5',
                      isSelected ? 'text-indigo-600' : 'text-gray-600'
                    )} />
                  </div>
                  <div>
                    <h3 className={clsx(
                      'font-semibold',
                      isSelected ? 'text-indigo-600' : 'text-gray-900'
                    )}>
                      {exportFormat.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {exportFormat.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {exportFormat.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className={clsx(
                        'h-4 w-4 mr-2 flex-shrink-0',
                        isSelected ? 'text-indigo-600' : 'text-gray-400'
                      )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}