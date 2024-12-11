import React from 'react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import type { Mockup } from '../types/mockup';

interface CategoryCountProps {
  category: {
    id: string;
    name: string;
  };
  mockups: Mockup[];
  favorites: string[];
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCount({ 
  category, 
  mockups, 
  favorites, 
  isSelected, 
  onClick 
}: CategoryCountProps) {
  const count = React.useMemo(() => {
    if (category.id === 'all') {
      return mockups.length;
    }
    if (category.id === 'favorites') {
      return favorites.length;
    }
    return mockups.filter(mockup => mockup.category === category.id).length;
  }, [category.id, mockups, favorites]);

  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200',
        isSelected
          ? 'gradient-bg text-white shadow-lg scale-105'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      )}
    >
      <div className="flex items-center space-x-2">
        {category.id === 'favorites' && (
          <Heart className="h-4 w-4" />
        )}
        <span>{category.name}</span>
        <span className={clsx(
          'px-2 py-0.5 rounded-full text-xs',
          isSelected 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 text-gray-600'
        )}>
          {count}
        </span>
      </div>
    </button>
  );
}