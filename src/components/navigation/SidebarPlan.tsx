import React from 'react';
import { useSubscriptionStatus } from '../../hooks/useSubscriptionStatus';
import { useStore } from '../../store/useStore';
import { CreditCard, Crown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarPlanProps {
  isCollapsed: boolean;
}

export default function SidebarPlan({ isCollapsed }: SidebarPlanProps) {
  const { user } = useStore();
  const { subscription } = useSubscriptionStatus(user?.uid);

  if (!subscription) return null;

  const isPremium = subscription.plan !== 'Basic';
  const subscriptionEndDate = subscription.endDate ? new Date(subscription.endDate) : undefined;
  const isSubscriptionCanceled = subscription.canceledAt !== undefined;

  // Collapsed view - show only icon and credits
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center" title={`${subscription.credits} crédits - Plan ${subscription.plan}`}>
        <div className={clsx(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isPremium ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-indigo-100"
        )}>
          {isPremium ? (
            <Crown className="h-4 w-4 text-white" />
          ) : (
            <CreditCard className="h-4 w-4 text-indigo-600" />
          )}
        </div>
        <span className="text-xs font-semibold mt-1 text-indigo-600">
          {subscription.credits}
        </span>
      </div>
    );
  }

  // Expanded view - show full plan info
  return (
    <Link to="/pricing" className="block">
      <div className={clsx(
        "flex items-center p-3 rounded-xl transition-all",
        isPremium 
          ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white" 
          : "bg-indigo-50 hover:bg-indigo-100"
      )}>
        <div className={clsx(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          isPremium ? "bg-white/20" : "bg-indigo-100"
        )}>
          {isPremium ? (
            <Crown className="h-5 w-5 text-white" />
          ) : (
            <CreditCard className="h-5 w-5 text-indigo-600" />
          )}
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-baseline">
            <span className={clsx(
              "text-lg font-bold",
              isPremium ? "text-white" : "text-indigo-600"
            )}>
              {subscription.credits}
            </span>
            <span className={clsx(
              "ml-1 text-xs",
              isPremium ? "text-white/80" : "text-gray-500"
            )}>
              crédits
            </span>
          </div>
          <div className={clsx(
            "text-xs font-medium",
            isPremium ? "text-white/90" : "text-gray-600"
          )}>
            Plan {subscription.plan}
            {isPremium && subscriptionEndDate && (
              <span className="block text-white/80 text-[10px]">
                {isSubscriptionCanceled 
                  ? "Annulé - Fin le " 
                  : "Abonné jusqu'au "}
                {subscriptionEndDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight className={clsx(
          "h-4 w-4 flex-shrink-0",
          isPremium ? "text-white/70" : "text-gray-400"
        )} />
      </div>
    </Link>
  );
}