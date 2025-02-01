import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { ShoppingBag, Camera, BookmarkIcon, Share2, Loader2, Eye, Download, Shuffle, Instagram, Image as ImageIcon, Calendar, Plus } from 'lucide-react';
import ImageLoader from '../components/ImageLoader';
import MockupPreviewModal from '../components/mockup/MockupPreviewModal';
import SchedulePostDialog from '../components/scheduling/SchedulePostDialog';
import { downloadImage } from '../utils/download';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import type { UserProfile, PlatformAccount } from '../types/user';

export default function Dashboard() {
  const { user, generations } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>([]);
  const [selectedPlatformAccounts, setSelectedPlatformAccounts] = useState<string[]>([]);
  const [platformData, setPlatformData] = useState<Record<string, any>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewMockup, setPreviewMockup] = useState<{id: string; name: string; url: string} | null>(null);
  const [selectedMockups, setSelectedMockups] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'instagram' | 'pinterest'>('all');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [randomCount, setRandomCount] = useState<number>(1);

  const isAdmin = user?.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2';

  // Get all mockups from all generations
  const allMockups = generations.flatMap(generation => generation.mockups);

  // Calculate counts for each category
  const categoryCounts = {
    all: allMockups.length,
    instagram: allMockups.filter(m => m.platform === 'instagram').length,
    pinterest: allMockups.filter(m => m.platform === 'pinterest').length
  };

  // Filter mockups based on selected category
  const filteredMockups = allMockups.filter(mockup => 
    selectedCategory === 'all' ? true : mockup.platform === selectedCategory
  );

