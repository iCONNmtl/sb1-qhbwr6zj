import React from 'react';
import { X, Download } from 'lucide-react';
import ImageLoader from '../ImageLoader';

interface MockupPreviewModalProps {
  mockup: {
    name: string;
    url: string;
  };
  onClose: () => void;
  onDownload: () => void;
}

export default function MockupPreviewModal({ mockup, onClose, onDownload }: MockupPreviewModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {mockup.name}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              title="Télécharger"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Square Image Container */}
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 p-3">
            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <ImageLoader
                src={mockup.url}
                alt={mockup.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}