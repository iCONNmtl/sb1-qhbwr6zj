import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import clsx from 'clsx';
import ImageLoader from '../ImageLoader';

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
}

export default function GenerationGroup({ generation }: GenerationGroupProps) {
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(generation.createdAt)}</span>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full">
            {generation.mockups.length} mockup{generation.mockups.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {generation.mockups.map((mockup) => (
            <div
              key={mockup.id}
              className="group aspect-square bg-gray-50 rounded-lg overflow-hidden relative cursor-pointer"
              onClick={() => handleOpenImage(mockup.url)}
            >
              <ImageLoader
                src={mockup.url}
                alt={mockup.name}
                className="absolute inset-0"
              />
              <div className={clsx(
                "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              )}>
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}