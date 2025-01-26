import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import clsx from 'clsx';
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
        <div
          key={plan.id}
          className={clsx(
            'relative overflow-hidden rounded-xl p-8 transition-all duration-200',
            plan.name === 'Pro'
              ? 'ring-2 ring-indigo-600 shadow-lg scale-105'
              : 'hover:scale-105'
          )}
        >
          {/* Fond décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
          
          {/* Cercle décoratif */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-100/50 to-transparent" />
          
          {/* Contenu */}
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              {/* Crédits mis en avant */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 mb-4">
                <div className="text-4xl font-bold text-indigo-600 mb-1">
                  {plan.credits}
                </div>
                <div className="text-sm text-indigo-600 font-medium">
                  crédits
                  {plan.name === 'Expert' && (
                    <span className="ml-1 bg-indigo-200 px-1.5 py-0.5 rounded-full text-xs">
                      +25% Offert
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-end justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}€
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Sans engagement</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="p-1 bg-indigo-100 rounded-full mr-3">
                    <Check className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className={clsx(
                'block w-full py-3 px-4 rounded-lg text-center transition-all duration-200',
                plan.name === 'Pro'
                  ? 'gradient-bg text-white hover:opacity-90'
                  : 'bg-white text-gray-900 hover:bg-gray-50 shadow-sm'
              )}
            >
              Commencer
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}