import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import DesignUploader from '../components/DesignUploader';
import CategoryCount from '../components/CategoryCount';
import MockupGrid from '../components/mockup/MockupGrid';
import GenerationFooter from '../components/mockup/GenerationFooter';
import GenerationProgress from '../components/generation/GenerationProgress';
import { getPlanMockupLimit } from '../utils/subscription';
import { useMockupGeneration } from '../hooks/useMockupGeneration';
import { useMockupSelection } from '../hooks/useMockupSelection';
import { useMockups } from '../hooks/useMockups';
import { useCategories } from '../hooks/useCategories';
import type { UserProfile } from '../types/user';
import type { Mockup } from '../types/mockup';

export default function MockupGenerator() {
  const { user } = useStore();
  const [designFile, setDesignFile] = useState<File>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { mockups, loading: mockupsLoading } = useMockups();
  const { categories } = useCategories(mockups, favorites);
  const { isGenerating, generateMockups } = useMockupGeneration();
  const { selectedMockups, handleMockupSelection } = useMockupSelection(userProfile);

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

  const filteredMockups = mockups.filter(mockup => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return favorites.includes(mockup.id);
    return mockup.category === selectedCategory;
  });

  const handleGenerate = () => {
    if (!user || !userProfile || !designFile) return;
    const selectedMockupData = mockups.filter(m => selectedMockups.includes(m.id));
    generateMockups(designFile, selectedMockups, selectedMockupData, userProfile);
  };

  return (
    <div className="space-y-8">
      {isGenerating && <GenerationProgress totalMockups={selectedMockups.length} />}

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. Uploadez votre design
        </h2>
        <DesignUploader onUpload={setDesignFile} uploadedFile={designFile} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            2. Sélectionnez vos mockups
          </h2>
          {userProfile && (
            <div className="text-sm text-gray-600">
              {selectedMockups.length} / {getPlanMockupLimit(userProfile.subscription.plan)} mockups sélectionnés
            </div>
          )}
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <CategoryCount
              key={category.id}
              category={category}
              mockups={mockups}
              favorites={favorites}
              isSelected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>

        {mockupsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
            <p className="text-gray-500">Chargement des mockups...</p>
          </div>
        ) : filteredMockups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {selectedCategory === 'favorites' ? 'Aucun favori' : 'Aucun mockup disponible'}
          </div>
        ) : (
          <MockupGrid
            mockups={filteredMockups}
            selectedMockups={selectedMockups}
            favorites={favorites}
            userId={user?.uid || ''}
            onSelect={handleMockupSelection}
          />
        )}
      </section>

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