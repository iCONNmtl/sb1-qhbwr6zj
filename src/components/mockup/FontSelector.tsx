import React, { useState } from 'react';
import { Type, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

// Liste des polices Google Fonts avec leurs URLs et aperçus
const FONTS = [
  { 
    name: 'Roboto',
    preview: 'Modern et professionnel',
    category: 'Sans Serif',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
  },
  {
    name: 'Montserrat',
    preview: 'Élégant et contemporain',
    category: 'Sans Serif',
    url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
  },
  {
    name: 'Playfair Display',
    preview: 'Classique et raffiné',
    category: 'Serif',
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
  },
  {
    name: 'Lora',
    preview: 'Élégant et littéraire',
    category: 'Serif',
    url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap'
  },
  {
    name: 'Dancing Script',
    preview: 'Script élégant',
    category: 'Handwriting',
    url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap'
  },
  {
    name: 'Pacifico',
    preview: 'Fun et décontracté',
    category: 'Handwriting',
    url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap'
  }
];

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedFont = FONTS.find(f => f.name === value) || FONTS[0];

  // Load all fonts
  React.useEffect(() => {
    FONTS.forEach(font => {
      const link = document.createElement('link');
      link.href = font.url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Police
      </label>

      {/* Selected Font Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
      >
        <div className="flex items-center">
          <Type className="h-4 w-4 text-gray-400 mr-2" />
          <span style={{ fontFamily: selectedFont.name }} className="text-base">
            {selectedFont.name}
          </span>
        </div>
        <ChevronDown className={clsx(
          "h-4 w-4 text-gray-400 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 max-h-64 overflow-y-auto">
            {FONTS.map((font) => (
              <button
                key={font.name}
                onClick={() => {
                  onChange(font.name);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex flex-col items-start px-4 py-3 rounded-lg transition-colors',
                  value === font.name 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'hover:bg-gray-50'
                )}
              >
                <span style={{ fontFamily: font.name }} className="text-base mb-1">
                  {font.name}
                </span>
                <span className="text-xs text-gray-500">
                  {font.preview}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}