import React, { useState, useRef, useEffect } from 'react';
import { Image, Instagram, ArrowDown, Move, Layout } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import MockupPreviewSlider from './MockupPreviewSlider';
import { PREVIEW_DIMENSIONS, GRID_DIMENSIONS, calculateImagePosition } from '../../utils/scaling';
import type { TextLayer, ImageLayer } from '../../types/mockup';
import type { PreviewFormat } from './PreviewFormatSelector';
import type { Mockup } from '../../types/mockup';

interface TextPreviewProps {
  mockups: Mockup[];
  layers: (TextLayer | ImageLayer)[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onUpdatePosition: (id: string, updates: Partial<{ position: { x: number; y: number } }>) => void;
  format: PreviewFormat;
  onFormatChange: (format: PreviewFormat) => void;
  cropPosition: { x: number; y: number };
  onCropPositionChange: (position: { x: number; y: number }) => void;
  cropSize: { width: number; height: number };
  onCropSizeChange: (size: { width: number; height: number }) => void;
  onGridConfigChange: (config: { width: number; marginLeft: number }) => void;
  onPreviewWidthChange: (width: number) => void;
}

const FORMATS = [
  {
    id: 'original' as const,
    name: 'Original',
    icon: Layout,
    description: 'Format original du mockup',
    aspectRatio: 1
  },
  {
    id: 'instagram' as const,
    name: 'Instagram',
    icon: Instagram,
    description: 'Format optimal pour Instagram',
    aspectRatio: 4/5,
    dimensions: '1080×1350px'
  },
  {
    id: 'pinterest' as const,
    name: 'Pinterest',
    icon: Instagram,
    description: 'Format optimal pour Pinterest',
    aspectRatio: 2/3,
    dimensions: '1000×1500px'
  }
];

export default function TextPreview({
  mockups,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdatePosition,
  format,
  onFormatChange,
  cropPosition,
  onCropPositionChange,
  cropSize,
  onCropSizeChange,
  onGridConfigChange,
  onPreviewWidthChange
}: TextPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [dragType, setDragType] = useState<'layer' | 'crop' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const currentMockup = mockups[currentMockupIndex];

  const getValidOpacity = (value: string | undefined): number => {
    const parsed = parseFloat(value || '1');
    return isNaN(parsed) ? 1 : Math.max(0, Math.min(1, parsed));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = Math.min(container.clientWidth, PREVIEW_DIMENSIONS.width);
      setContainerSize({ width, height: width });
      setScale(width / PREVIEW_DIMENSIONS.width);
      onPreviewWidthChange(width);

      const gridWidth = width * 0.8;
      const marginLeft = (width - gridWidth) / 2;
      onGridConfigChange({ width: gridWidth, marginLeft });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [onGridConfigChange, onPreviewWidthChange]);

  useEffect(() => {
    if (format === 'original') return;
    
    const cropWidth = getCropWidth();
    const cropHeight = getCropHeight();
    
    onCropPositionChange({
      x: (containerSize.width - cropWidth) / 2,
      y: 0
    });
    
    onCropSizeChange({
      width: cropWidth,
      height: cropHeight
    });
  }, [format, containerSize, onCropPositionChange, onCropSizeChange]);

  const getCropWidth = () => {
    if (format === 'original') return containerSize.width;
    const gridDimensions = GRID_DIMENSIONS[format as 'instagram' | 'pinterest'];
    return containerSize.height * gridDimensions.aspectRatio;
  };

  const getCropHeight = () => {
    if (format === 'original') return containerSize.height;
    return containerSize.height;
  };

  const handleCropMouseDown = (e: React.MouseEvent) => {
    if (dragType === 'layer') return;

    e.preventDefault();
    e.stopPropagation();
    
    setDragType('crop');
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(cropPosition);
  };

  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    onSelectLayer(layerId);
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    setIsDragging(true);
    setDragType('layer');
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(layer.position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragType || !containerRef.current) return;

    if (dragType === 'layer' && isDragging && selectedLayerId) {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;

      const newPosition = {
        x: Math.max(0, initialPosition.x + deltaX),
        y: Math.max(0, initialPosition.y + deltaY)
      };

      onUpdatePosition(selectedLayerId, { position: newPosition });
    } else if (dragType === 'crop') {
      const deltaX = e.clientX - dragStart.x;
      const maxX = containerSize.width - getCropWidth();
      
      const newX = Math.max(0, Math.min(
        initialPosition.x + deltaX,
        maxX
      ));

      onCropPositionChange({ 
        x: newX,
        y: 0
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Prévisualisation
        </h3>
        <p className="text-sm text-gray-500">
          Choisissez le format d'export pour vos réseaux sociaux
        </p>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          {FORMATS.map((f) => {
            const Icon = f.icon;
            const isSelected = format === f.id;
            
            return (
              <button
                key={f.id}
                onClick={() => onFormatChange(f.id)}
                className={clsx(
                  'relative flex flex-col items-center p-4 rounded-xl transition-all duration-200',
                  'hover:bg-white hover:shadow-sm',
                  isSelected ? 'bg-white ring-2 ring-indigo-600 shadow-sm' : 'bg-transparent'
                )}
              >
                <div className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                  isSelected ? 'bg-indigo-600' : 'bg-gray-100'
                )}>
                  <Icon className={clsx(
                    'h-6 w-6',
                    isSelected ? 'text-white' : 'text-gray-600'
                  )} />
                </div>
                
                <div className="text-center">
                  <div className={clsx(
                    'font-medium mb-1',
                    isSelected ? 'text-indigo-600' : 'text-gray-900'
                  )}>
                    {f.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {f.dimensions || 'Taille d\'origine'}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <div 
          ref={containerRef}
          className="relative w-full aspect-square rounded-lg overflow-hidden" 
          style={{ 
            maxWidth: `${PREVIEW_DIMENSIONS.width}px`,
            maxHeight: `${PREVIEW_DIMENSIONS.height}px`
          }}
          onClick={() => onSelectLayer('')}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {currentMockup?.previewUrl ? (
            <div className="relative w-full h-full">
              <ImageLoader
                src={currentMockup.previewUrl}
                alt={currentMockup.name}
                className="w-full h-full object-contain"
              />
              
              {format !== 'original' && (
                <div 
                  className={clsx(
                    'absolute cursor-move select-none',
                    format === 'instagram' ? 'ring-2 ring-fuchsia-500/50' : 'ring-2 ring-red-500/50'
                  )}
                  style={{
                    left: `${cropPosition.x}px`,
                    top: `${cropPosition.y}px`,
                    width: `${cropSize.width}px`,
                    height: `${cropSize.height}px`,
                    border: '2px dashed white',
                    zIndex: 10
                  }}
                  onMouseDown={handleCropMouseDown}
                >
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Move className="h-6 w-6 text-white opacity-60" />
                  </div>
                </div>
              )}

              {layers.map(layer => {
                if (layer.type === 'text') {
                  const fontSize = parseInt(layer.style.fontSize) || 24;
                  return (
                    <div
                      key={layer.id}
                      className={clsx(
                        'absolute cursor-move',
                        selectedLayerId === layer.id && 'outline outline-2 outline-indigo-500 outline-offset-2'
                      )}
                      style={{
                        ...layer.style,
                        fontSize: `${fontSize * scale}px`,
                        transform: `translate(${layer.position.x * scale}px, ${layer.position.y * scale}px)`,
                        userSelect: 'none',
                        left: 0,
                        top: 0,
                        zIndex: 20
                      }}
                      onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                    >
                      {layer.text}
                    </div>
                  );
                } else {
                  const width = parseInt(layer.style.width) || 100;
                  const opacity = getValidOpacity(layer.style.opacity);
                  return (
                    <div
                      key={layer.id}
                      className={clsx(
                        'absolute cursor-move',
                        selectedLayerId === layer.id && 'outline outline-2 outline-indigo-500 outline-offset-2'
                      )}
                      style={{
                        transform: `translate(${layer.position.x * scale}px, ${layer.position.y * scale}px)`,
                        width: `${width * scale}px`,
                        opacity,
                        userSelect: 'none',
                        left: 0,
                        top: 0,
                        zIndex: 20
                      }}
                      onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                    >
                      <img
                        src={layer.url}
                        alt="Logo"
                        className="w-full h-auto object-contain"
                        draggable={false}
                      />
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Sélectionnez un mockup pour voir la prévisualisation
                </p>
              </div>
            </div>
          )}
        </div>

        {mockups.length > 1 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <MockupPreviewSlider
              mockups={mockups}
              currentIndex={currentMockupIndex}
              onIndexChange={setCurrentMockupIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
}