import React from 'react';
import type { AspectRatio } from '../types/mockup';

interface AspectRatioBadgeProps {
  ratio: AspectRatio;
}

export default function AspectRatioBadge({ ratio }: AspectRatioBadgeProps) {
  const getRatioStyles = (ratio: AspectRatio): { width: number; height: number } => {
    const MAX_HEIGHT = 24; // 6 units in Tailwind (1.5rem)
    
    const calculateDimensions = (w: number, h: number) => {
      const scale = MAX_HEIGHT / Math.max(w, h);
      return {
        width: Math.round(w * scale),
        height: Math.round(h * scale)
      };
    };

    switch (ratio) {
      case '16:9':
        return calculateDimensions(16, 9);
      case '3:2':
        return calculateDimensions(3, 2);
      case '4:3':
        return calculateDimensions(4, 3);
      case '1:1':
        return calculateDimensions(1, 1);
      case '9:16':
        return calculateDimensions(9, 16);
      case '2:3':
        return calculateDimensions(2, 3);
      case '3:4':
        return calculateDimensions(3, 4);
      default:
        return calculateDimensions(1, 1);
    }
  };

  const dimensions = getRatioStyles(ratio);

  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="flex items-center space-x-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
        <div 
          className="border-2 border-white rounded-sm"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`
          }}
        />
        <span className="text-xs font-medium text-white">{ratio}</span>
      </div>
    </div>
  );
}