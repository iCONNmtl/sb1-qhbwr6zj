import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { usePlans } from '../hooks/usePlans';
import { useUserProfile } from '../hooks/useFirestore';
import { Crown, Check, Minus, Loader2, CreditCard, Zap, Star, Sparkles, Info } from 'lucide-react';
import { LoadingSpinner } from '../components/common';
import clsx from 'clsx';

const FEATURES = [
  { name: 'Accès à tous les mockups', basic: true, expert: true },
  { name: 'Export PNG haute qualité', basic: true, expert: true },
  { name: 'Export WEBP haute qualité', basic: false, expert: true },
  { name: 'Support par email 24/7', basic: true, expert: true },
  { name: 'Pas de filigrane', basic: true, expert: true },
  { name: 'Personnalisation des mockups', basic: true, expert: true },
  { name: 'Générations simultanées', basic: '1', expert: '15' },
  { name: 'Accès au Pixmock Club', basic: false, expert: true },
];

// Packs de crédits
const CREDIT_PACKS = [
  { id: 'pack1', name: 'Starter', credits: 750, price: 19, popular: false, unitPrice: 0.025 },
  { id: 'pack2', name: 'Standard', credits: 2000, price: 49, popular: true, unitPrice: 0.0245 },
  { id: 'pack3', name: 'Pro', credits: 4000, price: 99, popular: false, unitPrice: 0.0248 },
  { id: 'pack4', name: 'Expert', credits: 6500, price: 149, popular: false, unitPrice: 0.0229 },
];

export default function Pricing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const { plans, loading: plansLoading } = usePlans();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  const [loading, setLoading] = useState(false);

  const handlePlanSelection = (planId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    setLoading(true);

    // Liens de paiement Stripe
    const stripeLinks = {
      pack1: 'https://buy.stripe.com/test_14k7vfbb25j8c929AA',
      pack2: 'https://buy.stripe.com/test_14k7vfbb25j8c929AA',
      pack3: 'https://buy.stripe.com/test_14k7vfbb25j8c929AA',
      pack4: 'https://buy.stripe.com/test_14k7vfbb25j8c929AA',
      expert: 'https://buy.stripe.com/aEU3f83Gg9iz5EsfZ2' // Lien d'abonnement Expert
    };

    // Construire l'URL de paiement
    let checkoutUrl = '';
    if (planId === 'expert') {
      checkoutUrl = `${stripeLinks.expert}?client_reference_id=${user.uid}`;
    } else {
      checkoutUrl = `${stripeLinks[planId as keyof typeof stripeLinks]}?client_reference_id=${user.uid}`;
    }

    window.open(checkoutUrl, '_blank');
    setLoading(false);
  };

  if (plansLoading || profileLoading) {
    return <LoadingSpinner message="Chargement des plans..." />;
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez votre formule
        </h1>
        <p className="text-xl text-gray-600">
          Des offres adaptées à vos besoins
        </p>
      </div>

      {userProfile && (
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plan {userProfile.subscription.plan}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {userProfile.subscription.credits || 0} crédit{(userProfile.subscription.credits || 0) > 1 ? 's' : ''} disponible{(userProfile.subscription.credits || 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {userProfile.subscription.plan === 'Basic' && (
                <p className="text-sm text-purple-600 font-medium">
                  Passez à un plan supérieur pour plus de crédits
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Abonnements */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Abonnements</h2>
          <p className="text-gray-600 mt-2">Accès continu avec renouvellement automatique</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="relative rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-50 border-b border-gray-100">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-gray-600">Parfait pour découvrir</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Credits */}
              <div className="flex items-center gap-3 mb-8">
                <div className="text-6xl font-bold text-purple-600">25</div>
                <div className="text-xl text-gray-600">crédits</div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">0</span>
                <span className="text-xl">€</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Sans engagement</p>
                <p className="text-sm text-gray-600">Pas d'abonnement • Achat unique • Durée illimitée</p>
              </div>
            </div>
          </div>

          {/* Expert Plan */}
          <div className="relative rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-8 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-2">Expert</h3>
              <p className="text-white/80">Conçu pour les experts du quotidien</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Credits */}
              <div className="flex items-center gap-3 mb-8">
                <div className="text-6xl font-bold text-purple-600">500</div>
                <div className="flex flex-col">
                  <div className="text-xl text-gray-600">crédits</div>
                  <div className="mt-1 px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                    par mois
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">49</span>
                <span className="text-xl">€</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Abonnement mensuel</p>
                <p className="text-sm text-gray-600">Annulable à tout moment</p>
              </div>

              {/* Button */}
              <button 
                onClick={() => handlePlanSelection('expert')}
                disabled={loading}
                className="w