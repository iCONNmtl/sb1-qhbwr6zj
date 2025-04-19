import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2, Clock } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  const [userDesigns, setUserDesigns] = useState<{id: string, url: string, name: string, createdAt: string}[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [showUploadTab, setShowUploadTab] = useState(true);

  // Initialize dimensions when URL changes
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

  // Fetch user designs from designs collection
  useEffect(() => {
    const fetchUserDesigns = async () => {
      if (!userId || !showExisting) return;
      
      setLoadingDesigns(true);
      try {
        // Fetch designs from designs collection
        const designsRef = collection(db, 'designs');
        const q = query(designsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        const designs: {id: string, url: string, name: string, createdAt: string}[] = [];
        
        snapshot.docs.forEach(doc => {
          const design = doc.data();
          designs.push({
            id: doc.id,
            url: design.url || design.DesignURL,
            name: design.Size || 'Design sans nom',
            createdAt: design.createdAt || new Date().toISOString()
          });
        });
        
        // Sort by creation date (newest first)
        designs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setUserDesigns(designs);
      } catch (error) {
        console.error('Error fetching designs:', error);
      } finally {
        setLoadingDesigns(false);
      }
    };

    fetchUserDesigns();
  }, [userId, showExisting]);

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
      formData.append('userId', userId);

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
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
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
        toast.error('Format non supporté. Utilisez WebP, JPG, JPEG ou PNG');
      } else {
        toast.error('Erreur lors de l\'upload du fichier');
      }
    }
  });

  return (
    <div className="space-y-4">
      {showExisting && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowUploadTab(true)}
            className={clsx(
              "px-4 py-2 rounded-lg transition-colors",
              showUploadTab 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Uploader un design
          </button>
          
          <button
            onClick={() => setShowUploadTab(false)}
            className={clsx(
              "px-4 py-2 rounded-lg transition-colors",
              !showUploadTab 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            disabled={userDesigns.length === 0}
          >
            Mes designs ({userDesigns.length})
          </button>
        </div>
      )}

      {showUploadTab ? (
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
                WebP, JPG, JPEG ou PNG jusqu'à 10MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-medium text-gray-900 mb-4">Mes designs existants</h3>
          
          {loadingDesigns ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : userDesigns.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Aucun design trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {userDesigns.map(design => (
                <div 
                  key={design.id}
                  onClick={() => onSelect(design.url)}
                  className={clsx(
                    "aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 relative",
                    selectedUrl === design.url ? "border-indigo-600 shadow-md" : "border-transparent hover:border-gray-300"
                  )}
                >
                  <img 
                    src={design.url} 
                    alt={design.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  {selectedUrl === design.url && (
                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                      <div className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Sélectionné
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{design.name}</p>
                  </div>
                  <div className="absolute top-1 right-1">
                    <div className="bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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