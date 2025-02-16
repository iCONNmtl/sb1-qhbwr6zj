export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';
export type OrderPlatform = 'shopify' | 'etsy';

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  size: string;
  dimensions: {
    cm: string;
    inches: string;
  };
  sku: string;
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
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
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