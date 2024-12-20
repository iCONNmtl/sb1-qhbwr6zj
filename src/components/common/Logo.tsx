import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const LOGO_URL = "https://lh3.googleusercontent.com/d/1zMgIieh76pSFOAzelWfWukdfAB7RZFCC";

export default function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <Link to="/" className={clsx('flex items-center space-x-2', className)}>
      <div className={clsx(
        sizes[size],
        'relative flex-shrink-0',
        imageError ? 'gradient-bg rounded-lg p-1.5' : ''
      )}>
        {imageError ? (
          <Layers className="w-full h-full text-white" />
        ) : (
          <img 
            src={LOGO_URL}
            alt="MockupPro Logo"
            className={clsx(
              'w-full h-full object-contain',
              'transition-all duration-200'
            )}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      {showText && (
        <span className={clsx(
          "font-bold text-gray-900",
          size === 'sm' ? 'text-base' : 'text-lg'
        )}>
          Pixmock
        </span>
      )}
    </Link>
  );
}