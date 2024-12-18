import React from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

interface RatingStarsProps {
  rating?: number;
  showRating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RatingStars({ 
  rating = 5, 
  showRating = false,
  size = 'md',
  className 
}: RatingStarsProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={clsx(
              sizes[size],
              'transition-all duration-200',
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      {showRating && (
        <span className="ml-1 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}