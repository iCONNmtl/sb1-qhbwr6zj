import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { usePlans } from '../hooks/usePlans';
import { useUserProfile } from '../hooks/useFirestore';
import { Crown, Check, Minus } from 'lucide-react';
import { LoadingSpinner } from '../components/common';
import clsx from 'clsx';

const FEATURES = [
  { name: 'Accès à tous les mockups', starter: true, pro: true, enterprise: true },
  { name: 'Export WEBP / PNG haute qualité', starter: true, pro: true, enterprise: true },
  { name: 'Générations', starter: '≈ 5', pro: '≈ 150', enterprise: "≈ 500" },
  { name: 'Support par email 24/7', starter: true, pro: true, enterprise: true },
  { name: 'Pas de filigrane', starter: true, pro: true, enterprise: true },
  { name: 'Personnalisation des mockups', starter: true, pro: true, enterprise: true },
  { name: 'Générations simultanées', starter: '1', pro: '10', enterprise: '15' },
  { name: 'Ajouter vos mockup PSD', starter: false, pro: true, enterprise: true },
  { name: 'Accès au Pixmock Club', starter: false, pro: false, enterprise: true },
];

export default function Pricing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const { plans, loading: plansLoading } = usePlans();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);

  const handlePlanSelection = (planId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    // Liens de paiement Stripe directs
    const stripeLinks = {
      pro: 'https://buy.stripe.com/28o9Dwgt22UbeaYfZ1',
      expert: 'https://buy.stripe.com/fZeaHA4Kk7ar8QE9AC'
    };

    const checkoutUrl = `${stripeLinks[planId as keyof typeof stripeLinks]}?client_reference_id=${user.uid}`;
    window.open(checkoutUrl, '_blank');
  };

  if (plansLoading || profileLoading) {
    return <LoadingSpinner message="Chargement des plans..." />;
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez votre pack de crédits
        </h1>
        <p className="text-xl text-gray-600">
          Des packs adaptés à vos besoins, sans engagement
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

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
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
              <span className="text-xl">$</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Sans engagement</p>
              <p className="text-sm text-gray-600">Pas d'abonnement • Achat unique • Durée illimitée</p>
            </div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-2xl bg-white shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
          {/* Popular Badge */}
          <div className="absolute top-0 right-8 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-b-lg shadow-lg">
            Populaire
          </div>

          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-white/80">Idéal pour un usage occasionnel</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Credits */}
            <div className="flex items-center gap-3 mb-8">
              <div className="text-6xl font-bold text-purple-600">750</div>
              <div className="text-xl text-gray-600">crédits</div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold">19</span>
              <span className="text-xl">$</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Sans engagement</p>
              <p className="text-sm text-gray-600">Pas d'abonnement • Achat unique • Durée illimitée</p>
            </div>

            {/* Button */}
            <button 
              onClick={() => handlePlanSelection('pro')}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition mt-8"
            >
              {user ? 'Acheter maintenant' : 'Commencer'}
            </button>
          </div>
        </div>

        {/* Expert Plan */}
        <div className="relative rounded-2xl bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-50 border-b border-gray-100">
            <h3 className="text-2xl font-bold mb-2">Expert</h3>
            <p className="text-gray-600">Conçu pour les experts du quotidien</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Credits */}
            <div className="flex items-center gap-3 mb-8">
              <div className="text-6xl font-bold text-purple-600">2500</div>
              <div className="flex flex-col">
                <div className="text-xl text-gray-600">crédits</div>
                <div className="mt-1 px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                  +25% Offert
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold">49</span>
              <span className="text-xl">$</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Sans engagement</p>
              <p className="text-sm text-gray-600">Pas d'abonnement • Achat unique • Durée illimitée</p>
            </div>

            {/* Button */}
            <button 
              onClick={() => handlePlanSelection('expert')}
              className="w-full py-3 px-4 bg-black text-white rounded-xl hover:bg-black/90 transition mt-8"
            >
              {user ? 'Acheter maintenant' : 'Commencer'}
            </button>
          </div>
        </div>
      </div>

      {/* Features Table */}
      <div className="rounded-2xl bg-black/5 p-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="font-medium">Fonctionnalités</div>
          <div className="text-center font-medium">Basic</div>
          <div className="text-center font-medium">Pro</div>
          <div className="text-center font-medium">Expert</div>

          {FEATURES.map((feature, index) => (
            <React.Fragment key={feature.name}>
              <div className={clsx(
                "py-4",
                index !== FEATURES.length - 1 && "border-b border-black/10"
              )}>
                {feature.name}
              </div>
              <div className={clsx(
                "flex justify-center items-center",
                index !== FEATURES.length - 1 && "border-b border-black/10"
              )}>
                {typeof feature.starter === 'boolean' ? (
                  feature.starter ? <Check className="h-5 w-5 text-purple-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                ) : (
                  feature.starter
                )}
              </div>
              <div className={clsx(
                "flex justify-center items-center",
                index !== FEATURES.length - 1 && "border-b border-black/10"
              )}>
                {typeof feature.pro === 'boolean' ? (
                  feature.pro ? <Check className="h-5 w-5 text-purple-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                ) : (
                  feature.pro
                )}
              </div>
              <div className={clsx(
                "flex justify-center items-center",
                index !== FEATURES.length - 1 && "border-b border-black/10"
              )}>
                {typeof feature.enterprise === 'boolean' ? (
                  feature.enterprise ? <Check className="h-5 w-5 text-purple-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                ) : (
                  feature.enterprise
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Des questions ? {" "}
          <a href="mailto:contact@pixmock.com" className="text-purple-600 hover:text-purple-500">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}