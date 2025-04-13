import React, { useRef, useEffect, useState } from 'react';
import DesignElement from './DesignElement';
import { DesignState } from '../../types/design';
import clsx from 'clsx';

interface CanvasProps {
  state: DesignState;
  setState: React.Dispatch<React.SetStateAction<DesignState>>;
  handleElementMouseDown: (e: React.MouseEvent, id: string) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  duplicateSelectedElement: () => void;
  deleteSelectedElement: () => void;
  moveElementUp: () => void;
  moveElementDown: () => void;
  updateElement: (id: string, updates: any) => void;
  snapToGrid: boolean;
  gridSize: number;
}

const Canvas: React.FC<CanvasProps> = ({
  state,
  setState,
  handleElementMouseDown,
  handleMouseMove,
  handleMouseUp,
  duplicateSelectedElement,
  deleteSelectedElement,
  moveElementUp,
  moveElementDown,
  updateElement,
  snapToGrid,
  gridSize
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Fixed height for the preview container
  const PREVIEW_CONTAINER_HEIGHT = 900;

  // Calculate the scale to fit the canvas within the fixed height container
  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      // Calculate scale based on fixed height
      const scaleY = PREVIEW_CONTAINER_HEIGHT / state.canvasHeight;
      setScale(scaleY);
    }
  }, [state.canvasWidth, state.canvasHeight]);

  // Get current size info
  const getCurrentSizeInfo = () => {
    const size = state.availableSizes.find(s => s.id === state.currentSize);
    if (!size) return null;
    
    return {
      name: size.name,
      dimensions: size.dimensions,
      recommendedSize: size.recommendedSize
    };
  };

  const currentSizeInfo = getCurrentSizeInfo();

  // Constrain elements within canvas boundaries
  const constrainElementsWithinCanvas = () => {
    state.elements.forEach(element => {
      let needsUpdate = false;
      let updates: any = {};
      
      // Check if element is outside canvas boundaries
      if (element.x < 0) {
        updates.x = 0;
        needsUpdate = true;
      }
      if (element.y < 0) {
        updates.y = 0;
        needsUpdate = true;
      }
      if (element.x + element.width > state.canvasWidth) {
        updates.x = state.canvasWidth - element.width;
        needsUpdate = true;
      }
      if (element.y + element.height > state.canvasHeight) {
        updates.y = state.canvasHeight - element.height;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        updateElement(element.id, updates);
      }
    });
  };

  // Apply constraints when elements or canvas dimensions change
  useEffect(() => {
    constrainElementsWithinCanvas();
  }, [state.elements, state.canvasWidth, state.canvasHeight]);

  return (
    <div className="flex flex-col h-full">
      {/* Size info */}
      {currentSizeInfo && (
        <div className="mb-2 flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Format:</span> {currentSizeInfo.name} ({currentSizeInfo.dimensions.cm})
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Taille recommandée:</span> {currentSizeInfo.recommendedSize.width}×{currentSizeInfo.recommendedSize.height}px
          </div>
        </div>
      )}
      
      {/* Preview container with fixed height */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg relative"
        style={{ 
          height: PREVIEW_CONTAINER_HEIGHT,
          maxHeight: PREVIEW_CONTAINER_HEIGHT
        }}
      >
        {/* Grille d'arrière-plan */}
        <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))]">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-gray-300/20"></div>
          ))}
        </div>
        
        {/* Grille magnétique en superposition */}
        {snapToGrid && (
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(79, 70, 229, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 1px, transparent 1px)`,
              backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`
            }}
          />
        )}
        
        {/* Canvas avec ratio d'aspect correct */}
        <div 
          ref={canvasRef}
          className="relative shadow-xl transform origin-center transition-transform duration-200"
          style={{ 
            width: state.canvasWidth, 
            height: state.canvasHeight,
            backgroundColor: state.backgroundColor,
            transform: `scale(${scale})`,
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => setState(prev => ({ ...prev, selectedElementId: null }))}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background Image */}
          {state.backgroundImage && (
            <img 
              src={state.backgroundImage} 
              alt="Background" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          )}
          
          {/* Design Elements */}
          {state.elements.map(element => (
            <DesignElement
              key={element.id}
              element={element}
              isSelected={element.id === state.selectedElementId}
              onElementMouseDown={handleElementMouseDown}
              onSelect={() => setState(prev => ({ ...prev, selectedElementId: element.id }))}
              onDuplicate={duplicateSelectedElement}
              onDelete={deleteSelectedElement}
              onMoveUp={moveElementUp}
              onMoveDown={moveElementDown}
              onRotate={(rotation) => updateElement(element.id, { rotation })}
              updateElement={updateElement}
              canvasWidth={state.canvasWidth}
              canvasHeight={state.canvasHeight}
              snapToGrid={snapToGrid}
              gridSize={gridSize}
            />
          ))}
        </div>
        
        {/* Dimensions du canvas */}
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-600 font-mono">
          {state.canvasWidth} × {state.canvasHeight}px
        </div>
      </div>
    </div>
  );
};

export default Canvas;