import React from 'react';
import { Trash2, Type, Palette, Square } from 'lucide-react';
import FontSelector from './FontSelector';
import FontSizeControl from './FontSizeControl';
import ColorPicker from './ColorPicker';
import StyleSliderControl from './StyleSliderControl';
import type { TextStyle } from '../../types/mockup';

interface TextLayerEditorProps {
  layer: {
    id: string;
    text: string;
    style: TextStyle;
  };
  onUpdate: (updates: { text?: string; style?: Partial<TextStyle> }) => void;
  onDelete: () => void;
}

const PADDING_PRESETS = [0, 8, 16, 24, 32];
const BORDER_RADIUS_PRESETS = [0, 4, 8, 16, 24];

export default function TextLayerEditor({ layer, onUpdate, onDelete }: TextLayerEditorProps) {
  // Parse numeric values with fallbacks
  const fontSize = parseInt(layer.style.fontSize) || 24;
  const padding = parseInt(layer.style.padding || '0') || 0;
  const borderRadius = parseInt(layer.style.borderRadius || '0') || 0;

  // Helper to update style while preserving other properties
  const updateStyle = (updates: Partial<TextStyle>) => {
    onUpdate({
      style: {
        ...layer.style,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Type className="h-4 w-4 inline-block mr-2" />
          Texte
        </label>
        <textarea
          value={layer.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={2}
        />
      </div>

      {/* Font Controls */}
      <FontSelector
        value={layer.style.fontFamily}
        onChange={(font) => updateStyle({ fontFamily: font })}
      />

      {/* Font Size */}
      <FontSizeControl
        value={fontSize}
        onChange={(size) => updateStyle({ fontSize: `${size}px` })}
      />

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Palette className="h-4 w-4 inline-block mr-2" />
          Couleur du texte
        </label>
        <ColorPicker
          value={layer.style.color}
          onChange={(color) => updateStyle({ color })}
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Square className="h-4 w-4 inline-block mr-2" />
          Couleur de fond
        </label>
        <ColorPicker
          value={layer.style.backgroundColor || 'transparent'}
          onChange={(color) => updateStyle({ backgroundColor: color })}
          allowTransparent
        />
      </div>

      {/* Padding */}
      <StyleSliderControl
        label="Espacement interne"
        value={padding}
        onChange={(value) => updateStyle({ padding: `${value}px` })}
        min={0}
        max={50}
        step={1}
        presets={PADDING_PRESETS}
      />

      {/* Border Radius */}
      <StyleSliderControl
        label="Arrondi des coins"
        value={borderRadius}
        onChange={(value) => updateStyle({ borderRadius: `${value}px` })}
        min={0}
        max={50}
        step={1}
        presets={BORDER_RADIUS_PRESETS}
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