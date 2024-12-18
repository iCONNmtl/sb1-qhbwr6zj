import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { PlanConfig } from '../../types/user';

interface PricingSectionProps {
  plans: PlanConfig[];
}

export default function PricingSection({ plans }: PricingSectionProps) {
  return (
    <section className="card p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Des tarifs adaptés à vos besoins
        </h2>
        <p className="text-xl text-gray-600">
          Commencez gratuitement, évoluez selon vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-gray-50 rounded-xl p-8 transition-all duration-200 ${
              plan.name === 'Pro'
                ? 'ring-2 ring-indigo-600 shadow-lg scale-105'
                : 'hover:scale-105'
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

            <Link
              to="/signup"
              className={`block w-full py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                plan.name === 'Pro'
                  ? 'gradient-bg text-white hover:opacity-90'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              Commencer
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}