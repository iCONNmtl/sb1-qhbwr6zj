import React from 'react';
import { Type } from 'lucide-react';
import clsx from 'clsx';

interface TextCustomizationToggleProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function TextCustomizationToggle({ isEnabled, onChange }: TextCustomizationToggleProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3">
        <Type className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Personnaliser le texte
        </h3>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => onChange(true)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isEnabled
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Oui
        </button>
        <button
          onClick={() => onChange(false)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            !isEnabled
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Non
        </button>
      </div>
    </div>
  );
}