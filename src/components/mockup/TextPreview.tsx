import React, { useState, useRef, useEffect } from 'react';
import { Image, Instagram, ArrowDown, Move, Layout } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import MockupPreviewSlider from './MockupPreviewSlider';
import type { TextStyle } from '../../types/mockup';
import type { PreviewFormat } from './PreviewFormatSelector';
import type { Mockup } from '../../types/mockup';

const MAX_HEIGHT = 600;

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

interface TextPreviewProps {
  mockups: Mockup[];
  textLayers: Array<{
    id: string;
    text: string;
    style: TextStyle;
    position: { x: number; y: number };
  }>;
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
}

export default function TextPreview({
  mockups,
  textLayers,
  selectedLayerId,
  onSelectLayer,
  onUpdatePosition,
  format,
  onFormatChange,
  cropPosition,
  onCropPositionChange,
  cropSize,
  onCropSizeChange,
  onGridConfigChange
}: TextPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [dragType, setDragType] = useState<'text' | 'crop' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const currentMockup = mockups[currentMockupIndex];
  const selectedFormat = FORMATS.find(f => f.id === format);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = Math.min(width, MAX_HEIGHT);
      setContainerSize({ width, height });
      setScale(width / 1000);

      // Update grid config
      const gridWidth = width * 0.8; // 80% de la largeur
      const marginLeft = (width - gridWidth) / 2;
      onGridConfigChange({ width: gridWidth, marginLeft });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [onGridConfigChange]);

  // Reset crop position when format changes
  useEffect(() => {
    if (format === 'original') return;
    
    const cropWidth = getCropWidth();
    const cropHeight = getCropHeight();
    
    onCropPositionChange({
      x: (containerSize.width - cropWidth) / 2,
      y: (containerSize.height - cropHeight) / 2
    });
    
    onCropSizeChange({
      width: cropWidth,
      height: cropHeight
    });
  }, [format, containerSize, onCropPositionChange, onCropSizeChange]);

  const getCropWidth = () => {
    if (!selectedFormat || format === 'original') return containerSize.width;
    return containerSize.height * selectedFormat.aspectRatio;
  };

  const getCropHeight = () => {
    if (!selectedFormat || format === 'original') return containerSize.height;
    return containerSize.height;
  };

  const handleTextMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onSelectLayer(layerId);
    
    const layer = textLayers.find(l => l.id === layerId);
    if (!layer) return;

    setDragType('text');
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(layer.position);
  };

  const handleCropMouseDown = (e: React.MouseEvent) => {
    if (dragType === 'text') return;

    e.preventDefault();
    e.stopPropagation();
    
    setDragType('crop');
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(cropPosition);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragType || !containerRef.current) return;

    if (dragType === 'text' && selectedLayerId) {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;

      const newPosition = {
        x: Math.max(0, initialPosition.x + deltaX),
        y: Math.max(0, initialPosition.y + deltaY)
      };

      onUpdatePosition(selectedLayerId, { position: newPosition });
    } else if (dragType === 'crop') {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = Math.max(0, Math.min(
        initialPosition.x + deltaX,
        containerSize.width - getCropWidth()
      ));
      const newY = Math.max(0, Math.min(
        initialPosition.y + deltaY,
        containerSize.height - getCropHeight()
      ));

      onCropPositionChange({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDragType(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* En-tête avec titre et description */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Prévisualisation
        </h3>
        <p className="text-sm text-gray-500">
          Choisissez le format d'export pour vos réseaux sociaux
        </p>
      </div>

      {/* Sélecteur de format */}
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

                {/* Indicateur de sélection */}
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

      {/* Zone de prévisualisation */}
      <div className="p-6">
        <div 
          ref={containerRef}
          className="relative rounded-lg overflow-hidden bg-gray-100" 
          style={{ 
            height: `${containerSize.height}px`,
            maxHeight: `${MAX_HEIGHT}px`
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

              {textLayers.map(layer => {
                const fontSize = parseInt(layer.style.fontSize);
                
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
                    onMouseDown={(e) => handleTextMouseDown(e, layer.id)}
                  >
                    {layer.text}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Sélectionnez un mockup pour voir la prévisualisation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Slider de mockups */}
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