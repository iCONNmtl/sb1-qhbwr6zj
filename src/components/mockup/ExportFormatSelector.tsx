import React from 'react';
import { FileImage } from 'lucide-react';
import type { ExportFormat } from '../../types/mockup';

interface ExportFormatSelectorProps {
  format: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

export default function ExportFormatSelector({ format, onChange }: ExportFormatSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Format d'export
      </h2>
      <div className="flex gap-4">
        {(['webp', 'png'] as const).map((exportFormat) => (
          <button
            key={exportFormat}
            onClick={() => onChange(exportFormat)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              format === exportFormat
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              <FileImage className={`h-6 w-6 ${
                format === exportFormat ? 'text-indigo-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <p className={`font-medium ${
                format === exportFormat ? 'text-indigo-600' : 'text-gray-900'
              }`}>
                {exportFormat.toUpperCase()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {exportFormat === 'webp' ? 'Meilleure compression' : 'Meilleure compatibilité'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}