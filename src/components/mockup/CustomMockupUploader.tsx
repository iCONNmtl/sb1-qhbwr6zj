import React, { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { createCustomMockup, initializeCustomMockup } from '../../services/customMockupService';
import { useSubscriptionStatus } from '../../hooks/useSubscriptionStatus';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CustomMockupUploaderProps {
  userId: string;
}

export default function CustomMockupUploader({ userId }: CustomMockupUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [mockupId, setMockupId] = useState<string>();
  const [driveUrl, setDriveUrl] = useState<string>();
  const { subscription } = useSubscriptionStatus(userId);

  const isPremium = subscription?.plan === 'Pro' || subscription?.plan === 'Expert';

  const handleInitialize = async () => {
    if (!isPremium) return;
    
    setLoading(true);
    try {
      const result = await initializeCustomMockup(userId);
      setMockupId(result.mockupId);
      setDriveUrl(result.driveUrl);
      
      // Ouvrir le dossier Drive dans un nouvel onglet
      window.open(result.driveUrl, '_blank');
      
      toast.success('Dossier créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création du dossier');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!mockupId) return;
    
    setLoading(true);
    try {
      await createCustomMockup(mockupId);
      toast.success('Mockup créé avec succès');
      setMockupId(undefined);
      setDriveUrl(undefined);
    } catch (error) {
      toast.error('Erreur lors de la création du mockup');
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fonctionnalité Premium
          </h3>
          <p className="text-gray-600 mb-6">
            L'ajout de mockups personnalisés est réservé aux plans Pro et Expert.
            Passez à un plan supérieur pour débloquer cette fonctionnalité.
          </p>
          <Link
            to="/pricing"
            className="w-full inline-flex items-center justify-center px-6 py-3 gradient-bg text-white rounded-xl hover:opacity-90 transition"
          >
            Voir les plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Step 1: Initialize */}
        {!mockupId && (
          <button
            onClick={handleInitialize}
            disabled={loading}
            className="w-full h-32 flex flex-col items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <span>Création du dossier...</span>
              </>
            ) : (
              <>
                <span className="text-lg font-medium">Étape 1 : Créer le dossier</span>
                <span className="text-sm text-indigo-200 mt-1">Un dossier Google Drive sera créé pour vous</span>
              </>
            )}
          </button>
        )}

        {/* Step 2: Create Mockup */}
        {mockupId && (
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-sm text-indigo-900">
                Dossier créé ! Déposez votre PSD dans le dossier Google Drive puis cliquez sur le bouton ci-dessous.
              </p>
              {driveUrl && (
                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                >
                  Ouvrir le dossier
                </a>
              )}
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full h-32 flex flex-col items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <span>Création du mockup...</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-medium">Étape 2 : Créer le mockup</span>
                  <span className="text-sm text-indigo-200 mt-1">Cliquez ici une fois votre PSD déposé</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}