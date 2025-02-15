import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import ImageLoader from './ImageLoader';

interface DesignUploaderProps {
  onUpload: (file: File, imageUrl: string) => void;
  uploadedFile?: File;
}

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/oizx9vh84aa43v76u289whf41oq1fijx';

export default function DesignUploader({ onUpload, uploadedFile }: DesignUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
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

      setPreviewUrl(data.imageUrl);
      onUpload(file, data.imageUrl);
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
    maxFiles: 1,
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

  const { ref: dropzoneRef, ...rootProps } = getRootProps();

  return (
    <div className="space-y-4">
      {uploadedFile && previewUrl ? (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <FileImage className="h-8 w-8 text-indigo-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                type="button"
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                disabled={uploading}
              >
                {uploading ? 'Upload...' : 'Changer'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="relative aspect-square w-full max-w-sm mx-auto bg-gray-50 rounded-lg overflow-hidden">
            <ImageLoader
              src={previewUrl}
              alt="Design preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div
          {...rootProps}
          ref={dropzoneRef}
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
            <p className="text-gray-600">Déposez votre fichier ici</p>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                Glissez-déposez votre design ou cliquez pour sélectionner
              </p>
              <p className="mt-2 text-sm text-gray-500">
                WebP, JPG ou JPEG jusqu'à 10MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}