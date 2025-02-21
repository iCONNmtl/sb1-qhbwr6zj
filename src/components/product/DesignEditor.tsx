import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Move, RotateCw, Maximize, ZoomIn, ZoomOut } from 'lucide-react';
import clsx from 'clsx';

interface Size {
  id: string;
  name: string;
  dimensions: {
    inches: string;
    cm: string;
  };
}

interface DesignEditorProps {
  designUrl: string;
  selectedSizes: Size[];
  onSave: (adjustments: Record<string, any>) => void;
  initialAdjustments?: Record<string, any>;
}

interface ImageSize {
  width: number;
  height: number;
}

interface Adjustment {
  scale: number;
  position: { x: number; y: number };
  rotation: number;
}

const BASE_PREVIEW_SIZE = 800;
const DEFAULT_ADJUSTMENT: Adjustment = {
  scale: 1,
  position: { x: 0, y: 0 },
  rotation: 0
};

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.01;

const SIZE_RATIOS: Record<string, number> = {
  '8x10': 8/10,
  '8x12': 8/12,
  '12x18': 12/18,
  '24x36': 24/36,
  '11x14': 11/14,
  '11x17': 11/17,
  '18x24': 18/24,
  'A4': 210/297,
  '5x7': 5/7,
  '20x28': 20/28,
  '28x40': 28/40
};

const SIMILAR_SIZES = {
  '8x12': ['12x18', '24x36'],
  '12x18': ['8x12', '24x36'],
  '24x36': ['8x12', '12x18'],
  'A4': ['5x7', '20x28', '28x40'],
  '5x7': ['A4', '20x28', '28x40'],
  '20x28': ['A4', '5x7', '28x40'],
  '28x40': ['A4', '5x7', '20x28']
};

