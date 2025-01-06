import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import type { Mockup } from '../../types/mockup';

interface MockupSliderProps {
  mockups: Mockup[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function MockupSlider({ mockups, currentIndex, onIndexChange }: MockupSliderProps) {
  if (mockups.length <= 1) return null;

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={() => onIndexChange((currentIndex - 1 + mockups.length) % mockups.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
      
      <button
        onClick={() => onIndexChange((currentIndex + 1) % mockups.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>

      {/* Thumbnails */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {mockups.map((mockup, index) => (
          <button
            key={mockup.id}
            onClick={() => onIndexChange(index)}
            className={clsx(
              'relative w-12 h-12 rounded-lg overflow-hidden transition-all',
              currentIndex === index ? 'ring-2 ring-indigo-600 scale-110' : 'opacity-50 hover:opacity-100'
            )}
          >
            <ImageLoader
              src={mockup.previewUrl || ''}
              alt={mockup.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}