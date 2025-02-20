import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Play, Crown, ChevronLeft, Lock, Star, CreditCard } from 'lucide-react';
import { LoadingSpinner } from '../components/common';
import { useTrainingAccess } from '../hooks/useTrainingAccess';
import PurchaseTrainingDialog from '../components/training/PurchaseTrainingDialog';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Training } from '../types/training';

export default function TrainingDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useStore();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  
  const { hasAccess, loading: accessLoading, userProfile } = useTrainingAccess(user?.uid, id);

  useEffect(() => {
    const fetchTraining = async () => {
      if (!id) return;

      try {
        const trainingDoc = await getDoc(doc(db, 'trainings', id));
        if (!trainingDoc.exists()) {
          toast.error('Formation non trouvée');
          return;
        }

        setTraining({ ...trainingDoc.data(), id: trainingDoc.id } as Training);
      } catch (error) {
        console.error('Error fetching training:', error);
        toast.error('Erreur lors du chargement de la formation');
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  if (loading || accessLoading) {
    return <LoadingSpinner message="Chargement de la formation..." />;
  }

  if (!training) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Formation non trouvée</p>
        <Link to="/training" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Retour aux formations
        </Link>
      </div>
    );
  }

  const currentSection = training.sections[activeSection];
  const canAccess = training.access === 'free' || hasAccess;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        to="/training"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Retour aux formations
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Section */}
          {currentSection.videoUrl ? (
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              {canAccess ? (
                <iframe
                  src={currentSection.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <Lock className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Contenu Premium
                  </h3>
                  {user ? (
                    <button
                      onClick={() => setShowPurchaseDialog(true)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Acheter ({training.credits} crédits)
                    </button>
                  ) : (
                    <>
                      <p className="text-white/80 mb-4">
                        Connectez-vous pour accéder à cette formation
                      </p>
                      <Link
                        to="/signup"
                        className="px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Créer un compte
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-2xl" />
          )}

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {training.title}
            </h1>
            
            {canAccess ? (
              <div className="prose prose-indigo max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Contenu Premium
                </h3>
                {user ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Achetez cette formation pour accéder au contenu complet
                    </p>
                    <button
                      onClick={() => setShowPurchaseDialog(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Acheter ({training.credits} crédits)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Connectez-vous pour accéder au contenu complet
                    </p>
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Créer un compte
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Training Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {training.access === 'premium' ? (
                  <div className="flex items-center text-amber-600">
                    <Crown className="h-5 w-5 mr-2" />
                    <span className="font-medium">{training.credits} crédits</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Gratuit
                  </div>
                )}
              </div>
              <div className="flex items-center text-gray-500">
                <Play className="h-5 w-5 mr-2" />
                {training.sections.length} section{training.sections.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-4">
              {training.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => canAccess && setActiveSection(index)}
                  className={clsx(
                    'w-full p-4 rounded-xl text-left transition-colors',
                    activeSection === index
                      ? 'bg-indigo-600 text-white'
                      : canAccess
                      ? 'hover:bg-gray-50'
                      : 'opacity-50 cursor-not-allowed',
                    'group'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">
                      {section.title}
                    </h3>
                    {!canAccess && (
                      <Lock className={clsx(
                        'h-4 w-4',
                        activeSection === index ? 'text-white' : 'text-gray-400'
                      )} />
                    )}
                  </div>
                  {section.videoUrl && (
                    <div className={clsx(
                      'flex items-center text-sm',
                      activeSection === index ? 'text-white/80' : 'text-gray-500'
                    )}>
                      <Play className="h-4 w-4 mr-1" />
                      Vidéo disponible
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Premium CTA */}
          {training.access === 'premium' && !canAccess && user && (
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-6 text-white">
              <Crown className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Formation Premium
              </h3>
              <p className="text-white/90 mb-4">
                Accédez à cette formation pour seulement {training.credits} crédits
              </p>
              <button
                onClick={() => setShowPurchaseDialog(true)}
                className="w-full py-3 px-4 bg-white text-amber-600 rounded-lg text-center hover:bg-amber-50 transition-colors flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Acheter maintenant
              </button>
            </div>
          )}

          {training.access === 'premium' && !user && (
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-6 text-white">
              <Crown className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Formation Premium
              </h3>
              <p className="text-white/90 mb-4">
                Créez votre compte pour accéder à cette formation et bien plus encore
              </p>
              <Link
                to="/signup"
                className="block w-full py-3 px-4 bg-white text-amber-600 rounded-lg text-center hover:bg-amber-50 transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Dialog */}
      {showPurchaseDialog && user && userProfile && (
        <PurchaseTrainingDialog
          trainingId={training.id}
          title={training.title}
          credits={training.credits}
          userId={user.uid}
          availableCredits={userProfile.subscription.credits}
          onClose={() => setShowPurchaseDialog(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}