export default function DesignEditor({
  designUrl,
  selectedSizes,
  onSave,
  initialAdjustments = {}
}: DesignEditorProps) {
  const [currentSize, setCurrentSize] = useState(selectedSizes[0]);
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [adjustments, setAdjustments] = useState<Record<string, Adjustment>>(() => {
    return selectedSizes.reduce((acc, size) => ({
      ...acc,
      [size.id]: initialAdjustments[size.id] || { ...DEFAULT_ADJUSTMENT }
    }), {});
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [zoomInput, setZoomInput] = useState('100');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const adjustmentsRef = useRef(adjustments);

  useEffect(() => {
    adjustmentsRef.current = adjustments;
  }, [adjustments]);

  const getPreviewDimensions = useCallback((size: Size) => {
    const ratio = SIZE_RATIOS[size.id];
    if (!ratio) return { width: BASE_PREVIEW_SIZE, height: BASE_PREVIEW_SIZE };

    const maxWidth = Math.min(BASE_PREVIEW_SIZE, window.innerWidth * 0.4);
    const baseSize = maxWidth;

    if (ratio >= 1) {
      return {
        width: baseSize,
        height: Math.round(baseSize / ratio)
      };
    } else {
      return {
        width: Math.round(baseSize * ratio),
        height: baseSize
      };
    }
  }, []);

  useEffect(() => {
    const dimensions = getPreviewDimensions(currentSize);
    setContainerSize(dimensions);
  }, [currentSize, getPreviewDimensions]);

  const autoFitDesign = useCallback(() => {
    if (!imageSize.width || !imageSize.height) return;

    const previewDimensions = getPreviewDimensions(currentSize);
    const imageRatio = imageSize.width / imageSize.height;
    const containerRatio = previewDimensions.width / previewDimensions.height;
    
    let scale;
    if (imageRatio > containerRatio) {
      scale = previewDimensions.width / imageSize.width;
    } else {
      scale = previewDimensions.height / imageSize.height;
    }
    
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;
    
    const x = (previewDimensions.width - scaledWidth) / 2;
    const y = (previewDimensions.height - scaledHeight) / 2;

    const newAdjustment = {
      scale,
      position: { x, y },
      rotation: 0
    };

    handleAdjustmentChange(newAdjustment);
    setZoomInput(Math.round(scale * 100).toString());
  }, [imageSize, currentSize, getPreviewDimensions]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = designUrl;
  }, [designUrl]);

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      if (!adjustments[currentSize.id]?.scale) {
        autoFitDesign();
      }
    }
  }, [imageSize, currentSize.id, autoFitDesign, adjustments]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSave(adjustmentsRef.current);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [adjustments, onSave]);

  const handleAdjustmentChange = (adjustment: Adjustment) => {
    const updatedAdjustments = { ...adjustments };
    
    const sizeGroup = Object.entries(SIMILAR_SIZES).find(([key, sizes]) => 
      key === currentSize.id || sizes.includes(currentSize.id)
    );

    if (sizeGroup) {
      const groupSizes = [sizeGroup[0], ...sizeGroup[1]];
      
      groupSizes.forEach(sizeId => {
        if (selectedSizes.some(size => size.id === sizeId)) {
          updatedAdjustments[sizeId] = { ...adjustment };
        }
      });
    } else {
      updatedAdjustments[currentSize.id] = adjustment;
    }

    setAdjustments(updatedAdjustments);
    onSave(updatedAdjustments);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(adjustments[currentSize.id].position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newPosition = {
      x: initialPosition.x + deltaX,
      y: initialPosition.y + deltaY
    };

    handleAdjustmentChange({
      ...adjustments[currentSize.id],
      position: newPosition
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    const newRotation = (adjustments[currentSize.id].rotation + 90) % 360;
    handleAdjustmentChange({
      ...adjustments[currentSize.id],
      rotation: newRotation
    });
  };

  const handleZoom = (delta: number) => {
    const currentAdjustment = adjustments[currentSize.id];
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentAdjustment.scale + delta));

    const previewDimensions = getPreviewDimensions(currentSize);
    const oldWidth = imageSize.width * currentAdjustment.scale;
    const oldHeight = imageSize.height * currentAdjustment.scale;
    const newWidth = imageSize.width * newScale;
    const newHeight = imageSize.height * newScale;

    const centerX = currentAdjustment.position.x + oldWidth / 2;
    const centerY = currentAdjustment.position.y + oldHeight / 2;

    handleAdjustmentChange({
      ...currentAdjustment,
      scale: newScale,
      position: {
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2
      }
    });

    setZoomInput(Math.round(newScale * 100).toString());
  };

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setZoomInput(value);

    if (value) {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, parseInt(value) / 100));
      handleZoom(newScale - adjustments[currentSize.id].scale);
    }
  };

  const previewDimensions = getPreviewDimensions(currentSize);
  const currentAdjustment = adjustments[currentSize.id] || DEFAULT_ADJUSTMENT;

  return (
    <div className="space-y-6">
      {selectedSizes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {selectedSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setCurrentSize(size)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                currentSize.id === size.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {size.name}
            </button>
          ))}
        </div>
      )}

      <div 
        ref={containerRef}
        className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto"
        style={{
          width: containerSize.width,
          height: containerSize.height
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute cursor-move"
          style={{
            transform: `translate(${currentAdjustment.position.x}px, ${currentAdjustment.position.y}px) rotate(${currentAdjustment.rotation}deg)`,
            width: imageSize.width * currentAdjustment.scale,
            height: imageSize.height * currentAdjustment.scale
          }}
          onMouseDown={handleMouseDown}
        >
          <img
            ref={imageRef}
            src={designUrl}
            alt="Design"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        </div>

        <div className="absolute inset-0 border-4 border-dashed border-indigo-500/50 pointer-events-none z-10" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Move className="h-8 w-8 text-indigo-500/50" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2">
          <button
            onClick={() => handleZoom(-SCALE_STEP)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Réduire"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <input
              type="text"
              value={zoomInput}
              onChange={handleZoomInputChange}
              className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="ml-1 text-sm text-gray-600">%</span>
          </div>
          <button
            onClick={() => handleZoom(SCALE_STEP)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Agrandir"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={handleRotate}
          className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <RotateCw className="h-5 w-5 mr-2" />
          Rotation 90°
        </button>

        <button
          onClick={autoFitDesign}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Maximize className="h-5 w-5 mr-2" />
          Automatique
        </button>
      </div>
    </div>
  );
}