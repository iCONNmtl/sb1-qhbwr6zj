import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import ImageLoader from './ImageLoader';
import DesignCompatibilityBadge from './DesignCompatibilityBadge';
import { checkDesignCompatibility } from '../utils/designCompatibility';
import type { Size } from '../types/product';

interface DesignSelectorProps {
  userId: string;
  onSelect: (url: string) => void;
  selectedUrl?: string;
  sizes?: Size[];
  onDimensionsAvailable?: (width: number, height: number) => void;
  showExisting?: boolean;
}

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/oizx9vh84aa43v76u289whf41oq1fijx';

export default function DesignSelector({ 
  userId, 
  onSelect, 
  selectedUrl,
  sizes = [],
  onDimensionsAvailable,
  showExisting = true 
}: DesignSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [designDimensions, setDesignDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (selectedUrl) {
      const img = new Image();
      img.onload = () => {
        setDesignDimensions({ width: img.width, height: img.height });
        onDimensionsAvailable?.(img.width, img.height);
      };
      img.src = selectedUrl;
    }
  }, [selectedUrl, onDimensionsAvailable]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      // Get image dimensions before upload
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height
          });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      // Check if dimensions are compatible with selected size
      if (sizes.length === 1) {
        const compatibility = checkDesignCompatibility(dimensions.width, dimensions.height, sizes[0]);
        if (!compatibility.isCompatible) {
          throw new Error(compatibility.reason || 'Format incompatible');
        }
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }

      setDesignDimensions(dimensions);
      onDimensionsAvailable?.(dimensions.width, dimensions.height);
      onSelect(data.imageUrl);
      toast.success('Design uploadé avec succès');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Erreur lors de l\'upload du design');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/webp': ['.webp'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-invalid-type') {
        toast.error('Format non supporté. Utilisez WebP, JPG ou JPEG');
      } else {
        toast.error('Erreur lors de l\'upload du fichier');
      }
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition',
          isDragActive
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-600'
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 mx-auto mb-4 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Upload en cours...</p>
          </>
        ) : isDragActive ? (
          <p className="text-gray-600">Déposez vos fichiers ici</p>
        ) : (
          <>
            <div className="p-3 bg-indigo-100 rounded-xl w-fit mx-auto mb-4">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-gray-600">
              Glissez-déposez votre design ou cliquez pour sélectionner
            </p>
            <p className="mt-2 text-sm text-gray-500">
              WebP, JPG ou JPEG jusqu'à 10MB
            </p>
          </>
        )}
      </div>

      {selectedUrl && designDimensions && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Design sélectionné</h3>
            <div className="text-sm text-gray-500">
              {designDimensions.width}×{designDimensions.height}px
            </div>
          </div>

          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <ImageLoader
              src={selectedUrl}
              alt="Design"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {sizes.length === 1 && (
            <div className="mt-4">
              <DesignCompatibilityBadge
                designWidth={designDimensions.width}
                designHeight={designDimensions.height}
                size={sizes[0]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}