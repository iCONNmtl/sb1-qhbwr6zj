import React, { useState } from 'react';
import { Eye, ChevronDown, ChevronUp, Download } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';
import MockupPreviewModal from '../mockup/MockupPreviewModal';

interface MockupGeneration {
  id: string;
  mockups: {
    id: string;
    name: string;
    url: string;
  }[];
  createdAt: string;
}

interface GenerationGroupProps {
  generation: MockupGeneration;
  isLatest: boolean;
}

export default function GenerationGroup({ generation, isLatest }: GenerationGroupProps) {
  const [isExpanded, setIsExpanded] = useState(isLatest);
  const [selectedMockup, setSelectedMockup] = useState<{id: string; name: string; url: string} | null>(null);

  const handleOpenImage = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className={clsx(
        "bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300",
        isLatest && "ring-2 ring-indigo-600"
      )}>
        <div 
          className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {formatDate(generation.createdAt)}
            </span>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full">
              {generation.mockups.length} mockup{generation.mockups.length > 1 ? 's' : ''}
            </span>
          </div>

          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        {isExpanded && (
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {generation.mockups.map((mockup) => (
                <div
                  key={mockup.id}
                  className="group aspect-square bg-gray-50 rounded-lg overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <ImageLoader
                    src={mockup.url}
                    alt={mockup.name}
                    className="absolute inset-0"
                  />
                  <div className={clsx(
                    "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50",
                    "flex items-center justify-center gap-4 transition-all duration-300"
                  )}>
                    <button
                      onClick={() => setSelectedMockup(mockup)}
                      className="p-2 bg-white text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleOpenImage(mockup.url)}
                      className="p-2 bg-white text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedMockup && (
        <MockupPreviewModal
          mockup={selectedMockup}
          onClose={() => setSelectedMockup(null)}
          onDownload={() => handleOpenImage(selectedMockup.url)}
        />
      )}
    </>
  );
}