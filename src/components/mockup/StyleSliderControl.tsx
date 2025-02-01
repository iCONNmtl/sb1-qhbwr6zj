import React from 'react';
import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';

interface StyleSliderControlProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  presets?: number[];
  label: string;
  unit?: string;
}

export default function StyleSliderControl({
  value,
  onChange,
  min,
  max,
  step = 1,
  presets = [],
  label,
  unit = 'px'
}: StyleSliderControlProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-4">
          {/* Contrôles à gauche */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                disabled={value <= min}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[2ch] text-center">
                {value}
              </span>
              <button
                onClick={handleIncrement}
                disabled={value >= max}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>

            {presets.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onChange(preset)}
                    className={clsx(
                      'px-2 py-0.5 text-xs font-medium rounded-md transition-all duration-200',
                      value === preset
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {preset}{unit}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Slider à droite */}
          <div className="flex-1">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}