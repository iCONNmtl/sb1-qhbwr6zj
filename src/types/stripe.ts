export interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  recurring: {
    interval: 'month' | 'year';
  };
}

export interface StripeSession {
  id: string;
  url: string;
}