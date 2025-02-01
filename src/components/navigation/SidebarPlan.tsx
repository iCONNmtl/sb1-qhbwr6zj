import React from 'react';
import { Crown } from 'lucide-react';
import { useSubscriptionStatus } from '../../hooks/useSubscriptionStatus';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

interface SidebarPlanProps {
  isCollapsed: boolean;
}

export default function SidebarPlan({ isCollapsed }: SidebarPlanProps) {
  const { user } = useStore();
  const { subscription } = useSubscriptionStatus(user?.uid);

  if (!subscription) return null;

  if (isCollapsed) {
    return (
      <div 
        className="px-2 py-1.5 text-center" 
        title={`${subscription.credits} crédits - Plan ${subscription.plan}`}
      >
        <span className="text-lg font-bold text-purple-600">
          {subscription.credits}
        </span>
      </div>
    );
  }

  return (
    <div className="px-4 py-1.5">
      <div className="flex items-baseline justify-center space-x-1.5">
        <span className="text-xl font-bold text-purple-600">{subscription.credits}</span>
        <span className="text-sm text-gray-500">crédits</span>
      </div>
      <div className="flex items-center justify-center text-xs text-gray-400 font-medium mt-0.5">
        <Crown className="h-3 w-3 mr-1" />
        <span>Plan {subscription.plan}</span>
      </div>
    </div>
  );
}