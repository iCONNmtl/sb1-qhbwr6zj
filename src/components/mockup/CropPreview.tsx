import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';
import clsx from 'clsx';

interface CropPreviewProps {
  imageUrl: string;
  format: 'instagram' | 'pinterest';
  onCropChange: (crop: { x: number; y: number }) => void;
}

const ASPECT_RATIOS = {
  instagram: 4/5,
  pinterest: 2/3
};

export default function CropPreview({ imageUrl, format, onCropChange }: CropPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Initialiser la position au centre
  useEffect(() => {
    if (containerRef.current && cropRef.current) {
      const container = containerRef.current;
      const crop = cropRef.current;
      
      const centerX = (container.clientWidth - crop.clientWidth) / 2;
      const centerY = (container.clientHeight - crop.clientHeight) / 2;
      
      setPosition({ x: centerX, y: centerY });
    }
  }, [format]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !cropRef.current) return;

    const container = containerRef.current;
    const crop = cropRef.current;

    // Calculer les nouvelles positions avec les limites
    const newX = Math.max(0, Math.min(e.clientX - dragStart.x, container.clientWidth - crop.clientWidth));
    const newY = Math.max(0, Math.min(e.clientY - dragStart.y, container.clientHeight - crop.clientHeight));

    setPosition({ x: newX, y: newY });
    
    // Calculer et envoyer les pourcentages de position
    const percentX = newX / (container.clientWidth - crop.clientWidth);
    const percentY = newY / (container.clientHeight - crop.clientHeight);
    onCropChange({ x: percentX, y: percentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculer la largeur du crop en fonction du format
  const getCropWidth = () => {
    if (!containerRef.current) return '80%';
    const container = containerRef.current;
    const ratio = ASPECT_RATIOS[format];
    const maxWidth = container.clientHeight * ratio;
    return `${Math.min(maxWidth, container.clientWidth)}px`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Crop Window */}
      <div
        ref={cropRef}
        onMouseDown={handleMouseDown}
        className={clsx(
          'absolute cursor-move border-2 border-white border-dashed',
          format === 'instagram' ? 'aspect-[4/5]' : 'aspect-[2/3]'
        )}
        style={{
          width: getCropWidth(),
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'all 0.2s ease'
        }}
      >
        {/* Guide Lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/30" />
          ))}
        </div>
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Move className="h-6 w-6 text-white opacity-60" />
        </div>
      </div>
    </div>
  );
}