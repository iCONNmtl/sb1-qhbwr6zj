import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserPlan } from '../../types/user';

interface UserSubscriptionProps {
  plan: UserPlan;
  credits: number;
  endDate?: string;
  totalGenerations: number;
}

export default function UserSubscription({ plan, credits, endDate, totalGenerations }: UserSubscriptionProps) {
  const isPaidPlan = plan !== 'Basic';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 ${isPaidPlan ? 'bg-indigo-600' : 'bg-indigo-100'} rounded-lg`}>
              <Crown className={`h-6 w-6 ${isPaidPlan ? 'text-white' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Plan {plan}</h3>
              <div className="text-sm text-gray-500">
                <p>{credits} crédits disponibles</p>
                {isPaidPlan && endDate && (
                  <p>Expire le {new Date(endDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-l border-gray-200 pl-6">
            <div className="text-sm text-gray-500">Mockups générés</div>
            <div className="text-2xl font-bold text-indigo-600">{totalGenerations}</div>
          </div>
        </div>
        
        <Link
          to="/pricing"
          className="flex items-center px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
        >
          <span className="mr-2">{isPaidPlan ? 'Gérer' : 'Améliorer'}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}