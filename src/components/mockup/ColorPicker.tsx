import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import clsx from 'clsx';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
}

const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
];

export default function ColorPicker({ value, onChange, allowTransparent = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
      >
        <div className="flex items-center">
          <div 
            className={clsx(
              "w-6 h-6 rounded-full border border-gray-200 mr-2",
              value === 'transparent' && "bg-gray-200"
            )}
            style={{ backgroundColor: value !== 'transparent' ? value : undefined }}
          />
          <span className="text-gray-700">{value === 'transparent' ? 'Transparent' : value}</span>
        </div>
        <Palette className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Color Input */}
          <div className="mb-4">
            <input
              type="color"
              value={value === 'transparent' ? '#ffffff' : value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 p-1 rounded cursor-pointer"
            />
          </div>

          {/* Preset Colors */}
          <div className="grid grid-cols-4 gap-2">
            {allowTransparent && (
              <button
                onClick={() => {
                  onChange('transparent');
                  setIsOpen(false);
                }}
                className="w-full aspect-square rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors bg-gray-200"
              />
            )}
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className="w-full aspect-square rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}