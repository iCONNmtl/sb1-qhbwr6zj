export type UserPlan = 'Basic' | 'Pro' | 'Expert';

export interface UserSubscription {
  plan: UserPlan;
  startDate: string;
  endDate?: string;
  credits?: number;
  active: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface UserProfile {
  email: string;
  subscription: UserSubscription;
  createdAt: string;
  favorites?: string[];
  enabledPlatforms?: string[];
}