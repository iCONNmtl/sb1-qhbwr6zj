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
  
  export const PRODUCT_PRICING: Record<string, ProductPricing> = {
    'art-poster': {
      basePrice: 29.90,
      continents: {
        europe: {
          price: 29.90,
          shipping: CONTINENTS.europe.shipping
        },
        northAmerica: {
          price: 34.90,
          shipping: CONTINENTS.northAmerica.shipping
        },
        southAmerica: {
          price: 34.90,
          shipping: CONTINENTS.southAmerica.shipping
        },
        asia: {
          price: 39.90,
          shipping: CONTINENTS.asia.shipping
        },
        oceania: {
          price: 39.90,
          shipping: CONTINENTS.oceania.shipping
        },
        africa: {
          price: 34.90,
          shipping: CONTINENTS.africa.shipping
        }
      }
    },
    'premium-mat': {
      basePrice: 39.90,
      continents: {
        europe: {
          price: 39.90,
          shipping: CONTINENTS.europe.shipping
        },
        northAmerica: {
          price: 44.90,
          shipping: CONTINENTS.northAmerica.shipping
        },
        southAmerica: {
          price: 44.90,
          shipping: CONTINENTS.southAmerica.shipping
        },
        asia: {
          price: 49.90,
          shipping: CONTINENTS.asia.shipping
        },
        oceania: {
          price: 49.90,
          shipping: CONTINENTS.oceania.shipping
        },
        africa: {
          price: 44.90,
          shipping: CONTINENTS.africa.shipping
        }
      }
    },
    'premium-semigloss': {
      basePrice: 39.90,
      continents: {
        europe: {
          price: 39.90,
          shipping: CONTINENTS.europe.shipping
        },
        northAmerica: {
          price: 44.90,
          shipping: CONTINENTS.northAmerica.shipping
        },
        southAmerica: {
          price: 44.90,
          shipping: CONTINENTS.southAmerica.shipping
        },
        asia: {
          price: 49.90,
          shipping: CONTINENTS.asia.shipping
        },
        oceania: {
          price: 49.90,
          shipping: CONTINENTS.oceania.shipping
        },
        africa: {
          price: 44.90,
          shipping: CONTINENTS.africa.shipping
        }
      }
    }
  };