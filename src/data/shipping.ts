import type { ProductPricing, ShippingCost, ContinentShipping } from '../types/product';

export const CONTINENTS: Record<string, ContinentShipping> = {
  europe: {
    name: "Europe",
    code: "EU",
    countries: [
      { name: "France", flag: "🇫🇷" },
      { name: "Allemagne", flag: "🇩🇪" },
      { name: "Italie", flag: "🇮🇹" },
      { name: "Espagne", flag: "🇪🇸" },
      { name: "Royaume-Uni", flag: "🇬🇧" },
      { name: "Pays-Bas", flag: "🇳🇱" },
      { name: "Belgique", flag: "🇧🇪" },
      { name: "Suisse", flag: "🇨🇭" },
      { name: "Portugal", flag: "🇵🇹" },
      { name: "Suède", flag: "🇸🇪" },
      { name: "Norvège", flag: "🇳🇴" },
      { name: "Finlande", flag: "🇫🇮" },
      { name: "Danemark", flag: "🇩🇰" },
      { name: "Irlande", flag: "🇮🇪" },
      { name: "Autriche", flag: "🇦🇹" }
    ],
    shipping: {
      basePrice: 5.90,
      additionalItemPrice: 2.90
    }
  },
  northAmerica: {
    name: "Amérique du Nord",
    code: "NA",
    countries: [
      { name: "États-Unis", flag: "🇺🇸" },
      { name: "Canada", flag: "🇨🇦" },
      { name: "Mexique", flag: "🇲🇽" }
    ],
    shipping: {
      basePrice: 15.90,
      additionalItemPrice: 5.90
    }
  },
  southAmerica: {
    name: "Amérique du Sud",
    code: "SA",
    countries: [
      { name: "Brésil", flag: "🇧🇷" },
      { name: "Argentine", flag: "🇦🇷" },
      { name: "Chili", flag: "🇨🇱" },
      { name: "Colombie", flag: "🇨🇴" },
      { name: "Pérou", flag: "🇵🇪" }
    ],
    shipping: {
      basePrice: 19.90,
      additionalItemPrice: 7.90
    }
  },
  asia: {
    name: "Asie",
    code: "AS",
    countries: [
      { name: "Japon", flag: "🇯🇵" },
      { name: "Corée du Sud", flag: "🇰🇷" },
      { name: "Chine", flag: "🇨🇳" },
      { name: "Singapour", flag: "🇸🇬" },
      { name: "Hong Kong", flag: "🇭🇰" },
      { name: "Taiwan", flag: "🇹🇼" },
      { name: "Vietnam", flag: "🇻🇳" },
      { name: "Thaïlande", flag: "🇹🇭" }
    ],
    shipping: {
      basePrice: 17.90,
      additionalItemPrice: 6.90
    }
  },
  oceania: {
    name: "Océanie",
    code: "OC",
    countries: [
      { name: "Australie", flag: "🇦🇺" },
      { name: "Nouvelle-Zélande", flag: "🇳🇿" }
    ],
    shipping: {
      basePrice: 21.90,
      additionalItemPrice: 8.90
    }
  },
  africa: {
    name: "Afrique",
    code: "AF",
    countries: [
      { name: "Maroc", flag: "🇲🇦" },
      { name: "Tunisie", flag: "🇹🇳" },
      { name: "Algérie", flag: "🇩🇿" },
      { name: "Sénégal", flag: "🇸🇳" },
      { name: "Côte d'Ivoire", flag: "🇨🇮" },
      { name: "Afrique du Sud", flag: "🇿🇦" }
    ],
    shipping: {
      basePrice: 23.90,
      additionalItemPrice: 9.90
    }
  }
};

