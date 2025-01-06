import React, { useState, useRef, useEffect } from 'react';
import { Image } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import MockupPreviewSlider from './MockupPreviewSlider';
import { positionToPercentage, percentageToPosition } from '../../utils/scaling';
import type { TextStyle } from '../../types/mockup';
import type { Mockup } from '../../types/mockup';

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
}

const TextPreview: React.FC<TextPreviewProps> = ({
  mockups,
  textLayers,
  selectedLayerId,
  onSelectLayer,
  onUpdatePosition
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);

  const currentMockup = mockups[currentMockupIndex];

  // Update scale when container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const containerWidth = containerRef.current?.clientWidth || 1000;
      setScale(containerWidth / 1000); // 1000 is our base width
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    onSelectLayer(layerId);
    
    const layer = textLayers.find(l => l.id === layerId);
    if (!layer) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition(layer.position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedLayerId || !containerRef.current) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    const newPosition = {
      x: Math.max(0, initialPosition.x + deltaX),
      y: Math.max(0, initialPosition.y + deltaY)
    };

    // Convert to percentage coordinates
    const containerSize = { width: 1000, height: 1000 };
    const relativePosition = positionToPercentage(newPosition, containerSize);
    const absolutePosition = percentageToPosition(relativePosition, containerSize);

    onUpdatePosition(selectedLayerId, { position: absolutePosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Prévisualisation
      </h3>

      <div 
        ref={containerRef}
        className="relative bg-gray-100 rounded-lg overflow-hidden" 
        style={{ minHeight: '400px' }}
        onClick={() => onSelectLayer('')}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {currentMockup?.previewUrl ? (
          <ImageLoader
            src={currentMockup.previewUrl}
            alt={currentMockup.name}
            className="w-full h-full object-contain"
          />
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

        {currentMockup?.previewUrl && textLayers.map(layer => {
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
                top: 0
              }}
              onMouseDown={(e) => handleMouseDown(e, layer.id)}
            >
              {layer.text}
            </div>
          );
        })}
      </div>

      {/* Mockup Preview Slider */}
      {mockups.length > 1 && (
        <MockupPreviewSlider
          mockups={mockups}
          currentIndex={currentMockupIndex}
          onIndexChange={setCurrentMockupIndex}
        />
      )}

      <div className="mt-4 text-sm text-gray-500 text-center">
        Cliquez et faites glisser le texte pour le déplacer
      </div>
    </div>
  );
};

export default TextPreview;