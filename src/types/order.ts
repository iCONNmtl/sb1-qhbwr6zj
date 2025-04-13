export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';
export type OrderPlatform = 'shopify' | 'etsy' | 'internal';

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  purchasePrice: number; // Added purchasePrice field
  size: string;
  dimensions: {
    cm: string;
    inches: string;
  };
  sku: string;
  designUrl?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface ShippingMethod {
  carrier: string;
  method: string;
  cost: number;
  estimatedDays: number;
  trackingNumber?: string;
}

export interface Order {
  id: string;
  firestoreId: string;
  userId: string;
  platform: OrderPlatform;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  message?: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  purchasePrice: number; // Added purchasePrice field
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  paidWithCredits?: boolean;
  creditsUsed?: number;
  shippingMethod: ShippingMethod;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}