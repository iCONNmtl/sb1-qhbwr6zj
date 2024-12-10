import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

interface DesignUploaderProps {
  onUpload: (file: File) => void;
  uploadedFile?: File;
}

export default function DesignUploader({ onUpload, uploadedFile }: DesignUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/webp': ['.webp'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
        toast.success('Design uploadé avec succès');
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Votre design
      </h2>
      {uploadedFile ? (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <FileImage className="h-8 w-8 text-indigo-600" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
            <p className="text-sm text-gray-500">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => onUpload(uploadedFile)}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Changer
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-600'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-gray-600">Déposez votre fichier ici</p>
          ) : (
            <p className="text-gray-600">
              Glissez-déposez votre design ou cliquez pour sélectionner
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            WebP, JPG ou JPEG jusqu'à 10MB
          </p>
        </div>
      )}
    </div>
  );
}