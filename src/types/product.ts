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