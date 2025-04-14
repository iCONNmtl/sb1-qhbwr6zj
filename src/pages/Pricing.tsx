import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { usePlans } from '../hooks/usePlans';
import { useUserProfile } from '../hooks/useFirestore';
import { Crown, Check, Minus, Loader2, CreditCard, Zap, Star, Sparkles, Info, HelpCircle, ChevronDown, ChevronUp, X, AlertCircle, Gift } from 'lucide-react';
import { LoadingSpinner } from '../components/common';
import { cancelSubscription } from '../utils/subscription';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const FEATURES = [
  { name: 'Accès à tous les mockups', basic: true, expert: true },
  { name: 'Export PNG et WEBP', basic: true, expert: true },
  { name: 'Support 24/7', basic: true, expert: true },
  { name: 'Pas de filigrane', basic: true, expert: true },
  { name: 'Générations simultanées', basic: '1', expert: '15' },
  { name: 'Création de design', basic: true, expert: true },
  { name: 'Traitement des commandes', basic: true, expert: true },
  { name: 'Configuration de produits', basic: false, expert: true },
  { name: 'Fiche Produit', basic: 'Basic', expert: 'Optimisé SEO' },
  { name: 'Personnalisation des mockups', basic: false, expert: true },
  { name: 'Bonus crédits packs', basic: false, expert: '+10%' },
  { name: 'Statistique des ventes', basic: false, expert: true },
];

// Packs de crédits
const CREDIT_PACKS = [
  { id: 'pack1', name: 'Starter', credits: 750, price: 19, popular: false, unitPrice: 0.025 },
  { id: 'pack2', name: 'Standard', credits: 2000, price: 49, popular: true, unitPrice: 0.0245 },
  { id: 'pack3', name: 'Pro', credits: 4000, price: 99, popular: false, unitPrice: 0.0248 },
  { id: 'pack4', name: 'Expert', credits: 6500, price: 149, popular: false, unitPrice: 0.0229 },
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "Comment fonctionnent les crédits ?",
    answer: "Chaque génération de mockup consomme un certain nombre de crédits. Les crédits sont disponibles immédiatement après l'achat et n'expirent jamais. Vous pouvez les utiliser à votre rythme, sans contrainte de temps."
  },
  {
    question: "Quelle est la différence entre les packs et l'abonnement ?",
    answer: "Les packs de crédits sont des achats uniques sans engagement, idéaux pour une utilisation ponctuelle. L'abonnement Expert offre un renouvellement mensuel automatique de 500 crédits, parfait pour une utilisation régulière."
  },
  {
    question: "Puis-je acheter plusieurs packs ?",
    answer: "Oui, vous pouvez acheter autant de packs que vous le souhaitez. Les crédits s'accumulent dans votre compte et sont utilisés selon vos besoins."
  },
  {
    question: "Comment fonctionne le paiement ?",
    answer: "Le paiement est sécurisé via Stripe. Vous pouvez payer par carte bancaire. Les packs sont activés instantanément après le paiement, tandis que l'abonnement Expert est renouvelé automatiquement chaque mois."
  },
  {
    question: "Les crédits expirent-ils ?",
    answer: "Non, les crédits achetés via les packs n'expirent jamais. Vous pouvez les utiliser à votre rythme. Pour l'abonnement Expert, vous recevez 500 nouveaux crédits chaque mois."
  },
  {
    question: "Puis-je me faire rembourser ?",
    answer: "Les crédits non utilisés peuvent être remboursés dans les 14 jours suivant l'achat, conformément à nos conditions générales de vente. L'abonnement Expert peut être annulé à tout moment."
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, le prix affiché est le prix final. Pas d'abonnement caché, pas de frais supplémentaires. Vous ne payez que ce que vous achetez."
  },
  {
    question: "Comment utiliser mes crédits ?",
    answer: "Vos crédits sont automatiquement déduits lorsque vous générez des mockups, achetez des formations premium ou traitez des commandes. Vous pouvez suivre votre solde de crédits dans votre tableau de bord."
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-lg text-gray-600">
          Tout ce que vous devez savoir sur nos produits d'impression
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="py-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-start justify-between text-left"
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              <span className="ml-6 flex-shrink-0">
                {openIndex === index ? (
                  <ChevronUp className="h-6 w-6 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-indigo-500" />
                )}
              </span>
            </button>
            <div
              className={clsx(
                'mt-2 pr-12 transition-all duration-300',
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              )}
            >
              <p className="text-base text-gray-600">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Vous ne trouvez pas la réponse à votre question ? Contactez notre support
        </p>
      </div>
    </div>
  );
}

