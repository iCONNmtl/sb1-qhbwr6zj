import React, { useState, useEffect } from 'react';
import { CreditCard, X, Loader2, Crown, Sparkles } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import type { UserProfile } from '../../types/user';

interface PurchaseConfirmDialogProps {
  plan: {
    id: string;
    name: string;
    price: number;
    credits: number;
  };
  userId: string;
  onClose: () => void;
}

export default function PurchaseConfirmDialog({ plan, userId, onClose }: PurchaseConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [totalCredits, setTotalCredits] = useState(plan.credits);
  const [bonusCredits, setBonusCredits] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUserProfile(profile);
          
          // Calculate bonus if user is on Expert plan
          if (profile.subscription?.plan === 'Expert') {
            const bonus = Math.round(plan.credits * 0.1);
            setBonusCredits(bonus);
            setTotalCredits(plan.credits + bonus);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [userId, plan.credits]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Liens de paiement Stripe directs
      const stripeLinks = {
        pack1: 'https://buy.stripe.com/test_3cs9Dn6UM3b0c924gi',
        pack2: 'https://buy.stripe.com/test_9AQ7vf7YQ12Sc92dQT',
        pack3: 'https://buy.stripe.com/test_3cs9Dn6UM3b0c924gi',
        pack4: 'https://buy.stripe.com/test_9AQ7vf7YQ12Sc92dQT',
        pro: 'https://buy.stripe.com/test_3cs9Dn6UM3b0c924gi',
        expert: 'https://buy.stripe.com/test_9AQ7vf7YQ12Sc92dQT'
      };

      const baseUrl = stripeLinks[plan.id.toLowerCase() as keyof typeof stripeLinks];
      if (!baseUrl) {
        throw new Error('Plan invalide');
      }

      // Ajoute l'ID utilisateur au lien
      const checkoutUrl = `${baseUrl}?client_reference_id=${userId}`;
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error('Error redirecting to payment:', error);
      toast.error(error.message || 'Erreur lors de la redirection vers le paiement');
      setLoading(false);
    }
  };

  const isExpertPlan = userProfile?.subscription?.plan === 'Expert';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Confirmer votre achat
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-xl p-4">
            <div className="text-center">
              <h4 className="font-medium text-indigo-900 mb-1">
                Pack {plan.name}
              </h4>
              <div className="flex flex-col items-center mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-indigo-600">
                    {plan.credits}
                  </span>
                  <span className="text-sm text-indigo-600/70">crédits</span>
                </div>
                
                {isExpertPlan && bonusCredits > 0 && (
                  <div className="flex items-center mt-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    <Sparkles className="h-4 w-4 mr-1" />
                    +{bonusCredits} crédits bonus Expert
                  </div>
                )}
                
                {isExpertPlan && bonusCredits > 0 && (
                  <div className="mt-2 text-sm font-medium text-indigo-600">
                    Total: {totalCredits} crédits
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold text-indigo-900">
                {plan.price}€
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>En confirmant votre achat :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Vous serez redirigé vers notre page de paiement sécurisée</li>
              <li>Les crédits seront ajoutés instantanément à votre compte</li>
              <li>Vous recevrez une confirmation par email</li>
              {isExpertPlan && bonusCredits > 0 && (
                <li className="text-amber-700 font-medium">
                  Votre bonus Expert de {bonusCredits} crédits sera automatiquement ajouté
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Redirection...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Procéder au paiement
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}