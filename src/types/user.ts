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

export interface PlatformAccount {
  id: string;
  platform: string;
  name: string;
}

export interface UserProfile {
  email: string;
  subscription: UserSubscription;
  createdAt: string;
  favorites?: string[];
  platformAccounts?: PlatformAccount[];
  logoUrl?: string;
}