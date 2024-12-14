import React from 'react';
import { Check, Zap } from 'lucide-react';
import clsx from 'clsx';
import type { PlanConfig } from '../../types/user';

interface PlanCardProps {
  plan: PlanConfig;
  onSelect: () => void;
  isHighlighted: boolean;
}

export default function PlanCard({ plan, onSelect, isHighlighted }: PlanCardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-4px]',
        isHighlighted 
          ? 'ring-2 ring-indigo-600 shadow-xl scale-105'
          : 'shadow-sm hover:shadow-md'
      )}
    >
      {/* Plan name and description */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {plan.name}
        </h3>
        <p className="text-gray-600 text-sm">{plan.description}</p>
      </div>

      {/* Credits */}
      <div className="mt-8 mb-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 text-center">
          <div className="flex items-baseline justify-center space-x-1.5">
            <span className="text-3xl font-bold text-indigo-600">
              {plan.credits}
            </span>
            <span className="text-sm text-indigo-600/70">crédits</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-2xl font-bold text-gray-900">{plan.price}€</span>
            <span className="text-sm text-gray-500 ml-1">unique</span>
          </div>
        </div>
      </div>

      {/* Features list */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="p-0.5 bg-indigo-100 rounded-full mr-3 mt-0.5">
              <Check className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action button */}
      {plan.name !== 'Basic' && (
        <button
          onClick={onSelect}
          className={clsx(
            'w-full py-3 px-4 rounded-xl text-center transition-all duration-200 flex items-center justify-center font-medium',
            isHighlighted
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          )}
        >
          <Zap className="h-5 w-5 mr-2" />
          <span>Acheter maintenant</span>
        </button>
      )}
    </div>
  );
}