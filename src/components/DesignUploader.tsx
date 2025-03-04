import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import ImageLoader from './ImageLoader';

interface DesignUploaderProps {
  onUpload: (file: File, imageUrl: string, dimensions: { width: number; height: number }) => void;
  multiple?: boolean;
}

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/oizx9vh84aa43v76u289whf41oq1fijx';

export default function DesignUploader({ onUpload, multiple = false }: DesignUploaderProps) {
  const [uploading, setUploading] = useState(false);

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
      'image/jpeg': ['.jpg', '.jpeg']
    },
    multiple,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(handleUpload);
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
              {multiple ? 'Glissez-déposez vos designs ou cliquez pour sélectionner' : 'Glissez-déposez votre design ou cliquez pour sélectionner'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              WebP, JPG ou JPEG jusqu'à 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}