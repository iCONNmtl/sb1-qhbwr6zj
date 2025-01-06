import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';
import clsx from 'clsx';
import type { TextStyle } from '../../types/mockup';

interface TextLayerProps {
  layer: {
    id: string;
    text: string;
    style: TextStyle;
    position: { x: number; y: number };
  };
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<typeof layer>) => void;
}

export default function TextLayer({ layer, isSelected, onSelect, onChange }: TextLayerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Place cursor at end of text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    onSelect();
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange({ text: e.currentTarget.textContent || '' });
  };

  return (
    <div 
      className={clsx(
        'absolute group cursor-move',
        isSelected && 'outline outline-2 outline-indigo-500 outline-offset-2'
      )}
      style={{
        left: `${layer.position.x}px`,
        top: `${layer.position.y}px`
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag Handle */}
      <div className={clsx(
        'absolute -left-2 -top-2 p-1 rounded-full bg-white shadow-sm transition-opacity',
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}>
        <Move className="h-4 w-4 text-gray-600" />
      </div>

      {/* Text Content */}
      <div
        ref={textRef}
        contentEditable={isEditing}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onInput={handleInput}
        style={layer.style}
        className="min-w-[100px] min-h-[24px] outline-none whitespace-pre-wrap"
        suppressContentEditableWarning
      >
        {layer.text}
      </div>
    </div>
  );
}