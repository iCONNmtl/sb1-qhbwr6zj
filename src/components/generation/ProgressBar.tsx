import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'green';
}

export default function ProgressBar({ 
  progress, 
  showLabel = true,
  size = 'md',
  color = 'indigo'
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    indigo: {
      bg: 'bg-indigo-100',
      bar: 'bg-indigo-600',
      text: 'text-indigo-600'
    },
    green: {
      bg: 'bg-green-100',
      bar: 'bg-green-600',
      text: 'text-green-600'
    }
  };

  return (
    <div className="relative pt-1">
      {showLabel && (
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className={clsx(
              'text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full',
              colors[color].text,
              colors[color].bg
            )}>
              Progression
            </span>
          </div>
          <div className="text-right">
            <span className={clsx(
              'text-xs font-semibold inline-block',
              colors[color].text
            )}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}
      <div className={clsx(
        'overflow-hidden mb-4 text-xs flex rounded-full',
        heights[size],
        colors[color].bg
      )}>
        <div
          ref={progressBarRef}
          className={clsx(
            'flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300 ease-out',
            colors[color].bar
          )}
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}