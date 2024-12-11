import React from 'react';
import { Image, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import AspectRatioBadge from '../AspectRatioBadge';
import FavoriteButton from '../FavoriteButton';
import type { Mockup } from '../../types/mockup';

interface MockupGridProps {
  mockups: Mockup[];
  selectedMockups: string[];
  favorites: string[];
  userId: string;
  onSelect: (mockupId: string) => void;
}

export default function MockupGrid({
  mockups,
  selectedMockups,
  favorites,
  userId,
  onSelect
}: MockupGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mockups.map((mockup) => (
        <div
          key={mockup.id}
          onClick={() => onSelect(mockup.id)}
          className={clsx(
            'group aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative transform hover:scale-105',
            selectedMockups.includes(mockup.id) && 'ring-2 ring-indigo-600'
          )}
        >
          <FavoriteButton
            mockupId={mockup.id}
            userId={userId}
            isFavorite={favorites.includes(mockup.id)}
          />
          
          <AspectRatioBadge ratio={mockup.aspectRatio} />
          
          {mockup.previewUrl ? (
            <ImageLoader
              src={mockup.previewUrl}
              alt={mockup.name}
              className="absolute inset-0"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Image className="h-12 w-12 text-gray-400" />
            </div>
          )}
          {selectedMockups.includes(mockup.id) && (
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-20 backdrop-blur-sm">
              <CheckCircle className="h-12 w-12 text-indigo-600" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="font-medium text-white">{mockup.name}</h3>
            <p className="text-sm text-gray-200">{mockup.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}