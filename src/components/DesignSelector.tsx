import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Image, Upload } from 'lucide-react';
import DesignUploader from './DesignUploader';
import clsx from 'clsx';
import ImageLoader from './ImageLoader';

interface Design {
  url: string;
  name: string;
  createdAt: string;
}

interface DesignSelectorProps {
  userId: string;
  onSelect: (url: string) => void;
  selectedUrl?: string;
}

export default function DesignSelector({ userId, onSelect, selectedUrl }: DesignSelectorProps) {
  const [mode, setMode] = useState<'upload' | 'select'>('upload');
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(selectedUrl || null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        const designsData = snapshot.docs.map(doc => ({
          url: doc.data().designUrl,
          name: doc.data().id,
          createdAt: doc.data().createdAt
        }));

        // Filtrer les designs uniques par URL
        const uniqueDesigns = designsData.reduce((acc, current) => {
          const exists = acc.find(design => design.url === current.url);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as Design[]);

        // Trier par date de création décroissante
        uniqueDesigns.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setDesigns(uniqueDesigns);
      } catch (error) {
        console.error('Error fetching designs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [userId]);

  const handleDesignSelect = (url: string) => {
    setSelectedDesign(url);
    onSelect(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Selected Design Preview */}
      {selectedDesign && (
        <div className="mb-6 space-y-4">
          <div className="relative aspect-video w-full max-w-xl mx-auto bg-gray-50 rounded-lg overflow-hidden">
            <ImageLoader
              src={selectedDesign}
              alt="Selected design"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedDesign(null)}
              className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              Changer de design
            </button>
          </div>
        </div>
      )}

      {!selectedDesign && (
        <>
          {/* Mode selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('upload')}
              className={clsx(
                'flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200',
                mode === 'upload'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              )}
            >
              <Upload className="h-5 w-5 mr-2" />
              Uploader un design
            </button>
            <button
              onClick={() => setMode('select')}
              className={clsx(
                'flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200',
                mode === 'select'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              )}
            >
              <Image className="h-5 w-5 mr-2" />
              Designs existants
            </button>
          </div>

          {mode === 'upload' ? (
            <DesignUploader
              onUpload={(file, imageUrl) => handleDesignSelect(imageUrl)}
            />
          ) : (
            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Chargement des designs...</p>
                </div>
              ) : designs.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun design disponible</p>
                  <button
                    onClick={() => setMode('upload')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Uploader un design
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {designs.map((design, index) => (
                    <button
                      key={index}
                      onClick={() => handleDesignSelect(design.url)}
                      className={clsx(
                        'aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200',
                        selectedDesign === design.url
                          ? 'border-indigo-600 ring-1 ring-indigo-600'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="relative w-full h-full group">
                        <ImageLoader
                          src={design.url}
                          alt={design.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                          <div className="absolute inset-x-0 bottom-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(design.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}