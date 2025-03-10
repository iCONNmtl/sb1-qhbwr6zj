import type { UserPlan } from './user';

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

interface ShopifyAuth {
  tokens: string; // Token crypté en base64
  connectedAt: string;
}

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface UserProfile {
  email: string;
  subscription: UserSubscription;
  createdAt: string;
  organizationName?: string;
  fullName?: string;
  address?: UserAddress;
  favorites?: string[];
  platformAccounts?: PlatformAccount[];
  logoUrl?: string;
  pinterestAuth?: PinterestAuth;
  shopifyAuth?: ShopifyAuth;
  orderSetupCompleted?: boolean;
  purchasedTrainings?: string[];
  autoPayOrders?: boolean;
}