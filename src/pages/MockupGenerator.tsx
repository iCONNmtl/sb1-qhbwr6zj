import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Plus, Ruler, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// Components
import DesignUploader from '../components/DesignUploader';
import CategoryCount from '../components/CategoryCount';
import MockupGrid from '../components/mockup/MockupGrid';
import MockupPagination from '../components/mockup/MockupPagination';
import GenerationFooter from '../components/mockup/GenerationFooter';
import GenerationProgress from '../components/generation/GenerationProgress';
import ExportFormatSelector from '../components/mockup/ExportFormatSelector';
import TextEditor from '../components/mockup/TextEditor';
import TextCustomizationToggle from '../components/mockup/TextCustomizationToggle';
import DesignSelector from '../components/DesignSelector';

// Hooks
import { useMockupGeneration } from '../hooks/useMockupGeneration';
import { useMockupSelection } from '../hooks/useMockupSelection';
import { useMockups } from '../hooks/useMockups';
import { useCategories } from '../hooks/useCategories';

// Types
import type { UserProfile } from '../types/user';
import type { ExportFormat, AspectRatio } from '../types/mockup';

const ITEMS_PER_PAGE = 20;

// Groupes de formats similaires avec dimensions
const SIZE_GROUPS = [
  {
    id: '8x10',
    name: '8x10"',
    description: '20x25cm',
    similar: []
  },
  {
    id: '8x12',
    name: '8x12"',
    description: '21x29,7cm',
    similar: ['12x18', '24x36']
  },
  {
    id: '12x18',
    name: '12x18"',
    description: '30x45cm',
    similar: ['8x12', '24x36']
  },
  {
    id: '24x36',
    name: '24x36"',
    description: '60x90cm',
    similar: ['8x12', '12x18']
  },
  {
    id: '11x14',
    name: '11x14"',
    description: '27x35cm',
    similar: []
  },
  {
    id: '11x17',
    name: '11x17"',
    description: '28x43cm',
    similar: []
  },
  {
    id: '18x24',
    name: '18x24"',
    description: '45x60cm',
    similar: []
  },
  {
    id: 'A4',
    name: 'A4',
    description: '21x29,7cm',
    similar: ['5x7', '20x28', '28x40']
  },
  {
    id: '5x7',
    name: '5x7"',
    description: '13x18cm',
    similar: ['A4', '20x28', '28x40']
  },
  {
    id: '20x28',
    name: '20x28"',
    description: '50x70cm',
    similar: ['A4', '5x7', '28x40']
  },
  {
    id: '28x40',
    name: '28x40"',
    description: '70x100cm',
    similar: ['A4', '5x7', '20x28']
  },
  {
    id: '16:9',
    name: 'Paysage 16:9',
    description: 'Format écran large',
    similar: ['3:2', '4:3']
  },
  {
    id: '3:2',
    name: 'Paysage 3:2',
    description: 'Format photo standard',
    similar: ['16:9', '4:3']
  },
  {
    id: '4:3',
    name: 'Paysage 4:3',
    description: 'Format classique',
    similar: ['16:9', '3:2']
  },
  {
    id: '1:1',
    name: 'Carré 1:1',
    description: 'Format carré',
    similar: []
  },
  {
    id: '9:16',
    name: 'Portrait 16:9',
    description: 'Format vertical écran',
    similar: ['2:3', '3:4']
  },
  {
    id: '2:3',
    name: 'Portrait 3:2',
    description: 'Format photo vertical',
    similar: ['9:16', '3:4']
  },
  {
    id: '3:4',
    name: 'Portrait 4:3',
    description: 'Format classique vertical',
    similar: ['9:16', '2:3']
  }
];

