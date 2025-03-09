import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SimpleCompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  aspectRatio?: string;
  category?: string;
}

export default function SimpleCompare({
  firstImage = '',
  secondImage = '',
  className,
  firstImageClassName,
  secondImageClassname,
  aspectRatio = 'A4',
  category = 'Maison'
}: SimpleCompareProps) {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = async () => {
    if (isAnimating || !firstImage || !secondImage) return;

    try {
      setIsAnimating(true);

      // Reset to initial state
      await controls.set({ clipPath: 'inset(0 100% 0 0)' });

      // Slide in
      await controls.start({
        clipPath: 'inset(0 0% 0 0)',
        transition: { duration: 1, ease: 'easeInOut' }
      });

      // Hold
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Slide out
      await controls.start({
        clipPath: 'inset(0 100% 0 0)',
        transition: { duration: 1, ease: 'easeInOut' }
      });

      setIsAnimating(false);
    } catch (error) {
      console.error('Animation error:', error);
      setIsAnimating(false);
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-start w-full justify-center overflow-hidden',
        className
      )}
      onClick={startAnimation}
    >
      {/* Background Image (Always Visible) */}
      <img
        className={cn(
          'absolute inset-0 z-10 rounded-xl w-full h-full select-none object-cover',
          secondImageClassname
        )}
        alt="Background"
        src={secondImage}
        draggable={false}
      />

      {/* Animated Overlay */}
      <motion.div
        className={cn(
          'absolute inset-0 z-20 rounded-xl overflow-hidden',
          firstImageClassName
        )}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={controls}
      >
        <img
          alt="Overlay"
          src={firstImage}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* UI Elements - Always on top */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* Size Badge */}
        <div className="absolute top-2 right-2 px-3 py-1.5 bg-black/75 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
          {aspectRatio}
        </div>

        {/* Category Label */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-sm text-white/90 font-medium">
            {category}
          </p>
        </div>
      </div>
    </div>
  );
}