import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { usePlans } from '../hooks/usePlans';
import { useUserProfile } from '../hooks/useFirestore';
import { Crown } from 'lucide-react';
import { 
  PricingHeader, 
  PricingGrid, 
  PricingFooter,
  PricingFAQ 
} from '../components/pricing';
import { LoadingSpinner } from '../components/common';

export default function Pricing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const { plans, loading: plansLoading } = usePlans();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.uid);

  const handlePlanSelection = (planId: string) => {
    if (!user) {
      navigate('/signup');
    }
  };

  if (plansLoading || profileLoading) {
    return <LoadingSpinner message="Chargement des plans..." />;
  }

  return (
    <div className="py-12">
      {userProfile && (
        <div className="max-w-7xl mx-auto mb-12 px-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Crown className="h-6 w-6 text-indigo-600" />
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
                <p className="text-sm text-indigo-600 font-medium">
                  Passez à un plan supérieur pour plus de crédits
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <PricingHeader />
      <PricingGrid 
        plans={plans}
        userId={user?.uid}
        onSelectPlan={handlePlanSelection}
      />
      <PricingFAQ />
      <PricingFooter />
    </div>
  );
}