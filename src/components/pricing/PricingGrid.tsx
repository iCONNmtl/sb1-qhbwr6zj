import React from 'react';
import { Check, Zap } from 'lucide-react';
import type { PlanConfig } from '../../types/user';
import PlanCard from './PlanCard';

interface PricingGridProps {
  plans: PlanConfig[];
  onSelectPlan: (planId: string) => void;
}

export default function PricingGrid({ plans, onSelectPlan }: PricingGridProps) {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSelect={() => onSelectPlan(plan.id)}
          isHighlighted={plan.name === 'Pro'}
        />
      ))}
    </div>
  );
}