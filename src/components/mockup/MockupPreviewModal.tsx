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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {mockup.name}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              title="Télécharger"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="relative aspect-square max-h-full">
            <ImageLoader
              src={mockup.url}
              alt={mockup.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}