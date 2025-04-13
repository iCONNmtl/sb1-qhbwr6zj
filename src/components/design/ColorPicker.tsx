import React from 'react';
import { Palette } from 'lucide-react';
import clsx from 'clsx';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  colorPresets: string[];
  allowTransparent?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  showPicker,
  setShowPicker,
  colorPresets,
  allowTransparent = false
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg"
      >
        <div className="flex items-center">
          <div 
            className={clsx(
              "w-6 h-6 rounded-md border border-gray-200 mr-2",
              color === 'transparent' && "bg-gray-200"
            )}
            style={{ 
              backgroundColor: color !== 'transparent' ? color : undefined,
              backgroundImage: color === 'transparent' 
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                : 'none',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
            }}
          />
          <span>{color === 'transparent' ? 'Transparent' : color}</span>
        </div>
        <Palette className="h-5 w-5 text-gray-400" />
      </button>
      
      {showPicker && (
        <div className="absolute z-10 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {colorPresets.map(presetColor => (
              <button
                key={presetColor}
                onClick={() => {
                  onChange(presetColor);
                  setShowPicker(false);
                }}
                className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: presetColor,
                  backgroundImage: presetColor === 'transparent' 
                    ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                    : 'none',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                }}
                title={presetColor === 'transparent' ? 'Transparent' : presetColor}
              />
            ))}
          </div>
          {color !== 'transparent' && (
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;