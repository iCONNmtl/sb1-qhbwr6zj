import { useState, useEffect, useCallback } from 'react';

interface UseAutoSliderProps {
  itemsCount: number;
  interval?: number;
  initialIndex?: number;
}

export function useAutoSlider({ 
  itemsCount, 
  interval = 5000, // 5 seconds by default
  initialIndex = 0 
}: UseAutoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((current) => (current + 1) % itemsCount);
  }, [itemsCount]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, isPaused]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    
    // Resume auto-sliding after 10 seconds of inactivity
    const resumeTimeout = setTimeout(() => {
      setIsPaused(false);
    }, 10000);

    return () => clearTimeout(resumeTimeout);
  };

  return {
    activeIndex,
    goTo,
    setIsPaused
  };
}