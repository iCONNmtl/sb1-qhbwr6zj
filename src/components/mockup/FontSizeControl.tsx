import React from 'react';
import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
const PRESETS = [16, 24, 32, 48];

interface FontSizeControlProps {
  value: number;
  onChange: (size: number) => void;
}

export default function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  const currentSize = isNaN(value) ? 24 : value;

  const handleIncrement = () => {
    const currentIndex = FONT_SIZES.indexOf(currentSize);
    if (currentIndex < FONT_SIZES.length - 1) {
      onChange(FONT_SIZES[currentIndex + 1]);
    }
  };

  const handleDecrement = () => {
    const currentIndex = FONT_SIZES.indexOf(currentSize);
    if (currentIndex > 0) {
      onChange(FONT_SIZES[currentIndex - 1]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Taille
      </label>

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-4">
          {/* Contrôles à gauche */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                disabled={currentSize <= FONT_SIZES[0]}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[2ch] text-center">
                {currentSize}
              </span>
              <button
                onClick={handleIncrement}
                disabled={currentSize >= FONT_SIZES[FONT_SIZES.length - 1]}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-500">px</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {PRESETS.map((size) => (
                <button
                  key={size}
                  onClick={() => onChange(size)}
                  className={clsx(
                    'px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200',
                    currentSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Slider à droite */}
          <div className="flex-1">
            <input
              type="range"
              min={FONT_SIZES[0]}
              max={FONT_SIZES[FONT_SIZES.length - 1]}
              value={currentSize}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}