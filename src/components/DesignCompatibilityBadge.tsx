import React from 'react';
import { Info } from 'lucide-react';
import { checkDesignCompatibility, getCompatibilityColor, getCompatibilityIcon } from '../utils/designCompatibility';
import clsx from 'clsx';
import type { Size } from '../types/product';

interface DesignCompatibilityBadgeProps {
  designWidth: number;
  designHeight: number;
  size: Size;
  className?: string;
}

export default function DesignCompatibilityBadge({
  designWidth,
  designHeight,
  size,
  className
}: DesignCompatibilityBadgeProps) {
  const compatibility = checkDesignCompatibility(designWidth, designHeight, size);
  const colorClass = getCompatibilityColor(compatibility.status);
  const icon = getCompatibilityIcon(compatibility.status);

  const getStatusText = () => {
    switch (compatibility.status) {
      case 'perfect':
        return 'Format parfait';
      case 'good':
        return 'Format compatible';
      case 'warning':
        return 'Résolution faible';
      case 'incompatible':
        return 'Format incompatible';
      default:
        return 'Format inconnu';
    }
  };

  return (
    <div className={clsx('relative group', className)}>
      <div className={clsx(
        'px-3 py-1.5 rounded-full border flex items-center gap-2 transition-colors',
        colorClass
      )}>
        <span className="text-sm font-medium">{size.name}</span>
        <span className="text-xs">{icon}</span>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">{getStatusText()}</div>
              <div className="space-y-1 text-sm">
                <div>Format: {size.dimensions.inches} ({size.dimensions.cm})</div>
                <div>Recommandé: {size.recommendedSize.width}x{size.recommendedSize.height}px</div>
                <div>Votre design: {designWidth}x{designHeight}px</div>
                {compatibility.reason && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-white/80">
                    {compatibility.reason}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}