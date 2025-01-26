import React from 'react';
import { Trash2, Image } from 'lucide-react';
import StyleSliderControl from './StyleSliderControl';
import type { ImageLayer } from '../../types/mockup';

interface ImageLayerEditorProps {
  layer: ImageLayer;
  onUpdate: (updates: Partial<ImageLayer>) => void;
  onDelete: () => void;
}

export default function ImageLayerEditor({ layer, onUpdate, onDelete }: ImageLayerEditorProps) {
  const width = parseInt(layer.style.width) || 100;
  const opacity = parseFloat(layer.style.opacity) || 1;

  const updateStyle = (updates: Partial<ImageLayer['style']>) => {
    onUpdate({
      style: {
        ...layer.style,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Image className="h-4 w-4 inline-block mr-2" />
          Logo
        </label>
        <div className="relative aspect-video w-full max-w-sm bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={layer.url}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Size Control */}
      <StyleSliderControl
        label="Taille"
        value={width}
        onChange={(value) => updateStyle({ width: `${value}px` })}
        min={20}
        max={500}
        step={1}
        presets={[50, 100, 200, 300]}
      />

      {/* Opacity Control */}
      <StyleSliderControl
        label="Opacité"
        value={Math.round(opacity * 100)}
        onChange={(value) => updateStyle({ opacity: (value / 100).toString() })}
        min={0}
        max={100}
        step={1}
        presets={[25, 50, 75, 100]}
        unit="%"
      />

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </button>
    </div>
  );
}