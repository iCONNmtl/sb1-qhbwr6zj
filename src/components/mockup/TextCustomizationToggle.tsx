import React from 'react';
import { Type } from 'lucide-react';
import clsx from 'clsx';

interface TextCustomizationToggleProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function TextCustomizationToggle({ isEnabled, onChange }: TextCustomizationToggleProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Type className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Personnaliser le texte
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Ajoutez du texte personnalisé sur vos mockups
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange(true)}
              className={clsx(
                'relative px-6 py-2 rounded-lg font-medium transition-all duration-200',
                isEnabled
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {isEnabled && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              Oui
            </button>
            <button
              onClick={() => onChange(false)}
              className={clsx(
                'relative px-6 py-2 rounded-lg font-medium transition-all duration-200',
                !isEnabled
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-100'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {!isEnabled && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              Non
            </button>
          </div>
        </div>
      </div>

      {isEnabled && (
        <div className="p-4 bg-indigo-50/50">
          <div className="flex items-center space-x-3 text-sm text-indigo-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Ajoutez du texte, modifiez sa taille, sa couleur et sa position sur vos mockups</p>
          </div>
        </div>
      )}
    </div>
  );
}