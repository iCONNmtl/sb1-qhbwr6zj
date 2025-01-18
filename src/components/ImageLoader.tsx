import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import type { GenerationPlatform } from '../types/mockup';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  platform?: GenerationPlatform;
}

export default function ImageLoader({ src, alt, className, platform }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Function to convert Google Drive URL to direct image URL
    const getDirectUrl = (url: string) => {
      if (url.includes('drive.google.com/file/d/')) {
        const fileId = url.match(/\/d\/([^/]+)/)?.[1];
        return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : url;
      }
      if (url.includes('drive.google.com/uc?')) {
        const fileId = url.match(/id=([^&]+)/)?.[1];
        return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : url;
      }
      return url;
    };

    setImageUrl(getDirectUrl(src));
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={clsx(
      'relative w-full h-full bg-gray-100',
      platform && 'flex items-center justify-center',
      className
    )}>
      {!error && imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className={clsx(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            platform ? [
              'max-h-full w-auto',
              platform === 'instagram' ? 'aspect-[4/5]' : 'aspect-[2/3]'
            ] : 'w-full h-full object-cover'
          )}
          style={platform ? {
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain'
          } : undefined}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  );
}