import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
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

// Hooks
import { useMockupGeneration } from '../hooks/useMockupGeneration';
import { useMockupSelection } from '../hooks/useMockupSelection';
import { useMockups } from '../hooks/useMockups';
import { useCategories } from '../hooks/useCategories';

// Types
import type { UserProfile } from '../types/user';
import type { ExportFormat } from '../types/mockup';

export default function MockupGenerator() {
  const { user } = useStore();
  const [designFile, setDesignFile] = useState<File>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('webp');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customHtml, setCustomHtml] = useState<string>('');
  const [isTextCustomizationEnabled, setIsTextCustomizationEnabled] = useState(false);
  const [customizedMockups, setCustomizedMockups] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const { mockups, loading: mockupsLoading } = useMockups();
  const { categories } = useCategories(mockups, favorites);
  const { isGenerating, generateMockups } = useMockupGeneration();
  const { selectedMockups, handleMockupSelection } = useMockupSelection(userProfile);

  // Get selected mockup data
  const selectedMockupData = mockups.filter(m => selectedMockups.includes(m.id));

  // Filter mockups based on selected category
  const filteredMockups = mockups.filter(mockup => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return favorites.includes(mockup.id);
    return mockup.category === selectedCategory;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredMockups.length / itemsPerPage);

  // Reset to page 1 when category changes or if current page is beyond total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [selectedCategory, totalPages, currentPage]);

  // Get current mockups
  const indexOfLastMockup = currentPage * itemsPerPage;
  const indexOfFirstMockup = indexOfLastMockup - itemsPerPage;
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
    if (!user || !userProfile || !designFile) return;

    const textCustomization = {
      enabled: isTextCustomizationEnabled,
      appliedMockups: customizedMockups,
      html: customHtml
    };

    generateMockups(
      designFile, 
      selectedMockups, 
      selectedMockupData, 
      userProfile, 
      exportFormat,
      textCustomization
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
  };

  return (
    <div className="space-y-8">
      {isGenerating && <GenerationProgress totalMockups={selectedMockups.length} />}

      {/* Design Upload */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. Uploadez votre design
        </h2>
        <DesignUploader onUpload={setDesignFile} uploadedFile={designFile} />
      </section>

      {/* Mockup Selection */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            2. Sélectionnez vos mockups
          </h2>
          <div className="flex items-center gap-4">
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
            3. Personnalisez vos mockups
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
      />
    </div>
  );
}