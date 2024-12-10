import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cancelSubscription } from '../utils/subscription';
import UpgradeDialog from '../components/dashboard/UpgradeDialog';
import toast from 'react-hot-toast';
import type { PlanConfig, UserSubscription } from '../types/user';

export default function Pricing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'expert'>('pro');
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansSnap = await getDocs(collection(db, 'plans'));
        const plansData = plansSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PlanConfig[];
        setPlans(plansData.sort((a, b) => a.price - b.price));
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Erreur lors du chargement des plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserSubscription(null);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserSubscription(userData.subscription);
        }
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        toast.error('Erreur lors du chargement de l\'abonnement');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handlePlanSelection = (planName: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (planName === 'Basic') {
      navigate('/dashboard');
      return;
    }

    setSelectedPlan(planName.toLowerCase() as 'pro' | 'expert');
    setShowUpgradeDialog(true);
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    try {
      await cancelSubscription(user.uid);
      toast.success('Abonnement annulé avec succès');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isCurrentPlan = (planName: string): boolean => {
    if (!userSubscription) return false;
    return userSubscription.plan.toLowerCase() === planName.toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-gray-600">Chargement des plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Des tarifs simples et transparents pour répondre à vos besoins
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        {plans.map((plan) => {
          const isPlanActive = isCurrentPlan(plan.name);

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-8 ${
                plan.name === 'Pro'
                  ? 'ring-2 ring-indigo-600 shadow-xl scale-105'
                  : 'shadow-sm'
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-end justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-600 mb-1">/mois</span>
                </div>
                <p className="mt-2 text-sm text-indigo-600 font-medium">
                  {plan.credits} crédits/mois
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.name !== 'Basic' && (
                isPlanActive ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleCancelSubscription}
                      className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Annuler mon abonnement
                    </button>
                    {userSubscription?.endDate && (
                      <p className="text-sm text-gray-500 text-center">
                        Fin d'abonnement le {formatDate(userSubscription.endDate)}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlanSelection(plan.name)}
                    className={`w-full py-3 px-4 rounded-lg text-center transition ${
                      plan.name === 'Pro'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="h-5 w-5 mr-2" />
                      {user ? "Choisir ce plan" : "Commencer"}
                    </span>
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {user && (
        <UpgradeDialog
          userId={user.uid}
          isOpen={showUpgradeDialog}
          onClose={() => setShowUpgradeDialog(false)}
          planId={selectedPlan}
        />
      )}

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Des questions ? {" "}
          <a href="mailto:support@mockuppro.com" className="text-indigo-600 hover:text-indigo-500">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}