import React from 'react';
import PlanCard from './PlanCard';
import type { PlanConfig } from '../../types/user';

interface PricingGridProps {
  plans: PlanConfig[];
  userId?: string;
  onSelectPlan: (planId: string) => void;
}

export default function PricingGrid({ plans, userId, onSelectPlan }: PricingGridProps) {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          userId={userId}
          onSelect={() => onSelectPlan(plan.id)}
          isHighlighted={plan.name === 'Pro'}
        />
      ))}
    </div>
  );
}