import React from 'react';
import { Layers } from 'lucide-react';
import clsx from 'clsx';

interface MockupCustomizationSelectorProps {
  totalMockups: number;
  selectedMockups: number[];
  onChange: (mockups: number[]) => void;
}

export default function MockupCustomizationSelector({
  totalMockups,
  selectedMockups,
  onChange
}: MockupCustomizationSelectorProps) {
  const handleSelectAll = () => {
    onChange(Array.from({ length: totalMockups }, (_, i) => i + 1));
  };

  const handleSelectMockup = (mockupNumber: number) => {
    if (selectedMockups.includes(mockupNumber)) {
      onChange(selectedMockups.filter(i => i !== mockupNumber));
    } else {
      onChange([...selectedMockups, mockupNumber].sort((a, b) => a - b));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Layers className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Appliquer la personnalisation sur
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {/* Select All Option */}
        <button
          onClick={handleSelectAll}
          className={clsx(
            'w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors',
            selectedMockups.length === totalMockups
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Tous les mockups
        </button>

        {/* Individual Mockup Selection */}
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: totalMockups }, (_, i) => {
            const mockupNumber = i + 1;
            return (
              <button
                key={mockupNumber}
                onClick={() => handleSelectMockup(mockupNumber)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedMockups.includes(mockupNumber)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                Mockup {mockupNumber}
              </button>
            );
          })}
        </div>

        {/* Selected Mockups Summary */}
        <div className="text-sm text-gray-600 mt-4">
          {selectedMockups.length > 0 && (
            <p>
              Sélectionnés : {selectedMockups.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}