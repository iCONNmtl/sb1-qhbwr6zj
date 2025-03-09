import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import ImageLoader from './ImageLoader';

interface DesignUploaderProps {
  onUpload: (file: File, imageUrl: string, dimensions: { width: number; height: number }) => void;
  multiple?: boolean;
  allowedFormats?: string[];
  selectedUrl?: string;
}

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/oizx9vh84aa43v76u289whf41oq1fijx';

export default function DesignUploader({ 
  onUpload, 
  multiple = false,
  allowedFormats = ['image/webp', 'image/jpeg', 'image/png'],
  selectedUrl
}: DesignUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [designDimensions, setDesignDimensions] = useState<{ width: number; height: number } | null>(null);

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
      onUpload(file, data.imageUrl, dimensions);
      toast.success('Design uploadé avec succès');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload du design');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/webp': ['.webp'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-invalid-type') {
        toast.error('Format non supporté. Utilisez WebP, JPG, JPEG ou PNG');
      } else {
        toast.error('Erreur lors de l\'upload du fichier');
      }
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {selectedUrl ? (
        // After upload layout - Split into two columns
        <div className="grid md:grid-cols-2 gap-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={clsx(
              'border-2 border-dashed rounded-lg aspect-square transition cursor-pointer',
              isDragActive
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-600'
            )}
          >
            <input {...getInputProps()} />
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
                  <p className="text-gray-600">Upload en cours...</p>
                </>
              ) : isDragActive ? (
                <p className="text-gray-600">Déposez vos fichiers ici</p>
              ) : (
                <>
                  <div className="p-3 bg-indigo-100 rounded-xl w-fit mx-auto mb-4">
                    <Upload className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    Glissez-déposez votre design ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500">
                    WebP, JPG, JPEG ou PNG jusqu'à 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
            <ImageLoader
              src={selectedUrl}
              alt="Design"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {designDimensions && (
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/75 backdrop-blur-sm rounded-lg text-white text-sm">
                {designDimensions.width} × {designDimensions.height}px
              </div>
            )}
          </div>
        </div>
      ) : (
        // Before upload layout - Full width dropzone
        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-lg transition cursor-pointer h-64',
            isDragActive
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-600'
          )}
        >
          <input {...getInputProps()} />
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600">Upload en cours...</p>
              </>
            ) : isDragActive ? (
              <p className="text-gray-600">Déposez vos fichiers ici</p>
            ) : (
              <>
                <div className="p-3 bg-indigo-100 rounded-xl w-fit mx-auto mb-4">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-gray-600 mb-2">
                  Glissez-déposez votre design ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-gray-500">
                  WebP, JPG, JPEG ou PNG jusqu'à 10MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}