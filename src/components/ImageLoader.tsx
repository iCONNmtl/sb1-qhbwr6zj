import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageLoader({ src, alt, className }: ImageLoaderProps) {
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
    <div className={clsx('relative w-full h-full bg-gray-100', className)}>
      {!error && imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className={clsx(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
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