export default function Pricing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const { plans, loading: plansLoading } = usePlans();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const isExpertPlan = userProfile?.subscription?.plan === 'Expert';
  const subscriptionEndDate = userProfile?.subscription?.endDate 
    ? new Date(userProfile.subscription.endDate) 
    : undefined;

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

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setCancelLoading(true);
    try {
      await cancelSubscription(user.uid);
      toast.success('Votre abonnement a été annulé avec succès');
      setShowCancelDialog(false);
      // Reload user profile to update UI
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Une erreur est survenue lors de l\'annulation de votre abonnement');
    } finally {
      setCancelLoading(false);
    }
  };

  // Calcul du bonus pour les utilisateurs Expert
  const calculateExpertBonus = (packCredits: number) => {
    if (isExpertPlan) {
      const bonusCredits = Math.round(packCredits * 0.1);
      return {
        totalCredits: packCredits + bonusCredits,
        bonusCredits
      };
    }
    return {
      totalCredits: packCredits,
      bonusCredits: 0
    };
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className={clsx(
                  "p-3 rounded-xl",
                  isExpertPlan ? "bg-amber-100" : "bg-indigo-100"
                )}>
                  {isExpertPlan ? (
                    <Crown className="h-6 w-6 text-amber-600" />
                  ) : (
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Plan {userProfile.subscription.plan}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <p className="text-sm text-gray-600">
                      {userProfile.subscription.credits || 0} crédit{(userProfile.subscription.credits || 0) > 1 ? 's' : ''} disponible{(userProfile.subscription.credits || 0) > 1 ? 's' : ''}
                    </p>
                    {isExpertPlan && subscriptionEndDate && (
                      <p className="text-sm text-amber-600">
                        Prochain renouvellement le {subscriptionEndDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {isExpertPlan && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Annuler mon abonnement
                </button>
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

        <div className="grid md:grid-cols-2 gap-8">
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
            <div className="p-8 bg-gradient-to-r from-amber-500 to-amber-600 border-b border-amber-600">
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
              {isExpertPlan ? (
                <button 
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full py-3 px-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition mt-8 flex items-center justify-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Annuler mon abonnement
                </button>
              ) : (
                <button 
                  onClick={() => handlePlanSelection('expert')}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-black text-white rounded-xl hover:bg-black/90 transition mt-8 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      {user ? 'S\'abonner maintenant' : 'Commencer'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Table */}
      <div className="rounded-2xl bg-black/5 p-8 mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Comparaison des fonctionnalités</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="font-medium">Fonctionnalités</div>
          <div className="text-center font-medium">Basic</div>
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
                {typeof feature.basic === 'boolean' ? (
                  feature.basic ? <Check className="h-5 w-5 text-purple-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                ) : (
                  feature.basic
                )}
              </div>
              <div className={clsx(
                "flex justify-center items-center",
                index !== FEATURES.length - 1 && "border-b border-black/10"
              )}>
                {typeof feature.expert === 'boolean' ? (
                  feature.expert ? <Check className="h-5 w-5 text-purple-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                ) : (
                  feature.expert
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Section Packs de crédits */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Packs de crédits complémentaires</h2>
          <p className="text-gray-600 mt-2">Achat unique sans engagement • Crédits permanents</p>
          {isExpertPlan && (
            <div className="mt-2 inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full">
              <span className="font-medium">+10% de crédits bonus avec votre plan Expert</span>
            </div>
          )}
        </div>

        {/* Packs de crédits sur 2 lignes même sur grand écran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CREDIT_PACKS.map((pack) => {
            const { totalCredits, bonusCredits } = calculateExpertBonus(pack.credits);
            
            return (
              <div 
                key={pack.id}
                className={clsx(
                  "relative rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md",
                  pack.popular && "ring-2 ring-indigo-600 transform hover:scale-105"
                )}
              >
                {pack.popular && (
                  <div className="absolute top-0 right-8 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-b-lg shadow-lg">
                    Populaire
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pack.name}</h3>
                  
                  {/* Credits */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-3xl font-bold text-purple-600">{totalCredits}</div>
                    <div className="text-sm text-gray-600">crédits</div>
                    {bonusCredits > 0 && (
                      <div className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium rounded-full flex items-center">
                        <Gift className="h-3 w-3 mr-1" />
                        +{bonusCredits} bonus
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold">{pack.price}</span>
                    <span className="text-base">€</span>
                  </div>
                  
                  {/* Unit price */}
                  <div className="flex items-center mb-4">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      {(pack.price / totalCredits).toFixed(3)}€ par crédit
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Sans engagement • Achat unique • Crédits permanents
                  </div>

                  {/* Button */}
                  <button 
                    onClick={() => handlePlanSelection(pack.id)}
                    disabled={loading}
                    className={clsx(
                      "w-full py-2 px-4 rounded-lg flex items-center justify-center transition",
                      pack.popular 
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90" 
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Acheter
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-0">
        <FAQ />
      </div>

      {/* Confirmation Dialog for Cancellation */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="mb-4 flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirmer l'annulation
                </h3>
                <p className="text-gray-600 mb-2">
                  Êtes-vous sûr de vouloir annuler votre abonnement Expert ?
                </p>
                {subscriptionEndDate && (
                  <p className="text-sm text-gray-500 mb-4">
                    Votre abonnement restera actif jusqu'au {subscriptionEndDate.toLocaleDateString()}, puis sera automatiquement désactivé. Vous passerez alors au plan Basic.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center disabled:opacity-50"
              >
                {cancelLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Confirmer l'annulation"
                )}
              </button>
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelLoading}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}