// Configuration des prix par produit, taille et région
export const PRODUCT_PRICING: Record<string, {
  basePrice: number;
  sizes: Record<string, Record<string, {
    price: number;
    shipping: ShippingCost;
  }>>;
}> = {
  'art-poster': {
    basePrice: 29.90,
    sizes: {
      // Format 8x10
      '8x10': {
        europe: {
          price: 29.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 34.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 34.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 39.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 39.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 34.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 8x12
      '8x12': {
        europe: {
          price: 34.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 39.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 39.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 44.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 44.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 39.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 12x18
      '12x18': {
        europe: {
          price: 39.90,
          shipping: { basePrice: 6.90, additionalItemPrice: 3.90 }
        },
        northAmerica: {
          price: 44.90,
          shipping: { basePrice: 16.90, additionalItemPrice: 6.90 }
        },
        southAmerica: {
          price: 44.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        asia: {
          price: 49.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        oceania: {
          price: 49.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        africa: {
          price: 44.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        }
      },
      // Format 24x36
      '24x36': {
        europe: {
          price: 59.90,
          shipping: { basePrice: 8.90, additionalItemPrice: 4.90 }
        },
        northAmerica: {
          price: 64.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        southAmerica: {
          price: 64.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        asia: {
          price: 69.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        oceania: {
          price: 69.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        },
        africa: {
          price: 64.90,
          shipping: { basePrice: 26.90, additionalItemPrice: 11.90 }
        }
      },
      // Format 11x14
      '11x14': {
        europe: {
          price: 34.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 39.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 39.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 44.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 44.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 39.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 11x17
      '11x17': {
        europe: {
          price: 36.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 41.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 41.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 46.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 46.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 41.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 18x24
      '18x24': {
        europe: {
          price: 49.90,
          shipping: { basePrice: 7.90, additionalItemPrice: 3.90 }
        },
        northAmerica: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        southAmerica: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        asia: {
          price: 59.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        oceania: {
          price: 59.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        },
        africa: {
          price: 54.90,
          shipping: { basePrice: 25.90, additionalItemPrice: 10.90 }
        }
      },
      // Format A4
      'A4': {
        europe: {
          price: 34.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 39.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 39.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 44.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 44.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 39.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 5x7
      '5x7': {
        europe: {
          price: 24.90,
          shipping: { basePrice: 4.90, additionalItemPrice: 1.90 }
        },
        northAmerica: {
          price: 29.90,
          shipping: { basePrice: 14.90, additionalItemPrice: 4.90 }
        },
        southAmerica: {
          price: 29.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 6.90 }
        },
        asia: {
          price: 34.90,
          shipping: { basePrice: 16.90, additionalItemPrice: 5.90 }
        },
        oceania: {
          price: 34.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 7.90 }
        },
        africa: {
          price: 29.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 8.90 }
        }
      },
      // Format 20x28
      '20x28': {
        europe: {
          price: 54.90,
          shipping: { basePrice: 8.90, additionalItemPrice: 4.90 }
        },
        northAmerica: {
          price: 59.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        southAmerica: {
          price: 59.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        asia: {
          price: 64.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        oceania: {
          price: 64.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        },
        africa: {
          price: 59.90,
          shipping: { basePrice: 26.90, additionalItemPrice: 11.90 }
        }
      },
      // Format 28x40
      '28x40': {
        europe: {
          price: 69.90,
          shipping: { basePrice: 9.90, additionalItemPrice: 5.90 }
        },
        northAmerica: {
          price: 74.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 8.90 }
        },
        southAmerica: {
          price: 74.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 10.90 }
        },
        asia: {
          price: 79.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 9.90 }
        },
        oceania: {
          price: 79.90,
          shipping: { basePrice: 25.90, additionalItemPrice: 11.90 }
        },
        africa: {
          price: 74.90,
          shipping: { basePrice: 27.90, additionalItemPrice: 12.90 }
        }
      }
    }
  },
  'premium-mat': {
    basePrice: 39.90,
    sizes: {
      // Format 8x10
      '8x10': {
        europe: {
          price: 39.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 44.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 44.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 49.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 49.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 44.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 8x12
      '8x12': {
        europe: {
          price: 44.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 49.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 49.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 49.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 12x18
      '12x18': {
        europe: {
          price: 49.90,
          shipping: { basePrice: 6.90, additionalItemPrice: 3.90 }
        },
        northAmerica: {
          price: 54.90,
          shipping: { basePrice: 16.90, additionalItemPrice: 6.90 }
        },
        southAmerica: {
          price: 54.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        asia: {
          price: 59.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        oceania: {
          price: 59.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        africa: {
          price: 54.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        }
      },
      // Format 24x36
      '24x36': {
        europe: {
          price: 69.90,
          shipping: { basePrice: 8.90, additionalItemPrice: 4.90 }
        },
        northAmerica: {
          price: 74.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        southAmerica: {
          price: 74.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        asia: {
          price: 79.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        oceania: {
          price: 79.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        },
        africa: {
          price: 74.90,
          shipping: { basePrice: 26.90, additionalItemPrice: 11.90 }
        }
      },
      // Format 11x14
      '11x14': {
        europe: {
          price: 44.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 49.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 49.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 49.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 11x17
      '11x17': {
        europe: {
          price: 46.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 51.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 51.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 56.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 56.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 51.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 18x24
      '18x24': {
        europe: {
          price: 59.90,
          shipping: { basePrice: 7.90, additionalItemPrice: 3.90 }
        },
        northAmerica: {
          price: 64.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        southAmerica: {
          price: 64.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        asia: {
          price: 69.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        oceania: {
          price: 69.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        },
        africa: {
          price: 64.90,
          shipping: { basePrice: 25.90, additionalItemPrice: 10.90 }
        }
      },
      // Format A4
      'A4': {
        europe: {
          price: 44.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 49.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 49.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 49.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 5x7
      '5x7': {
        europe: {
          price: 34.90,
          shipping: { basePrice: 4.90, additionalItemPrice: 1.90 }
        },
        northAmerica: {
          price: 39.90,
          shipping: { basePrice: 14.90, additionalItemPrice: 4.90 }
        },
        southAmerica: {
          price: 39.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 6.90 }
        },
        asia: {
          price: 44.90,
          shipping: { basePrice: 16.90, additionalItemPrice: 5.90 }
        },
        oceania: {
          price: 44.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 7.90 }
        },
        africa: {
          price: 39.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 8.90 }
        }
      },
      // Format 20x28
      '20x28': {
        europe: {
          price: 64.90,
          shipping: { basePrice: 8.90, additionalItemPrice: 4.90 }
        },
        northAmerica: {
          price: 69.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        southAmerica: {
          price: 69.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        asia: {
          price: 74.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        oceania: {
          price: 74.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        },
        africa: {
          price: 69.90,
          shipping: { basePrice: 26.90, additionalItemPrice: 11.90 }
        }
      },
      // Format 28x40
      '28x40': {
        europe: {
          price: 79.90,
          shipping: { basePrice: 9.90, additionalItemPrice: 5.90 }
        },
        northAmerica: {
          price: 84.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 8.90 }
        },
        southAmerica: {
          price: 84.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 10.90 }
        },
        asia: {
          price: 89.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 9.90 }
        },
        oceania: {
          price: 89.90,
          shipping: { basePrice: 25.90, additionalItemPrice: 11.90 }
        },
        africa: {
          price: 84.90,
          shipping: { basePrice: 27.90, additionalItemPrice: 12.90 }
        }
      }
    }
  },
  'premium-semigloss': {
    basePrice: 39.90,
    sizes: {
      // Format 8x10
      '8x10': {
        europe: {
          price: 39.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 44.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 44.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 49.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 49.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 44.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 8x12
      '8x12': {
        europe: {
          price: 44.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 49.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 49.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 49.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 12x18
      '12x18': {
        europe: {
          price: 49.90,
          shipping: { basePrice: 6.90, additionalItemPrice: 3.90 }
        },
        northAmerica: {
          price: 54.90,
          shipping: { basePrice: 16.90, additionalItemPrice: 6.90 }
        },
        southAmerica: {
          price: 54.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        asia: {
          price: 59.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        oceania: {
          price: 59.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        africa: {
          price: 54.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        }
      },
      // Format 24x36
      '24x36': {
        europe: {
          price: 69.90,
          shipping: { basePrice: 8.90, additionalItemPrice: 4.90 }
        },
        northAmerica: {
          price: 74.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        southAmerica: {
          price: 74.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        asia: {
          price: 79.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        oceania: {
          price: 79.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        },
        africa: {
          price: 74.90,
          shipping: { basePrice: 26.90, additionalItemPrice: 11.90 }
        }
      },
      // Format 11x14
      '11x14': {
        europe: {
          price: 44.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 49.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 49.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 49.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 11x17
      '11x17': {
        europe: {
          price: 46.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 51.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 51.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 56.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 56.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 51.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 18x24
      '18x24': {
        europe: {
          price: 59.90,
          shipping: { basePrice: 7.90, additionalItemPrice: 3.90 }
        },
        northAmerica: {
          price: 64.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        southAmerica: {
          price: 64.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        asia: {
          price: 69.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        oceania: {
          price: 69.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        },
        africa: {
          price: 64.90,
          shipping: { basePrice: 25.90, additionalItemPrice: 10.90 }
        }
      },
      // Format A4
      'A4': {
        europe: {
          price: 44.90,
          shipping: { basePrice: 5.90, additionalItemPrice: 2.90 }
        },
        northAmerica: {
          price: 49.90,
          shipping: { basePrice: 15.90, additionalItemPrice: 5.90 }
        },
        southAmerica: {
          price: 49.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 7.90 }
        },
        asia: {
          price: 54.90,
          shipping: { basePrice: 17.90, additionalItemPrice: 6.90 }
        },
        oceania: {
          price: 54.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 8.90 }
        },
        africa: {
          price: 49.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 9.90 }
        }
      },
      // Format 5x7
      '5x7': {
        europe: {
          price: 34.90,
          shipping: { basePrice: 4.90, additionalItemPrice: 1.90 }
        },
        northAmerica: {
          price: 39.90,
          shipping: { basePrice: 14.90, additionalItemPrice: 4.90 }
        },
        southAmerica: {
          price: 39.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 6.90 }
        },
        asia: {
          price: 44.90,
          shipping: { basePrice: 16.90, additionalItemPrice: 5.90 }
        },
        oceania: {
          price: 44.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 7.90 }
        },
        africa: {
          price: 39.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 8.90 }
        }
      },
      // Format 20x28
      '20x28': {
        europe: {
          price: 64.90,
          shipping: { basePrice: 8.90, additionalItemPrice: 4.90 }
        },
        northAmerica: {
          price: 69.90,
          shipping: { basePrice: 18.90, additionalItemPrice: 7.90 }
        },
        southAmerica: {
          price: 69.90,
          shipping: { basePrice: 22.90, additionalItemPrice: 9.90 }
        },
        asia: {
          price: 74.90,
          shipping: { basePrice: 20.90, additionalItemPrice: 8.90 }
        },
        oceania: {
          price: 74.90,
          shipping: { basePrice: 24.90, additionalItemPrice: 10.90 }
        },
        africa: {
          price: 69.90,
          shipping: { basePrice: 26.90, additionalItemPrice: 11.90 }
        }
      },
      // Format 28x40
      '28x40': {
        europe: {
          price: 79.90,
          shipping: { basePrice: 9.90, additionalItemPrice: 5.90 }
        },
        northAmerica: {
          price: 84.90,
          shipping: { basePrice: 19.90, additionalItemPrice: 8.90 }
        },
        southAmerica: {
          price: 84.90,
          shipping: { basePrice: 23.90, additionalItemPrice: 10.90 }
        },
        asia: {
          price: 89.90,
          shipping: { basePrice: 21.90, additionalItemPrice: 9.90 }
        },
        oceania: {
          price: 89.90,
          shipping: { basePrice: 25.90, additionalItemPrice: 11.90 }
        },
        africa: {
          price: 84.90,
          shipping: { basePrice: 27.90, additionalItemPrice: 12.90 }
        }
      }
    }
  }
};

// Helper function to get pricing for a specific product, size and region
export function getProductPricing(
  productId: string,
  sizeId: string,
  region: string
) {
  const product = PRODUCT_PRICING[productId];
  if (!product) return null;

  const size = product.sizes[sizeId];
  if (!size) return null;

  const pricing = size[region];
  if (!pricing) return null;

  return {
    price: pricing.price,
    shipping: pricing.shipping,
    total: pricing.price + pricing.shipping.basePrice
  };
}