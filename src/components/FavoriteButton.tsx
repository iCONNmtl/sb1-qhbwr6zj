import React from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite } from '../utils/favorites';
import clsx from 'clsx';

interface FavoriteButtonProps {
  mockupId: string;
  userId: string;
  isFavorite: boolean;
  className?: string;
}

export default function FavoriteButton({ mockupId, userId, isFavorite, className }: FavoriteButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    try {
      await toggleFavorite(userId, mockupId, isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'absolute top-2 left-2 p-2 rounded-full transition-all duration-200 z-10',
        isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm hover:bg-white',
        className
      )}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={clsx(
          'h-5 w-5',
          isFavorite ? 'fill-current' : 'text-gray-600'
        )}
      />
    </button>
  );
}