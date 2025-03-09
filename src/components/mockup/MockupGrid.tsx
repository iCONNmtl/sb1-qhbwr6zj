import React, { useState } from 'react';
import { Image, CheckCircle, Eye } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import AspectRatioBadge from '../AspectRatioBadge';
import FavoriteButton from '../FavoriteButton';
import { motion, useAnimation } from 'framer-motion';
import type { Mockup } from '../../types/mockup';

interface MockupGridProps {
  mockups: Mockup[];
  selectedMockups: string[];
  favorites: string[];
  userId: string;
  onSelect: (mockupId: string) => void;
}

export default function MockupGrid({
  mockups,
  selectedMockups,
  favorites,
  userId,
  onSelect
}: MockupGridProps) {
  const [animatingMockup, setAnimatingMockup] = useState<string | null>(null);
  const controls = useAnimation();
  const lineControls = useAnimation();

  const startAnimation = async (e: React.MouseEvent, mockupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (animatingMockup || !mockupId) return;

    try {
      setAnimatingMockup(mockupId);

      // Forward animation
      await Promise.all([
        controls.set({ clipPath: 'inset(0 100% 0 0)' }),
        lineControls.set({ left: '0%' })
      ]);

      await Promise.all([
        controls.start({
          clipPath: 'inset(0 0% 0 0)',
          transition: { duration: 1, ease: 'easeInOut' }
        }),
        lineControls.start({
          left: '100%',
          transition: { duration: 1, ease: 'easeInOut' }
        })
      ]);

      // Hold
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset line position for backward animation
      await lineControls.set({ left: '100%' });

      // Backward animation
      await Promise.all([
        controls.start({
          clipPath: 'inset(0 100% 0 0)',
          transition: { duration: 1, ease: 'easeInOut' }
        }),
        lineControls.start({
          left: '0%',
          transition: { duration: 1, ease: 'easeInOut' }
        })
      ]);

      setAnimatingMockup(null);
    } catch (error) {
      console.error('Animation error:', error);
      setAnimatingMockup(null);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mockups.map((mockup) => (
        <div
          key={mockup.id}
          onClick={() => onSelect(mockup.id)}
          className={clsx(
            'group aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative transform hover:scale-105',
            selectedMockups.includes(mockup.id) && 'ring-2 ring-indigo-600'
          )}
        >
          {/* Favorite Button */}
          <div className="absolute top-1 left-1 z-50">
            <FavoriteButton
              mockupId={mockup.id}
              userId={userId}
              isFavorite={favorites.includes(mockup.id)}
            />
          </div>

          {/* Eye Button */}
          {mockup.previewUrlAfter && (
            <button
              onClick={(e) => startAnimation(e, mockup.id)}
              className="absolute top-3 right-3 z-50 p-2 bg-black/75 backdrop-blur-sm rounded-lg hover:bg-black/90 transition-colors"
              title="Voir l'aperçu"
            >
              <Eye className="h-5 w-5 text-white" />
            </button>
          )}

          {/* Size Badge */}
          <AspectRatioBadge ratio={mockup.aspectRatio} />
          
          {/* Background Image (Always Visible) */}
          <img
            src={mockup.previewUrl || ''}
            alt={mockup.category}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />

          {/* Animated Overlay */}
          {mockup.previewUrlAfter && animatingMockup === mockup.id && (
            <>
              {/* Animation Line */}
              <motion.div 
                className="absolute inset-0 z-40 pointer-events-none"
                animate={lineControls}
                initial={{ left: '0%' }}
              >
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                  style={{
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full" />
                </div>
              </motion.div>

              <motion.div
                className="absolute inset-0 z-20 overflow-hidden"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={controls}
              >
                <img
                  src={mockup.previewUrlAfter}
                  alt={`${mockup.category} After`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </>
          )}

          {selectedMockups.includes(mockup.id) && (
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-20 backdrop-blur-sm z-30">
              <CheckCircle className="h-12 w-12 text-indigo-600" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3 z-20">
            <p className="text-sm text-white/90 font-medium">
              {mockup.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}