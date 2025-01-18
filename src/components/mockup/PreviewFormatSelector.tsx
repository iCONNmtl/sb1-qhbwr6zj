import React from 'react';
import { Instagram, Image } from 'lucide-react';
import clsx from 'clsx';

export type PreviewFormat = 'original' | 'instagram' | 'pinterest';

interface PreviewFormatSelectorProps {
  format: PreviewFormat;
  onChange: (format: PreviewFormat) => void;
}

const FORMATS = [
  {
    id: 'original',
    name: 'Original',
    icon: Image,
    description: 'Format original'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    description: '1080x1350px (4:5)',
    aspectRatio: '4:5'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: Instagram,
    description: '1000x1500px (2:3)',
    aspectRatio: '2:3'
  }
] as const;

export default function PreviewFormatSelector({ format, onChange }: PreviewFormatSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Format de prévisualisation
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {FORMATS.map((previewFormat) => {
          const Icon = previewFormat.icon;
          return (
            <button
              key={previewFormat.id}
              onClick={() => onChange(previewFormat.id as PreviewFormat)}
              className={clsx(
                'flex flex-col items-center p-4 rounded-lg border-2 transition-all',
                format === previewFormat.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <Icon className={clsx(
                'h-6 w-6 mb-2',
                format === previewFormat.id ? 'text-indigo-600' : 'text-gray-400'
              )} />
              <div className="text-center">
                <p className={clsx(
                  'font-medium',
                  format === previewFormat.id ? 'text-indigo-600' : 'text-gray-900'
                )}>
                  {previewFormat.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {previewFormat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}