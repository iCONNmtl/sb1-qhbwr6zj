import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { ShoppingBag, Camera, BookmarkIcon, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { UserProfile } from '../types/user';

const PLATFORMS = [
  { id: 'etsy', label: 'Etsy', icon: <ShoppingBag className="h-5 w-5" /> },
  { id: 'shopify', label: 'Shopify', icon: <ShoppingBag className="h-5 w-5" /> },
  { id: 'pinterest', label: 'Pinterest', icon: <BookmarkIcon className="h-5 w-5" /> },
  { id: 'instagram', label: 'Instagram', icon: <Camera className="h-5 w-5" /> },
];

export default function Settings() {
  const { user } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserProfile;
          setUserProfile(data);
          setEnabledPlatforms(data.enabledPlatforms || PLATFORMS.map(p => p.id));
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const togglePlatform = (platformId: string) => {
    setEnabledPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        enabledPlatforms
      });
      toast.success('Paramètres enregistrés');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Paramètres
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Plateformes de publication
          </h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez les plateformes que vous souhaitez voir apparaître dans le tableau de bord
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {PLATFORMS.map(platform => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                  enabledPlatforms.includes(platform.id)
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {platform.icon}
                  <span className="font-medium text-gray-900">
                    {platform.label}
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  enabledPlatforms.includes(platform.id)
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-300'
                }`}>
                  {enabledPlatforms.includes(platform.id) && (
                    <svg className="w-full h-full text-white p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}