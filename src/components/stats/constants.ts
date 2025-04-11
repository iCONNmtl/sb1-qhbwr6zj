export const COLORS = {
  revenue: '#4F46E5', // Indigo
  profit: '#10B981', // Green
  cost: '#EF4444',   // Red
  items: '#8B5CF6',  // Purple
  averageOrder: '#F59E0B', // Amber
  shopify: '#96BF47',
  etsy: '#F56400',
  '8x10': '#F472B6',
  '8x12': '#60A5FA',
  '12x18': '#34D399',
  '24x36': '#A78BFA',
  '11x14': '#FBBF24',
  '11x17': '#F87171',
  '18x24': '#818CF8',
  'A4': '#6EE7B7',
  '5x7': '#FCA5A5',
  '20x28': '#93C5FD',
  '28x40': '#C4B5FD'
};

export const PLATFORMS = [
  { id: 'shopify' as const, label: 'Shopify', color: COLORS.shopify },
  { id: 'etsy' as const, label: 'Etsy', color: COLORS.etsy }
];

export const SIZES = [
  { id: '8x10', label: '8x10"', color: COLORS['8x10'] },
  { id: '8x12', label: '8x12"', color: COLORS['8x12'] },
  { id: '12x18', label: '12x18"', color: COLORS['12x18'] },
  { id: '24x36', label: '24x36"', color: COLORS['24x36'] },
  { id: '11x14', label: '11x14"', color: COLORS['11x14'] },
  { id: '11x17', label: '11x17"', color: COLORS['11x17'] },
  { id: '18x24', label: '18x24"', color: COLORS['18x24'] },
  { id: 'A4', label: 'A4', color: COLORS.A4 },
  { id: '5x7', label: '5x7"', color: COLORS['5x7'] },
  { id: '20x28', label: '20x28"', color: COLORS['20x28'] },
  { id: '28x40', label: '28x40"', color: COLORS['28x40'] }
];

export const METRICS = [
  { id: 'revenue', label: 'Chiffre d\'affaires', color: COLORS.revenue },
  { id: 'cost', label: 'Dépenses', color: COLORS.cost },
  { id: 'profit', label: 'Bénéfices', color: COLORS.profit },
  { id: 'averageOrder', label: 'Panier moyen', color: COLORS.averageOrder }
];

export const CUSTOM_TOOLTIP_STYLES = {
  background: 'rgba(255, 255, 255, 0.95)',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.75rem 1rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  color: '#1F2937'
};

// Updated country flags using Unicode flag emojis
export const COUNTRY_FLAGS = {
  'France': '🇫🇷',
  'Belgique': '🇧🇪',
  'Suisse': '🇨🇭',
  'Luxembourg': '🇱🇺',
  'Allemagne': '🇩🇪',
  'Italie': '🇮🇹',
  'Espagne': '🇪🇸',
  'Pays-Bas': '🇳🇱',
  'Portugal': '🇵🇹',
  'Autriche': '🇦🇹',
  'Irlande': '🇮🇪',
  'Royaume-Uni': '🇬🇧',
  'Danemark': '🇩🇰',
  'Suède': '🇸🇪',
  'Finlande': '🇫🇮',
  'Norvège': '🇳🇴',
  'Pologne': '🇵🇱',
  'République tchèque': '🇨🇿',
  'Slovaquie': '🇸🇰',
  'Hongrie': '🇭🇺',
  'Roumanie': '🇷🇴',
  'Bulgarie': '🇧🇬',
  'Grèce': '🇬🇷',
  'Croatie': '🇭🇷',
  'Slovénie': '🇸🇮',
  'Malte': '🇲🇹',
  'Chypre': '🇨🇾',
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Nouvelle-Zélande': '🇳🇿',
  'Japon': '🇯🇵',
  'Corée du Sud': '🇰🇷',
  'Singapour': '🇸🇬',
  'Hong Kong': '🇭🇰',
  'Émirats arabes unis': '🇦🇪',
  'Israël': '🇮🇱',
  'Brésil': '🇧🇷',
  'Mexique': '🇲🇽',
  'Argentine': '🇦🇷',
  'Chili': '🇨🇱'
} as const;