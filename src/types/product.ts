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