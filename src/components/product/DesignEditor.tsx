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

// Dimensions de base pour la prévisualisation
const BASE_PREVIEW_SIZE = 800;

// Ajustement par défaut
const DEFAULT_ADJUSTMENT: Adjustment = {
  scale: 1,
  position: { x: 0, y: 0 },
  rotation: 0
};

// Constantes pour le zoom
const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.01; // Changé de 0.1 à 0.01 pour plus de précision

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

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const adjustmentsRef = useRef(adjustments);

  // Mettre à jour la ref quand les ajustements changent
  useEffect(() => {
    adjustmentsRef.current = adjustments;
  }, [adjustments]);

  // Calculer les dimensions de prévisualisation (mémorisé)
  const getPreviewDimensions = useCallback((size: Size) => {
    const [width, height] = size.dimensions.inches.split('x').map(Number);
    const aspectRatio = width / height;

    return {
      width: aspectRatio >= 1 ? BASE_PREVIEW_SIZE : BASE_PREVIEW_SIZE * aspectRatio,
      height: aspectRatio >= 1 ? BASE_PREVIEW_SIZE / aspectRatio : BASE_PREVIEW_SIZE
    };
  }, []);

  // Ajuster automatiquement le design (mémorisé)
  const autoFitDesign = useCallback(() => {
    if (!imageSize.width || !imageSize.height) return;

    const previewDimensions = getPreviewDimensions(currentSize);
    
    const imageRatio = imageSize.width / imageSize.height;
    const targetRatio = previewDimensions.width / previewDimensions.height;
    
    let scale;
    if (imageRatio > targetRatio) {
      // Ajusté pour remplir exactement la largeur
      scale = previewDimensions.width / imageSize.width;
    } else {
      // Ajusté pour remplir exactement la hauteur
      scale = previewDimensions.height / imageSize.height;
    }
    
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;
    
    const x = (previewDimensions.width - scaledWidth) / 2;
    const y = (previewDimensions.height - scaledHeight) / 2;

    setAdjustments(prev => ({
      ...prev,
      [currentSize.id]: {
        scale,
        position: { x, y },
        rotation: 0
      }
    }));

    setZoomInput(Math.round(scale * 100).toString());
  }, [imageSize, currentSize, getPreviewDimensions]);

  // Mettre à jour les ajustements quand les tailles changent
  useEffect(() => {
    setAdjustments(prev => {
      const newAdjustments = { ...prev };
      selectedSizes.forEach(size => {
        if (!newAdjustments[size.id]) {
          newAdjustments[size.id] = { ...DEFAULT_ADJUSTMENT };
        }
      });
      return newAdjustments;
    });
  }, [selectedSizes]);

  // Charger les dimensions de l'image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = designUrl;
  }, [designUrl]);

  // Sauvegarder les ajustements (avec debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSave(adjustmentsRef.current);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [adjustments, onSave]);

  // Appliquer l'ajustement automatique initial
  useEffect(() => {
    if (imageSize.width && imageSize.height && !adjustments[currentSize.id]?.scale) {
      autoFitDesign();
    }
  }, [imageSize, currentSize.id, autoFitDesign, adjustments]);

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

    setAdjustments(prev => ({
      ...prev,
      [currentSize.id]: {
        ...prev[currentSize.id],
        position: {
          x: initialPosition.x + deltaX,
          y: initialPosition.y + deltaY
        }
      }
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setAdjustments(prev => ({
      ...prev,
      [currentSize.id]: {
        ...prev[currentSize.id],
        rotation: (prev[currentSize.id].rotation + 90) % 360
      }
    }));
  };

  const handleZoom = (delta: number) => {
    setAdjustments(prev => {
      const currentAdjustment = prev[currentSize.id];
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentAdjustment.scale + delta));
      
      // Ajuster la position pour zoomer depuis le centre
      const previewDimensions = getPreviewDimensions(currentSize);
      const oldWidth = imageSize.width * currentAdjustment.scale;
      const oldHeight = imageSize.height * currentAdjustment.scale;
      const newWidth = imageSize.width * newScale;
      const newHeight = imageSize.height * newScale;
      
      const centerX = currentAdjustment.position.x + oldWidth / 2;
      const centerY = currentAdjustment.position.y + oldHeight / 2;

      setZoomInput(Math.round(newScale * 100).toString());
      
      return {
        ...prev,
        [currentSize.id]: {
          ...currentAdjustment,
          scale: newScale,
          position: {
            x: centerX - newWidth / 2,
            y: centerY - newHeight / 2
          }
        }
      };
    });
  };

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setZoomInput(value);

    if (value) {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, parseInt(value) / 100));
      const currentAdjustment = adjustments[currentSize.id];
      
      // Ajuster la position pour zoomer depuis le centre
      const previewDimensions = getPreviewDimensions(currentSize);
      const oldWidth = imageSize.width * currentAdjustment.scale;
      const oldHeight = imageSize.height * currentAdjustment.scale;
      const newWidth = imageSize.width * newScale;
      const newHeight = imageSize.height * newScale;
      
      const centerX = currentAdjustment.position.x + oldWidth / 2;
      const centerY = currentAdjustment.position.y + oldHeight / 2;
      
      setAdjustments(prev => ({
        ...prev,
        [currentSize.id]: {
          ...currentAdjustment,
          scale: newScale,
          position: {
            x: centerX - newWidth / 2,
            y: centerY - newHeight / 2
          }
        }
      }));
    }
  };

  const previewDimensions = getPreviewDimensions(currentSize);
  const currentAdjustment = adjustments[currentSize.id] || DEFAULT_ADJUSTMENT;

  return (
    <div className="space-y-6">
      {/* Sélecteur de taille */}
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

      {/* Zone de prévisualisation */}
      <div 
        ref={containerRef}
        className="relative bg-gray-100 rounded-lg overflow-hidden"
        style={{
          width: previewDimensions.width,
          height: previewDimensions.height
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Design */}
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

        {/* Zone de point-tillés (par dessus le design) */}
        <div className="absolute inset-0 border-4 border-dashed border-indigo-500/50 pointer-events-none z-10" />

        {/* Indicateur de déplacement */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Move className="h-8 w-8 text-indigo-500/50" />
        </div>
      </div>

      {/* Contrôles */}
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