export interface Size {
  id: string;
  name: string;
  dimensions: {
    inches: string;
    cm: string;
  };
  recommendedSize: {
    width: number;
    height: number;
  };
  cost: number;
  suggestedPrice: number;
}

export interface ShippingCost {
  basePrice: number;
  additionalItemPrice: number;
}

export interface ContinentShipping {
  name: string;
  code: string;
  countries: Array<{
    name: string;
    flag: string;
  }>;
  shipping: ShippingCost;
}

export interface ProductPricing {
  basePrice: number;
  continents: {
    [key: string]: {
      price: number;
      shipping: ShippingCost;
    };
  };
}

export interface Product {
  id: string;
  firestoreId: string;
  userId: string;
  type: string;
  title: string;
  name: string;
  designUrl: string;
  variants: Array<{
    sizeId: string;
    name: string;
    price: number;
    cost: number;
    sku: string;
    dimensions: {
      cm: string;
      inches: string;
    };
    designUrl?: string;
  }>;
  createdAt: string;
  status: string;
  etsy?: {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    materials?: string[];
    who_made?: string;
    when_made?: string;
    is_supply?: boolean;
    is_customizable?: boolean;
    is_digital?: boolean;
    shipping_profile_id?: string;
    processing_time?: string;
    production_partner_ids?: string[];
  };
  shopify?: {
    title?: string;
    body_html?: string;
    vendor?: string;
    product_type?: string;
    tags?: string[];
    status?: string;
    published?: boolean;
    options?: Array<{
      name: string;
      values: string[];
    }>;
    metafields?: Array<{
      key: string;
      value: string;
      type: string;
      namespace: string;
    }>;
    seo_title?: string;
    seo_description?: string;
  };
}