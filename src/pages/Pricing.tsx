import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { usePlans } from '../hooks/usePlans';
import { PricingHeader, PricingGrid, PricingFooter } from '../components/pricing';
import { LoadingSpinner } from '../components/common';

export default function Pricing() {
  const { user } = useStore();
  const navigate = useNavigate();
  const { plans, loading } = usePlans();

  const handlePlanSelection = (planId: string) => {
    if (!user) {
      navigate('/signup');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des plans..." />;
  }

  return (
    <div className="py-12">
      <PricingHeader />
      <PricingGrid 
        plans={plans}
        userId={user?.uid}
        onSelectPlan={handlePlanSelection}
      />
      <PricingFooter />
    </div>
  );
}