import React, { useState, useEffect, useCallback } from 'react';
import { Image, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import DesignUploader from '../components/DesignUploader';
import FavoriteButton from '../components/FavoriteButton';
import CategoryCount from '../components/CategoryCount';
import { triggerGenerationWebhook } from '../lib/webhooks';
import { updateUserCredits, getPlanMockupLimit } from '../utils/subscription';
import { processDesignFile } from '../utils/imageProcessing';
import clsx from 'clsx';
import ImageLoader from '../components/ImageLoader';
import AspectRatioBadge from '../components/AspectRatioBadge';
import LoadingAnimation from '../components/LoadingAnimation';
import { nanoid } from 'nanoid';
import type { UserProfile } from '../types/user';
import type { Mockup } from '../types/mockup';

export default function MockupGenerator() {
  const { user, addGeneration } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [designFile, setDesignFile] = useState<File>();
  const [selectedMockups, setSelectedMockups] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([
    { id: 'all', name: 'Tous' },
    { id: 'favorites', name: 'Mes favoris' }
  ]);

  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const mockupsQuery = query(
          collection(db, 'mockups'),
          where('active', '==', true)
        );
        const snapshot = await getDocs(mockupsQuery);
        const mockupsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        })) as Mockup[];
        
        // Extract unique categories
        const uniqueCategories = new Set(mockupsData.map(m => m.category));
        setCategories([
          { id: 'all', name: 'Tous' },
          { id: 'favorites', name: 'Mes favoris' },
          ...Array.from(uniqueCategories).map(category => ({
            id: category,
            name: category
          }))
        ]);
        
        setMockups(mockupsData);
      } catch (error) {
        toast.error('Erreur lors du chargement des mockups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockups();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);
          setFavorites(userData.favorites || []);
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        toast.error('Erreur lors du chargement du profil');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleMockupSelection = useCallback((mockupId: string) => {
    if (!userProfile) return;

    const mockupLimit = getPlanMockupLimit(userProfile.subscription.plan);
    
    setSelectedMockups(prev => {
      if (prev.includes(mockupId)) {
        return prev.filter(id => id !== mockupId);
      }
      
      if (prev.length >= mockupLimit) {
        toast.error(`Votre plan ${userProfile.subscription.plan} est limité à ${mockupLimit} mockup${mockupLimit > 1 ? 's' : ''} par génération`);
        return prev;
      }
      
      return [...prev, mockupId];
    });
  }, [userProfile]);

  const filteredMockups = React.useMemo(() => {
    return mockups.filter(mockup => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'favorites') return favorites.includes(mockup.id);
      return mockup.category === selectedCategory;
    });
  }, [mockups, selectedCategory, favorites]);

  const handleGenerate = async () => {
    if (!user || !userProfile) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!designFile) {
      toast.error('Veuillez uploader un design');
      return;
    }

    if (selectedMockups.length === 0) {
      toast.error('Veuillez sélectionner au moins un mockup');
      return;
    }

    const mockupLimit = getPlanMockupLimit(userProfile.subscription.plan);
    if (selectedMockups.length > mockupLimit) {
      toast.error(`Votre plan ${userProfile.subscription.plan} est limité à ${mockupLimit} mockup${mockupLimit > 1 ? 's' : ''} par génération`);
      return;
    }

    if ((userProfile.subscription.credits || 0) < selectedMockups.length) {
      toast.error('Crédits insuffisants');
      return;
    }

    setIsGenerating(true);
    try {
      // Process design file
      const processedDesign = await processDesignFile(designFile);

      // Update credits
      await updateUserCredits(user.uid, selectedMockups.length);
      
      const generationId = nanoid();
      const selectedMockupData = mockups.filter(m => selectedMockups.includes(m.id));
      
      const result = await triggerGenerationWebhook({
        generationId,
        mockupIds: selectedMockups,
        mockupUuids: selectedMockupData.map(m => m.mockupUuid),
        smartObjectUuids: selectedMockupData.map(m => m.smartObjectUuid),
        design: processedDesign
      });

      if (result.success && result.mockups) {
        const generationData = {
          id: generationId,
          userId: user.uid,
          designName: designFile.name,
          mockups: result.mockups,
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'generations'), generationData);
        addGeneration(generationData);
        
        toast.success('Génération réussie !');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la génération des mockups');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {isGenerating && <LoadingAnimation />}

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. Uploadez votre design
        </h2>
        <DesignUploader onUpload={setDesignFile} uploadedFile={designFile} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            2. Sélectionnez vos mockups
          </h2>
          {userProfile && (
            <div className="text-sm text-gray-600">
              {selectedMockups.length} / {getPlanMockupLimit(userProfile.subscription.plan)} mockups sélectionnés
            </div>
          )}
        </div>
        <div className="space-y-6">
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

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
              <p className="text-gray-500">Chargement des mockups...</p>
            </div>
          ) : filteredMockups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {selectedCategory === 'favorites' ? 'Aucun favori' : 'Aucun mockup disponible'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMockups.map((mockup) => (
                <div
                  key={mockup.id}
                  onClick={() => handleMockupSelection(mockup.id)}
                  className={clsx(
                    'group aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative transform hover:scale-105',
                    selectedMockups.includes(mockup.id) && 'ring-2 ring-indigo-600'
                  )}
                >
                  {user && (
                    <FavoriteButton
                      mockupId={mockup.id}
                      userId={user.uid}
                      isFavorite={favorites.includes(mockup.id)}
                    />
                  )}
                  
                  <AspectRatioBadge ratio={mockup.aspectRatio} />
                  
                  {mockup.previewUrl ? (
                    <ImageLoader
                      src={mockup.previewUrl}
                      alt={mockup.name}
                      className="absolute inset-0"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {selectedMockups.includes(mockup.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-20 backdrop-blur-sm">
                      <CheckCircle className="h-12 w-12 text-indigo-600" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="font-medium text-white">{mockup.name}</h3>
                    <p className="text-sm text-gray-200">{mockup.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="container mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-8">
            <div>
              <p className="text-gray-900 font-medium">Crédits disponibles</p>
              <p className="text-2xl font-bold text-indigo-600">{userProfile?.subscription.credits || 0}</p>
            </div>
            {selectedMockups.length > 0 && (
              <div className="bg-gray-50 px-4 py-2 rounded-xl">
                <p className="text-gray-600">Coût de la génération</p>
                <p className="text-xl font-semibold text-gray-900">
                  {selectedMockups.length} crédit{selectedMockups.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleGenerate}
            disabled={
              isGenerating || 
              !designFile || 
              selectedMockups.length === 0 || 
              (userProfile?.subscription.credits || 0) < selectedMockups.length
            }
            className="w-full sm:w-auto gradient-bg text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Génération en cours...
              </span>
            ) : (
              `Générer ${selectedMockups.length > 0 ? `(${selectedMockups.length})` : ''}`
            )}
          </button>
        </div>
      </section>

      {/* Add padding to prevent content from being hidden behind the fixed button */}
      <div className="h-24"></div>
    </div>
  );
}