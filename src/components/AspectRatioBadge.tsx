import React, { useState } from 'react';
import type { AspectRatio } from '../types/mockup';

interface AspectRatioBadgeProps {
  ratio: AspectRatio;
}

export default function AspectRatioBadge({ ratio }: AspectRatioBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getRatioStyles = (ratio: AspectRatio): { width: number; height: number } => {
    const MAX_HEIGHT = 24;
    
    const calculateDimensions = (w: number, h: number) => {
      const scale = MAX_HEIGHT / Math.max(w, h);
      return {
        width: Math.round(w * scale),
        height: Math.round(h * scale)
      };
    };

    const legacyDimensions: Record<string, [number, number]> = {
      '16:9': [16, 9],
      '3:2': [3, 2],
      '4:3': [4, 3],
      '1:1': [1, 1],
      '9:16': [9, 16],
      '2:3': [2, 3],
      '3:4': [3, 4]
    };

    const standardDimensions: Record<string, [number, number]> = {
      '8x10': [8, 10],
      '8x12': [8, 12],
      '12x18': [12, 18],
      '24x36': [24, 36],
      '11x14': [11, 14],
      '11x17': [11, 17],
      '18x24': [18, 24],
      'A4': [210, 297],
      '5x7': [5, 7],
      '20x28': [20, 28],
      '28x40': [28, 40]
    };

    const dimensions = { ...legacyDimensions, ...standardDimensions };
    const [w, h] = dimensions[ratio] || [1, 1];
    return calculateDimensions(w, h);
  };

  const getSimilarFormats = (ratio: AspectRatio): string[] => {
    const similarGroups = [
      ['8x10'],
      ['8x12', '12x18', '24x36'],
      ['11x14'],
      ['11x17'],
      ['18x24'],
      ['A4', '5x7', '20x28', '28x40']
    ];

    const group = similarGroups.find(g => g.includes(ratio));
    if (!group) return [ratio];

    const dimensionsMap: Record<string, string> = {
      '8x10': '20x25cm',
      '8x12': '21x29,7cm',
      '12x18': '30x45cm',
      '24x36': '60x90cm',
      '11x14': '27x35cm',
      '11x17': '28x43cm',
      '18x24': '45x60cm',
      'A4': '21x29,7cm',
      '5x7': '13x18cm',
      '20x28': '50x70cm',
      '28x40': '70x100cm'
    };

    return group.map(format => `${format}" - ${dimensionsMap[format]}`);
  };

  const dimensions = getRatioStyles(ratio);
  const formats = getSimilarFormats(ratio);
  const mainFormat = formats[0];
  const hasMoreFormats = formats.length > 1;

  return (
    <div 
      className="absolute top-2 right-2 z-10"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge principal */}
      <div className="flex items-center space-x-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
        <div 
          className="border-2 border-white rounded-sm"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`
          }}
        />
        <span className="text-xs font-medium text-white">{mainFormat}</span>
      </div>

      {/* Tooltip avec formats similaires */}
      {showTooltip && hasMoreFormats && (
        <div className="absolute right-0 mt-2 w-max bg-black/90 backdrop-blur-sm rounded-lg py-2 px-3 shadow-lg">
          <div className="text-xs font-medium text-white/90 mb-2">
            Formats similaires :
          </div>
          <div className="space-y-1">
            {formats.slice(1).map((format) => (
              <div key={format} className="text-xs text-white/80">
                {format}
              </div>
            ))}
          </div>
          <div className="absolute -top-1 right-4 w-2 h-2 bg-black/90 rotate-45" />
        </div>
      )}
    </div>
  );
}