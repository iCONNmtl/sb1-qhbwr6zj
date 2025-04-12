import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CustomMockupInstructions from '../components/mockup/CustomMockupInstructions';
import CustomMockupUploader from '../components/mockup/CustomMockupUploader';
import AuthGuard from '../components/AuthGuard';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserProfile } from '../types/user';

export default function CustomMockup() {
  const { user } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const isExpertPlan = userProfile?.subscription?.plan === 'Expert';

  return (
    <AuthGuard>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Créer votre propre mockup
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : isExpertPlan ? (
          // Vertical stack layout for Expert users
          <div className="space-y-8">
            <CustomMockupInstructions />
            <CustomMockupUploader userId={user?.uid || ''} />
          </div>
        ) : (
          // Restricted content for non-Expert users
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 text-white shadow-md">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white/20 rounded-xl">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Crown className="h-6 w-6 mr-2" />
                  Fonctionnalité réservée au plan Expert
                </h2>
                <p className="text-lg mb-6">
                  La création de mockups personnalisés est une fonctionnalité avancée qui vous permet de créer vos propres templates de mockups pour des besoins spécifiques.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Avec cette fonctionnalité, vous pourrez :</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Créer des mockups sur mesure pour vos produits
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Utiliser vos propres fichiers PSD
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Obtenir des mockups exclusifs pour votre marque
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Générer des mockups illimités à partir de vos templates
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Avantages du plan Expert :</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        500 crédits par mois
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Création de mockups personnalisés
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Personnalisation avancée des textes
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
                        Statistiques détaillées des ventes
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-6 py-3 bg-white text-amber-600 rounded-xl hover:bg-amber-50 transition-colors text-lg font-medium"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Passer au plan Expert
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}