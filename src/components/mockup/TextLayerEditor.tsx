import React from 'react';
import { Trash2, Type, Palette, Square, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import FontSelector from './FontSelector';
import FontSizeControl from './FontSizeControl';
import ColorPicker from './ColorPicker';
import StyleSliderControl from './StyleSliderControl';
import clsx from 'clsx';
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
  const fontSize = parseInt(layer.style.fontSize) || 24;
  const padding = parseInt(layer.style.padding || '0') || 0;
  const borderRadius = parseInt(layer.style.borderRadius || '0') || 0;

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

      {/* Text Style Controls */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style de texte
        </label>
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => updateStyle({ fontWeight: layer.style.fontWeight === 'bold' ? 'normal' : 'bold' })}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              layer.style.fontWeight === 'bold' 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'hover:bg-gray-100 text-gray-600'
            )}
            title="Gras"
          >
            <Bold className="h-5 w-5" />
          </button>
          <button
            onClick={() => updateStyle({ fontStyle: layer.style.fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              layer.style.fontStyle === 'italic'
                ? 'bg-indigo-100 text-indigo-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
            title="Italique"
          >
            <Italic className="h-5 w-5" />
          </button>
          <div className="h-6 border-l border-gray-200 mx-2" />
          <button
            onClick={() => updateStyle({ textAlign: 'left' })}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              layer.style.textAlign === 'left'
                ? 'bg-indigo-100 text-indigo-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
            title="Aligner à gauche"
          >
            <AlignLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => updateStyle({ textAlign: 'center' })}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              layer.style.textAlign === 'center'
                ? 'bg-indigo-100 text-indigo-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
            title="Centrer"
          >
            <AlignCenter className="h-5 w-5" />
          </button>
          <button
            onClick={() => updateStyle({ textAlign: 'right' })}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              layer.style.textAlign === 'right'
                ? 'bg-indigo-100 text-indigo-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
            title="Aligner à droite"
          >
            <AlignRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Font Controls */}
      <div className="space-y-4">
        <FontSelector
          value={layer.style.fontFamily}
          onChange={(font) => updateStyle({ fontFamily: font })}
        />

        <FontSizeControl
          value={fontSize}
          onChange={(size) => updateStyle({ fontSize: `${size}px` })}
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Spacing & Borders */}
      <div className="space-y-4">
        <StyleSliderControl
          label="Espacement interne"
          value={padding}
          onChange={(value) => updateStyle({ padding: `${value}px` })}
          min={0}
          max={50}
          step={1}
          presets={PADDING_PRESETS}
        />

        <StyleSliderControl
          label="Arrondi des coins"
          value={borderRadius}
          onChange={(value) => updateStyle({ borderRadius: `${value}px` })}
          min={0}
          max={50}
          step={1}
          presets={BORDER_RADIUS_PRESETS}
        />
      </div>

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