export default function MockupGenerator() {
  const { user } = useStore();
  const [designFile, setDesignFile] = useState<File>();
  const [designUrl, setDesignUrl] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState<AspectRatio | 'all'>('all');
  const [showSizeFilter, setShowSizeFilter] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('webp');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customHtml, setCustomHtml] = useState<string>('');
  const [isTextCustomizationEnabled, setIsTextCustomizationEnabled] = useState(false);
  const [customizedMockups, setCustomizedMockups] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { mockups, loading: mockupsLoading } = useMockups();
  const { categories } = useCategories(mockups, favorites);
  const { isGenerating, generateMockups } = useMockupGeneration();
  const { selectedMockups, handleMockupSelection } = useMockupSelection(userProfile);

  // Get selected mockup data
  const selectedMockupData = mockups.filter(m => selectedMockups.includes(m.id));

  // Get similar sizes for the selected size
  const selectedSizeGroup = SIZE_GROUPS.find(group => group.id === selectedSize);
  const similarSizes = selectedSizeGroup?.similar || [];

  // Filter mockups based on selected category and size
  const filteredMockups = mockups.filter(mockup => {
    const categoryMatch = selectedCategory === 'all' ? true :
                         selectedCategory === 'favorites' ? favorites.includes(mockup.id) :
                         mockup.category === selectedCategory;
    
    const sizeMatch = selectedSize === 'all' ? true : 
                     mockup.aspectRatio === selectedSize || 
                     similarSizes.includes(mockup.aspectRatio);
    
    return categoryMatch && sizeMatch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredMockups.length / ITEMS_PER_PAGE);

  // Reset to page 1 when category or size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSize]);

  // Get current mockups
  const indexOfLastMockup = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMockup = indexOfLastMockup - ITEMS_PER_PAGE;
  const currentMockups = filteredMockups.slice(indexOfFirstMockup, indexOfLastMockup);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);
          setFavorites(userData.favorites || []);
          
          if (selectedCategory === 'favorites' && (!userData.favorites || userData.favorites.length === 0)) {
            setSelectedCategory('all');
          }
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        toast.error('Erreur lors du chargement du profil');
      }
    );

    return () => unsubscribe();
  }, [user, selectedCategory]);

  const handleGenerate = () => {
    if (!user || !userProfile) return;

    generateMockups(
      designFile || null,
      designUrl,
      selectedMockups,
      selectedMockupData,
      userProfile,
      exportFormat,
      isTextCustomizationEnabled ? customHtml : undefined,
      customizedMockups
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSizeChange = (size: AspectRatio | 'all') => {
    setSelectedSize(size);
    setShowSizeDropdown(false);
  };

  return (
    <div className="space-y-8">
      {isGenerating && <GenerationProgress totalMockups={selectedMockups.length} />}

      {/* Design Selection */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. Choisissez votre design
        </h2>
        <DesignSelector
          userId={user?.uid || ''}
          onSelect={(url) => {
            setDesignUrl(url);
            setDesignFile(undefined);
          }}
        />
      </section>

      {/* Mockup Selection */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            2. Sélectionnez vos mockups
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Ruler className="h-5 w-5 mr-2" />
                {selectedSize === 'all' ? 'Toutes les tailles' : SIZE_GROUPS.find(g => g.id === selectedSize)?.name}
                <ChevronDown className={clsx(
                  "h-5 w-5 ml-2 transition-transform",
                  showSizeDropdown && "transform rotate-180"
                )} />
              </button>

              {/* Size Dropdown */}
              {showSizeDropdown && (
                <div className="absolute z-50 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={() => handleSizeChange('all')}
                    className={clsx(
                      'w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors',
                      selectedSize === 'all' && 'bg-indigo-50 text-indigo-600'
                    )}
                  >
                    Toutes les tailles
                  </button>
                  
                  {SIZE_GROUPS.map((group) => (
                    <div key={group.id}>
                      <button
                        onClick={() => handleSizeChange(group.id as AspectRatio)}
                        className={clsx(
                          'w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors',
                          selectedSize === group.id && 'bg-indigo-50 text-indigo-600'
                        )}
                      >
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-gray-500">{group.description}</div>
                      </button>
                      {group.similar.length > 0 && selectedSize === group.id && (
                        <div className="ml-4 pl-4 border-l border-gray-200">
                          <div className="py-1 px-4 text-xs text-gray-500">
                            Formats similaires :
                          </div>
                          {group.similar.map((similarId) => {
                            const similarSize = SIZE_GROUPS.find(s => s.id === similarId);
                            return (
                              <button
                                key={similarId}
                                onClick={() => handleSizeChange(similarId as AspectRatio)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                              >
                                <div className="font-medium">{similarSize?.name}</div>
                                <div className="text-xs text-gray-500">{similarSize?.description}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/custom-mockup"
              className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Ajouter votre mockup</span>
            </Link>
            {userProfile && (
              <div className="text-sm text-gray-600">
                {selectedMockups.length} mockup{selectedMockups.length > 1 ? 's' : ''} sélectionné{selectedMockups.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <CategoryCount
                key={category.id}
                category={category}
                mockups={mockups}
                favorites={favorites}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>

        {mockupsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Chargement des mockups...</p>
          </div>
        ) : filteredMockups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {selectedCategory === 'favorites' ? 'Aucun favori' : 'Aucun mockup disponible'}
          </div>
        ) : (
          <>
            <MockupGrid
              mockups={currentMockups}
              selectedMockups={selectedMockups}
              favorites={favorites}
              userId={user?.uid || ''}
              onSelect={handleMockupSelection}
            />
            
            {totalPages > 1 && (
              <MockupPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </section>

      {/* Text Customization */}
      {selectedMockups.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Personnalisez votre texte
          </h2>
          
          <div className="space-y-6">
            <TextCustomizationToggle
              isEnabled={isTextCustomizationEnabled}
              onChange={setIsTextCustomizationEnabled}
            />

            {isTextCustomizationEnabled && (
              <TextEditor
                selectedMockups={selectedMockupData}
                onGenerateHtml={setCustomHtml}
                onCustomizedMockupsChange={setCustomizedMockups}
                userId={user?.uid}
                userLogo={userProfile?.logoUrl}
              />
            )}
          </div>
        </section>
      )}

      {/* Export Format */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedMockups.length > 0 ? '4' : '3'}. Choisissez le format d'export
        </h2>
        <ExportFormatSelector
          format={exportFormat}
          onChange={setExportFormat}
        />
      </section>

      {/* Generation Footer */}
      <GenerationFooter
        userProfile={userProfile}
        selectedMockups={selectedMockups}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        designFile={designFile}
        designUrl={designUrl}
        isTextCustomizationEnabled={isTextCustomizationEnabled}
        customizedMockups={customizedMockups}
      />
    </div>
  );
}