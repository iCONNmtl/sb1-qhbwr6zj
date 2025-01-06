import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface PositionControlProps {
  position: { x: number; y: number };
  onChange: (position: { x: number; y: number }) => void;
}

export default function PositionControl({ position, onChange }: PositionControlProps) {
  const updatePosition = (axis: 'x' | 'y', delta: number) => {
    onChange({
      ...position,
      [axis]: Math.max(0, position[axis] + delta)
    });
  };

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">Position</h4>
      
      {/* Arrow Controls */}
      <div className="grid grid-cols-3 gap-2 w-fit mx-auto mb-4">
        <div />
        <button
          onClick={() => updatePosition('y', -1)}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <div />
        
        <button
          onClick={() => updatePosition('x', -1)}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="p-2 text-xs text-gray-500 text-center">
          1px
        </div>
        <button
          onClick={() => updatePosition('x', 1)}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        
        <div />
        <button
          onClick={() => updatePosition('y', 1)}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <div />
      </div>

      {/* Numeric Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">X</label>
          <input
            type="number"
            value={position.x}
            onChange={(e) => onChange({ ...position, x: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Y</label>
          <input
            type="number"
            value={position.y}
            onChange={(e) => onChange({ ...position, y: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}