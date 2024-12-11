import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import { useMockups } from '../hooks/useFirestore';
import ImageLoader from '../components/ImageLoader';
import AspectRatioBadge from '../components/AspectRatioBadge';
import CategoryCount from '../components/CategoryCount';

export default function MockupLibrary() {
  const { mockups, loading } = useMockups();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories and create category list
  const categories = [
    { id: 'all', name: 'Tous' },
    ...Array.from(new Set(mockups.map(m => m.category))).map(category => ({
      id: category,
      name: category
    }))
  ];

  // Filter mockups based on selected category
  const filteredMockups = mockups.filter(mockup => 
    selectedCategory === 'all' ? true : mockup.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Librairie de mockups
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Découvrez notre collection de mockups professionnels
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center px-6 py-3 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Commencer gratuitement
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des mockups...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <CategoryCount
                key={category.id}
                category={category}
                mockups={mockups}
                favorites={[]} // Empty array since we don't have favorites in public view
                isSelected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMockups.map(mockup => (
              <div
                key={mockup.id}
                className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm relative"
              >
                <AspectRatioBadge ratio={mockup.aspectRatio} />
                {mockup.previewUrl && (
                  <ImageLoader
                    src={mockup.previewUrl}
                    alt={mockup.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="font-medium text-white">{mockup.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}