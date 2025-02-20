export type UserPlan = 'Basic' | 'Pro' | 'Expert';

export interface UserSubscription {
  plan: UserPlan;
  startDate: string;
  endDate?: string;
  credits: number;
  active: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface PlatformAccount {
  id: string;
  platform: string;
  name: string;
}

export interface PlanConfig {
  id: string;
  name: UserPlan;
  price: number;
  credits: number;
  description: string;
  features: string[];
}

interface PinterestAuth {
  tokens: string; // Token crypté en base64
  connectedAt: string;
}

export interface UserProfile {
  email: string;
  subscription: UserSubscription;
  createdAt: string;
  favorites?: string[];
  platformAccounts?: PlatformAccount[];
  logoUrl?: string;
  pinterestAuth?: PinterestAuth;
  orderSetupCompleted?: boolean;
  purchasedTrainings?: string[]; // Added this field
}