// Dans useEffect au début du composant Dashboard
useEffect(() => {
  if (!user) return;

  const unsubscribe = onSnapshot(
    query(
      collection(db, 'generations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ),
    (snapshot) => {
      const generationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Generation[];
      setGenerations(generationsData);
    }
  );

  return () => unsubscribe();
}, [user]);


  const handleDownload = async (mockup: { name: string; url: string }) => {
    try {
      await downloadImage(mockup.url, mockup.name);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const togglePlatformAccount = (accountId: string) => {
    setSelectedPlatformAccounts(prev => {
      const isSelected = prev.includes(accountId);
      if (isSelected) {
        const newPlatformData = { ...platformData };
        delete newPlatformData[accountId];
        setPlatformData(newPlatformData);
        return prev.filter(id => id !== accountId);
      } else {
        setPlatformData(prev => ({
          ...prev,
          [accountId]: { accountId }
        }));
        return [...prev, accountId];
      }
    });
  };

  const handlePlatformDataChange = (accountId: string, field: string, value: string) => {
    setPlatformData(prev => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        [field]: value
      }
    }));
  };

  const validatePlatformData = (): boolean => {
    for (const accountId of selectedPlatformAccounts) {
      const account = userProfile?.platformAccounts?.find(a => a.id === accountId);
      if (!account) continue;

      if (['etsy', 'shopify'].includes(account.platform) && !platformData[accountId]?.productId) {
        toast.error(`Veuillez entrer l'ID produit pour ${account.name}`);
        return false;
      }
      if (['instagram', 'pinterest'].includes(account.platform) && !platformData[accountId]?.content) {
        toast.error(`Veuillez entrer le contenu pour ${account.name}`);
        return false;
      }
    }
    return true;
  };

  const handlePublish = async () => {
    if (selectedPlatformAccounts.length === 0 || selectedMockups.length === 0) return;
    if (!validatePlatformData()) return;

    setIsPublishing(true);
    try {
      const selectedMockupData = generations
        .flatMap(gen => gen.mockups)
        .filter(mockup => selectedMockups.includes(mockup.id));

      // Transformer les données pour le webhook
      const platformsData = await Promise.all(selectedPlatformAccounts.map(async accountId => {
        const account = userProfile?.platformAccounts?.find(a => a.id === accountId);
        const data = platformData[accountId];

        // Si c'est un compte Pinterest, ajouter les tokens
        let authData = {};
        if (account?.platform === 'pinterest' && userProfile?.pinterestAuth?.tokens) {
          const tokens = JSON.parse(atob(userProfile.pinterestAuth.tokens));
          authData = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token
          };
        }

        return {
          accountId,
          platform: account?.platform,
          name: account?.name,
          ...data,
          ...authData
        };
      }));

      const response = await fetch('https://hook.eu1.make.com/1brcdh36omu22jrtb06fwrpkb39nkw9b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mockups: selectedMockupData,
          platforms: platformsData,
          userId: user?.uid
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la publication');
      }

      toast.success('Publication en cours de traitement');
      setSelectedMockups([]);
      setSelectedPlatformAccounts([]);
      setPlatformData({});
    } catch (error) {
      console.error('Error publishing mockups:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Vos générations
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={filteredMockups.length}
                value={randomCount}
                onChange={(e) => setRandomCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), filteredMockups.length))}
                className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center"
              />
              <button
                onClick={() => {
                  const shuffled = [...filteredMockups]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, randomCount);
                  setSelectedMockups(shuffled.map(m => m.id));
                }}
                className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Random
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {allMockups.length} mockup{allMockups.length > 1 ? 's' : ''} généré{allMockups.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', name: 'Tous', icon: ImageIcon },
            { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
            { id: 'pinterest', name: 'Pinterest', icon: BookmarkIcon, color: 'bg-red-500' }
          ].map((category) => {
            const Icon = category.icon;
            const count = categoryCounts[category.id as keyof typeof categoryCounts];

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'all' | 'instagram' | 'pinterest')}
                className={clsx(
                  'flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200',
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
                <span className={clsx(
                  'inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium rounded-full',
                  selectedCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filteredMockups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucune génération pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMockups.map((mockup) => (
              <div
                key={mockup.id}
                onClick={() => setSelectedMockups(prev => 
                  prev.includes(mockup.id)
                    ? prev.filter(id => id !== mockup.id)
                    : [...prev, mockup.id]
                )}
                className={clsx(
                  "group relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg",
                  selectedMockups.includes(mockup.id) && "ring-4 ring-indigo-600 scale-95 hover:scale-100"
                )}
              >
                {/* Platform Badge */}
                {mockup.platform && (
                  <div className={clsx(
                    'absolute top-2 right-2 z-10 px-2 py-1 rounded-lg text-xs font-medium text-white',
                    mockup.platform === 'instagram' ? 'bg-pink-500' : 'bg-red-500'
                  )}>
                    {mockup.platform === 'instagram' ? 'Instagram' : 'Pinterest'}
                  </div>
                )}

                <ImageLoader
                  src={mockup.url}
                  alt={mockup.name}
                  className="absolute inset-0 object-cover w-full h-full"
                />
                
                {selectedMockups.includes(mockup.id) && (
                  <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm" />
                )}

                <div className={clsx(
                  "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100",
                  "flex items-center justify-center gap-4 transition-all duration-300"
                )}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewMockup(mockup);
                    }}
                    className="p-2 bg-white text-gray-600 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(mockup);
                    }}
                    className="p-2 bg-white text-gray-600 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Publication - Visible uniquement pour l'admin */}
      {isAdmin && selectedMockups.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Publier sur
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userProfile?.platformAccounts?.map(account => (
                <button
                  key={account.id}
                  onClick={() => togglePlatformAccount(account.id)}
                  className={clsx(
                    'flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200',
                    selectedPlatformAccounts.includes(account.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {React.createElement(
                      account.platform === 'instagram' ? Instagram :
                      account.platform === 'pinterest' ? BookmarkIcon :
                      ShoppingBag,
                      { className: "h-5 w-5 text-gray-500" }
                    )}
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-500">{
                        account.platform.charAt(0).toUpperCase() + account.platform.slice(1)
                      }</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Champs spécifiques aux plateformes */}
            {selectedPlatformAccounts.length > 0 && (
              <div className="space-y-4 mt-4">
                {selectedPlatformAccounts.map(accountId => {
                  const account = userProfile?.platformAccounts?.find(a => a.id === accountId);
                  if (!account) return null;

                  const requiresProductId = ['etsy', 'shopify'].includes(account.platform);
                  const requiresContent = ['instagram', 'pinterest'].includes(account.platform);

                  return (
                    <div key={accountId} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {requiresProductId ? (
                          `ID produit - ${account.name}`
                        ) : (
                          `Contenu - ${account.name}`
                        )}
                      </label>
                      {requiresProductId ? (
                        <input
                          type="text"
                          value={platformData[accountId]?.productId || ''}
                          onChange={(e) => handlePlatformDataChange(accountId, 'productId', e.target.value)}
                          placeholder={`Entrez l'ID produit pour ${account.name}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <textarea
                          value={platformData[accountId]?.content || ''}
                          onChange={(e) => handlePlatformDataChange(accountId, 'content', e.target.value)}
                          placeholder={`Écrivez votre contenu pour ${account.name}`}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {selectedMockups.length} mockup{selectedMockups.length > 1 ? 's' : ''} sélectionné{selectedMockups.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowScheduleDialog(true)}
                disabled={selectedPlatformAccounts.length === 0 || selectedMockups.length === 0}
                className="flex items-center px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Programmer
              </button>
              <button
                onClick={handlePublish}
                disabled={selectedPlatformAccounts.length === 0 || selectedMockups.length === 0 || isPublishing}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Share2 className="h-5 w-5 mr-2" />
                    Publier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewMockup && (
        <MockupPreviewModal
          mockup={previewMockup}
          onClose={() => setPreviewMockup(null)}
          onDownload={() => handleDownload(previewMockup)}
        />
      )}

      {showScheduleDialog && user && (
        <SchedulePostDialog
          userId={user.uid}
          mockups={generations
            .flatMap(gen => gen.mockups)
            .filter(mockup => selectedMockups.includes(mockup.id))
          }
          platforms={selectedPlatformAccounts.map(accountId => ({
            platform: userProfile?.platformAccounts?.find(a => a.id === accountId)?.platform,
            ...platformData[accountId]
          }))}
          onClose={() => {
            setShowScheduleDialog(false);
            setSelectedMockups([]);
            setSelectedPlatformAccounts([]);
            setPlatformData({});
          }}
        />
      )}
    </div>
  );
}