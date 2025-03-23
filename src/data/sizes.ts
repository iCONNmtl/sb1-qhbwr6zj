import type { Size } from '../types/product';

export const SIZES: Size[] = [
  {
    id: '8x10',
    name: '8x10"',
    dimensions: {
      inches: '8x10"',
      cm: '20x25cm'
    },
    recommendedSize: {
      width: 2400,
      height: 3000
    },
    cost: 5,
    suggestedPrice: 15
  },
  {
    id: '8x12',
    name: '8x12"',
    dimensions: {
      inches: '8x12"',
      cm: '21x29,7cm'
    },
    recommendedSize: {
      width: 2400,
      height: 3600
    },
    cost: 7,
    suggestedPrice: 18
  },
  {
    id: '12x18',
    name: '12x18"',
    dimensions: {
      inches: '12x18"',
      cm: '30x45cm'
    },
    recommendedSize: {
      width: 3600,
      height: 5400
    },
    cost: 12,
    suggestedPrice: 25
  },
  {
    id: '24x36',
    name: '24x36"',
    dimensions: {
      inches: '24x36"',
      cm: '60x90cm'
    },
    recommendedSize: {
      width: 7200,
      height: 10800
    },
    cost: 25,
    suggestedPrice: 45
  },
  {
    id: '11x14',
    name: '11x14"',
    dimensions: {
      inches: '11x14"',
      cm: '27x35cm'
    },
    recommendedSize: {
      width: 3300,
      height: 4200
    },
    cost: 8,
    suggestedPrice: 20
  },
  {
    id: '11x17',
    name: '11x17"',
    dimensions: {
      inches: '11x17"',
      cm: '28x43cm'
    },
    recommendedSize: {
      width: 3300,
      height: 5100
    },
    cost: 10,
    suggestedPrice: 22
  },
  {
    id: '18x24',
    name: '18x24"',
    dimensions: {
      inches: '18x24"',
      cm: '45x60cm'
    },
    recommendedSize: {
      width: 5400,
      height: 7200
    },
    cost: 18,
    suggestedPrice: 35
  },
  {
    id: 'A4',
    name: 'A4',
    dimensions: {
      inches: 'A4',
      cm: '21x29,7cm'
    },
    recommendedSize: {
      width: 2480,
      height: 3508
    },
    cost: 7,
    suggestedPrice: 18
  },
  {
    id: '5x7',
    name: '5x7"',
    dimensions: {
      inches: '5x7"',
      cm: '13x18cm'
    },
    recommendedSize: {
      width: 1500,
      height: 2100
    },
    cost: 3,
    suggestedPrice: 10
  },
  {
    id: '20x28',
    name: '20x28"',
    dimensions: {
      inches: '20x28"',
      cm: '50x70cm'
    },
    recommendedSize: {
      width: 6000,
      height: 8400
    },
    cost: 20,
    suggestedPrice: 40
  },
  {
    id: '28x40',
    name: '28x40"',
    dimensions: {
      inches: '28x40"',
      cm: '70x100cm'
    },
    recommendedSize: {
      width: 8400,
      height: 12000
    },
    cost: 30,
    suggestedPrice: 55
  }
];

// Price multipliers for each continent
const CONTINENT_MULTIPLIERS = {
  europe: 1,
  northAmerica: 1.2,
  southAmerica: 1.2,
  asia: 1.3,
  oceania: 1.3,
  africa: 1.2
};

// Generate size pricing for each continent
export const SIZE_PRICING = SIZES.reduce((acc, size) => {
  acc[size.id] = {
    basePrice: size.suggestedPrice,
    continents: Object.entries(CONTINENT_MULTIPLIERS).reduce((continents, [continent, multiplier]) => {
      continents[continent] = {
        price: Math.round(size.suggestedPrice * multiplier),
        shipping: {
          basePrice: size.dimensions.inches === '5x7' ? 3.90 : 5.90,
          additionalItemPrice: size.dimensions.inches === '5x7' ? 1.90 : 2.90
        }
      };
      return continents;
    }, {} as Record<string, { price: number; shipping: { basePrice: number; additionalItemPrice: number } }>)
  };
  return acc;
}, {} as Record<string, {
  basePrice: number;
  continents: Record<string, {
    price: number;
    shipping: {
      basePrice: number;
      additionalItemPrice: number;
    };
  }>;
}>);