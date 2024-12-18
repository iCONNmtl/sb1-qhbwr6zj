import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const LOGO_URL = "https://drive.usercontent.google.com/download?id=1jVbZB8d5sq_60pKt3TiAFe_DoB2xu5YP";

export default function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <Link to="/" className={clsx('flex items-center space-x-3', className)}>
      <div className={clsx(
        sizes[size],
        'relative flex-shrink-0'
      )}>
        <img 
          src={LOGO_URL}
          alt="MockupPro Logo"
          className={clsx(
            'w-full h-full object-contain',
            'transition-all duration-200'
          )}
        />
      </div>
      {showText && (
        <span className="text-xl font-bold text-gray-900">MockupPro</span>
      )}
    </Link>
  );
}