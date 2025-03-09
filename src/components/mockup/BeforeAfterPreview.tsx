import React from 'react';
import { X } from 'lucide-react';
import { Compare } from '../ui/compare';
import type { Mockup } from '../../types/mockup';

interface BeforeAfterPreviewProps {
  mockup: Mockup;
  onClose: () => void;
}

export default function BeforeAfterPreview({ mockup, onClose }: BeforeAfterPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {mockup.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Compare
            firstImage={mockup.previewUrl}
            secondImage={mockup.previewUrlAfter}
            className="w-full aspect-square rounded-xl"
            firstImageClassName="object-cover"
            secondImageClassname="object-cover"
            slideMode="hover"
            autoplay={true}
          />

          {/* Labels */}
          <div className="flex items-center justify-between mt-4">
            <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-900">
              Design brut
            </div>
            <div className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-900">
              Mockup professionnel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}