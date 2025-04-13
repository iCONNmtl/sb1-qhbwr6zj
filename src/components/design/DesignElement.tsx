import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ArrowUp, ArrowDown, Copy, Trash2, Type, Square, Circle, Image as ImageIcon, Lock, Unlock, Move, Star, Hexagon, Triangle } from 'lucide-react';
import clsx from 'clsx';
import { DesignElement as DesignElementType } from '../../types/design';

interface DesignElementProps {
  element: DesignElementType;
  isSelected: boolean;
  onElementMouseDown: (e: React.MouseEvent, id: string) => void;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRotate: (rotation: number) => void;
  updateElement: (id: string, updates: Partial<DesignElementType>) => void;
  canvasWidth: number;
  canvasHeight: number;
  snapToGrid: boolean;
  gridSize: number;
}

const DesignElement: React.FC<DesignElementProps> = ({
  element,
  isSelected,
  onElementMouseDown,
  onSelect,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onRotate,
  updateElement,
  canvasWidth,
  canvasHeight,
  snapToGrid,
  gridSize
}) => {
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  if (!element.visible) return null;

  // Apply snap to grid
  const applySnapToGrid = (value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (element.locked) return;
    
    setResizing(handle);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: element.width, height: element.height });
    setInitialPos({ x: element.x, y: element.y });
  };

  // Handle resize move
  const handleResizeMove = (e: React.MouseEvent) => {
    if (!resizing) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;
    
    let newWidth = initialSize.width;
    let newHeight = initialSize.height;
    let newX = initialPos.x;
    let newY = initialPos.y;
    
    // Handle different resize handles
    switch (resizing) {
      case 'top-left':
        newWidth = initialSize.width - dx;
        newHeight = initialSize.height - dy;
        newX = initialPos.x + dx;
        newY = initialPos.y + dy;
        break;
      case 'top-right':
        newWidth = initialSize.width + dx;
        newHeight = initialSize.height - dy;
        newY = initialPos.y + dy;
        break;
      case 'bottom-left':
        newWidth = initialSize.width - dx;
        newHeight = initialSize.height + dy;
        newX = initialPos.x + dx;
        break;
      case 'bottom-right':
        newWidth = initialSize.width + dx;
        newHeight = initialSize.height + dy;
        break;
      case 'top':
        newHeight = initialSize.height - dy;
        newY = initialPos.y + dy;
        break;
      case 'right':
        newWidth = initialSize.width + dx;
        break;
      case 'bottom':
        newHeight = initialSize.height + dy;
        break;
      case 'left':
        newWidth = initialSize.width - dx;
        newX = initialPos.x + dx;
        break;
    }
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      newWidth = applySnapToGrid(newWidth);
      newHeight = applySnapToGrid(newHeight);
      newX = applySnapToGrid(newX);
      newY = applySnapToGrid(newY);
    }
    
    // Ensure minimum size
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);
    
    // Constrain to canvas boundaries
    if (newX < 0) {
      newWidth += newX;
      newX = 0;
    }
    if (newY < 0) {
      newHeight += newY;
      newY = 0;
    }
    if (newX + newWidth > canvasWidth) {
      newWidth = canvasWidth - newX;
    }
    if (newY + newHeight > canvasHeight) {
      newHeight = canvasHeight - newY;
    }
    
    // Update element
    updateElement(element.id, {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY
    });
  };

  // Handle resize end
  const handleResizeEnd = () => {
    setResizing(null);
  };

  // Add resize event listeners to document
  useEffect(() => {
    if (resizing) {
      const handleMouseMove = (e: MouseEvent) => {
        handleResizeMove(e as unknown as React.MouseEvent);
      };
      
      const handleMouseUp = () => {
        handleResizeEnd();
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing]);

  // Get element type icon
  const getElementTypeIcon = () => {
    if (element.type === 'text') return <Type className="h-4 w-4" />;
    if (element.type === 'shape') {
      if (element.shapeType === 'rectangle') return <Square className="h-4 w-4" />;
      if (element.shapeType === 'circle') return <Circle className="h-4 w-4" />;
      if (element.shapeType === 'triangle') return <Triangle className="h-4 w-4" />;
      if (element.shapeType === 'star') return <Star className="h-4 w-4" />;
      if (element.shapeType === 'hexagon') return <Hexagon className="h-4 w-4" />;
    }
    if (element.type === 'image') return <ImageIcon className="h-4 w-4" />;
    return null;
  };

  // Render shape element
  const renderShapeElement = () => {
    if (element.type !== 'shape') return null;
    
    switch (element.shapeType) {
      case 'rectangle':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.color,
              borderRadius: `${element.borderRadius || 0}px`,
              border: element.borderWidth > 0 ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
              opacity: element.opacity
            }}
          />
        );
      case 'circle':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.color,
              borderRadius: '50%',
              border: element.borderWidth > 0 ? `${element.borderWidth}px solid ${element.borderColor}` : 'none',
              opacity: element.opacity
            }}
          />
        );
      case 'triangle':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              opacity: element.opacity
            }}
          >
            <div
              style={{
                width: '0',
                height: '0',
                borderLeft: `${element.width / 2}px solid transparent`,
                borderRight: `${element.width / 2}px solid transparent`,
                borderBottom: `${element.height}px solid ${element.color}`,
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            {element.borderWidth > 0 && (
              <div
                style={{
                  width: '0',
                  height: '0',
                  borderLeft: `${element.width / 2}px solid transparent`,
                  borderRight: `${element.width / 2}px solid transparent`,
                  borderBottom: `${element.height}px solid ${element.borderColor}`,
                  position: 'absolute',
                  top: -element.borderWidth,
                  left: -element.borderWidth,
                  zIndex: -1
                }}
              />
            )}
          </div>
        );
      case 'star':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: element.opacity
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={element.color}
              stroke={element.borderWidth > 0 ? element.borderColor : 'none'}
              strokeWidth={element.borderWidth}
              width="100%"
              height="100%"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        );
      case 'hexagon':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: element.opacity
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={element.color}
              stroke={element.borderWidth > 0 ? element.borderColor : 'none'}
              strokeWidth={element.borderWidth}
              width="100%"
              height="100%"
            >
              <path d="M21 16.5v-9l-9-6-9 6v9l9 6 9-6z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      className={clsx(
        "absolute",
        isSelected && !element.locked && "outline outline-2 outline-indigo-500 outline-offset-2",
        element.locked && "cursor-not-allowed",
        !element.locked && !resizing && "cursor-move"
      )}
      style={{ 
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!element.locked) {
          onSelect();
        }
      }}
      onMouseDown={(e) => !element.locked && !resizing && onElementMouseDown(e, element.id)}
    >
      {/* Render based on element type */}
      {element.type === 'text' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            fontFamily: element.fontFamily,
            fontSize: `${element.fontSize}px`,
            color: element.color,
            fontWeight: element.fontWeight,
            fontStyle: element.fontStyle,
            textAlign: element.textAlign,
            textDecoration: element.textDecoration,
            backgroundColor: element.backgroundColor,
            padding: `${element.padding}px`,
            borderRadius: `${element.borderRadius}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: element.textAlign === 'center' ? 'center' : 
                          element.textAlign === 'right' ? 'flex-end' : 'flex-start',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}
        >
          {element.content}
        </div>
      )}
      
      {element.type === 'shape' && renderShapeElement()}
      
      {element.type === 'image' && (
        <img
          src={element.src}
          alt="Element"
          style={{
            width: '100%',
            height: '100%',
            objectFit: element.objectFit,
            opacity: element.opacity
          }}
          draggable={false}
        />
      )}
      
      {/* Element type indicator */}
      {isSelected && !element.locked && (
        <div className="absolute -top-8 -left-2 bg-white rounded-lg shadow-sm border border-gray-200 px-2 py-1 text-xs text-gray-600 flex items-center z-20">
          {getElementTypeIcon()}
          <span className="ml-1">{element.name}</span>
        </div>
      )}
      
      {/* Element controls when selected */}
      {isSelected && !element.locked && (
        <div className="absolute -top-10 left-0 flex items-center space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotate((element.rotation + 15) % 360);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            title="Rotation"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            title="Déplacer vers l'avant"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            title="Déplacer vers l'arrière"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            title="Dupliquer"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Lock indicator */}
      {element.locked && (
        <div className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
          <Lock className="h-3 w-3 text-gray-600" />
        </div>
      )}
      
      {/* Resize handles */}
      {isSelected && !element.locked && (
        <>
          {/* Corner handles */}
          <div 
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nwse-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div 
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nesw-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div 
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nesw-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div 
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nwse-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
          
          {/* Edge handles */}
          <div 
            className="absolute top-1/2 -left-1.5 w-3 h-3 -translate-y-1/2 bg-white border border-indigo-500 rounded-full cursor-ew-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div 
            className="absolute top-1/2 -right-1.5 w-3 h-3 -translate-y-1/2 bg-white border border-indigo-500 rounded-full cursor-ew-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
          <div 
            className="absolute -top-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-white border border-indigo-500 rounded-full cursor-ns-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
          <div 
            className="absolute -bottom-1.5 left-1/2 w-3 h-3 -translate-x-1/2 bg-white border border-indigo-500 rounded-full cursor-ns-resize z-20"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
        </>
      )}
      
      {/* Dimensions display when selected */}
      {isSelected && !element.locked && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-sm border border-gray-200 px-2 py-1 text-xs text-gray-600 flex items-center z-20">
          <span className="font-mono">{Math.round(element.width)} × {Math.round(element.height)}px</span>
        </div>
      )}
    </div>
  );
};

export default DesignElement;