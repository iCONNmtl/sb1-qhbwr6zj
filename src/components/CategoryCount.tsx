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
        'group relative px-4 py-2 rounded-xl transition-all duration-200',
        isSelected
          ? 'gradient-bg text-white shadow-md'
          : 'bg-white hover:bg-gray-50 text-gray-700'
      )}
    >
      <div className="flex items-center space-x-2">
        {category.id === 'favorites' && (
          <Heart className={clsx(
            'h-4 w-4',
            isSelected ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'
          )} />
        )}
        <span className="font-medium">{category.name}</span>
        <span className={clsx(
          'inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium rounded-full',
          isSelected 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
        )}>
          {count}
        </span>
      </div>
    </button>
  );
}