import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import ProgressBar from './ProgressBar';

interface GenerationStepProps {
  step: string;
  label: string;
  isActive: boolean;
  isComplete: boolean;
  progress?: number;
  description?: string;
}

export default function GenerationStep({
  step,
  label,
  isActive,
  isComplete,
  progress,
  description
}: GenerationStepProps) {
  const getStepColor = () => {
    if (isComplete) return 'green';
    if (isActive) return 'indigo';
    return 'gray';
  };

  const color = getStepColor();

  return (
    <div className="flex items-start space-x-4">
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
        isComplete ? 'bg-green-600' : 
        isActive ? 'bg-indigo-600' : 
        'bg-gray-200'
      )}>
        {isComplete ? (
          <Check className="h-5 w-5 text-white" />
        ) : isActive ? (
          <Loader2 className="h-5 w-5 text-white animate-spin" />
        ) : (
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={clsx(
            'font-medium truncate',
            isComplete ? 'text-green-600' : 
            isActive ? 'text-indigo-600' : 
            'text-gray-500'
          )}>
            {label}
          </span>
          {progress !== undefined && (
            <span className="text-sm text-gray-500 ml-2">
              {Math.round(progress)}%
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-gray-500 mb-2">
            {description}
          </p>
        )}
        
        {progress !== undefined && (
          <ProgressBar 
            progress={progress}
            showLabel={false}
            size="sm"
            color={color === 'gray' ? 'indigo' : color}
          />
        )}
      </div>
    </div>
  );
}