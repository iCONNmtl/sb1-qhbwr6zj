import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Globe2, 
  Truck, 
  Shield, 
  Star, 
  Zap, 
  CheckCircle, 
  Image, 
  DollarSign, 
  Crown, 
  Users, 
  Info, 
  ChevronRight, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  Eye,
  Palette,
  Layers,
  Wand2,
  FileText,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { CONTINENTS, PRODUCT_PRICING } from '../data/shipping';
import { SIZES } from '../data/sizes';
import clsx from 'clsx';

const PRODUCTS = [
  {
    id: 'art-poster',
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    startingPrice: 12,
    rating: 4.8,
    reviewCount: 127,
    features: [
      'Papier texturé premium',
      'Rendu artistique unique',
      'Idéal pour les œuvres d\'art',
      'Finition mate élégante'
    ],
    popular: false
  },
  {
    id: 'premium-mat',
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    image: 'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670',
    startingPrice: 15,
    rating: 4.9,
    reviewCount: 243,
    features: [
      'Papier premium 250g/m²',
      'Finition mate anti-reflets',
      'Rendu professionnel',
      'Qualité galerie d\'art'
    ],
    popular: true
  },
  {
    id: 'premium-semigloss',
    name: 'Poster Premium Semi-Brillant',
    image: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    startingPrice: 15,
    rating: 4.7,
    reviewCount: 189,
    features: [
      'Papier photo premium',
      'Couleurs éclatantes',
      'Finition semi-brillante',
      'Idéal pour la photo'
    ],
    popular: false
  }
];

// Services complémentaires
const SERVICES = [
  {
    id: 'design-pack',
    name: 'Pack de Designs Personnalisés',
    description: 'Designs uniques créés par nos graphistes professionnels',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    price: 149,
    features: [
      '5 designs originaux et exclusifs',
      'Formats adaptés à tous vos produits',
      '2 révisions incluses',
      'Livraison en 7 jours'
    ],
    icon: Palette
  },
  {
    id: 'mockup-pack',
    name: 'Pack de Mockups Personnalisés',
    description: 'Mockups sur mesure pour vos produits spécifiques',
    image: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    price: 199,
    features: [
      '3 mockups personnalisés',
      'Adaptés à vos produits spécifiques',
      'Rendu photoréaliste',
      'Fichiers sources inclus'
    ],
    icon: Layers
  },
  {
    id: 'branding-pack',
    name: 'Pack Branding Complet',
    description: 'Solution complète pour votre identité de marque',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    price: 349,
    features: [
      'Logo et identité visuelle',
      'Charte graphique complète',
      '5 designs exclusifs',
      '3 mockups personnalisés',
      'Bannières pour réseaux sociaux'
    ],
    icon: Briefcase
  }
];

const BENEFITS = [
  {
    icon: Crown,
    title: "Qualité premium",
    description: "Papiers haut de gamme et encres professionnelles pour des résultats exceptionnels"
  },
  {
    icon: DollarSign,
    title: "Marges élevées",
    description: "Jusqu'à 70% de marge sur chaque vente pour maximiser vos profits"
  },
  {
    icon: Users,
    title: "Support dédié",
    description: "Une équipe d'experts à votre disposition pour vous accompagner"
  }
];

const STATS = [
  { value: "50k+", label: "Posters vendus" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "24h", label: "Expédition" }
];

const FAQ_ITEMS = [
  {
    question: "Quelle est la qualité d'impression de vos posters ?",
    answer: "Nous utilisons des imprimantes professionnelles de dernière génération et des papiers premium pour garantir une qualité d'impression exceptionnelle. Nos posters sont imprimés en haute résolution (300 DPI) pour des détails nets et des couleurs éclatantes."
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Les délais varient selon votre région : 2-3 jours ouvrés en Europe, 3-5 jours en Amérique du Nord, et 4-7 jours pour le reste du monde. Nous expédions depuis nos centres d'impression locaux pour optimiser les délais."
  },
  {
    question: "Comment sont protégés les posters pendant le transport ?",
    answer: "Tous nos posters sont soigneusement emballés dans des tubes rigides de haute qualité, garantissant une protection optimale pendant le transport. Chaque commande est assurée jusqu'à 100€."
  },
  {
    question: "Quelles sont les différences entre les finitions mate et semi-brillante ?",
    answer: "La finition mate offre un rendu élégant sans reflets, idéal pour l'art et la décoration. La finition semi-brillante donne plus de profondeur aux couleurs et convient parfaitement aux photos avec des contrastes marqués."
  },
  {
    question: "Proposez-vous des échantillons ?",
    answer: "Oui, vous pouvez commander un kit d'échantillons contenant nos différents papiers et finitions pour 9,90€ (frais de port inclus). Le montant est remboursé sur votre première commande."
  },
  {
    question: "Quelle est votre politique de retour ?",
    answer: "Nous offrons une garantie satisfaction de 30 jours. Si vous n'êtes pas satisfait de votre commande, nous vous remboursons intégralement ou réimprimons votre poster gratuitement."
  }
];

function PriceComparison() {
  const [selectedRegion, setSelectedRegion] = useState('europe');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const continent = CONTINENTS[selectedRegion];

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Comparaison des prix par région
      </h2>

      {/* Region Selector - Improved Dropdown */}
      <div className="mb-8">
        <div className="relative">
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {continent.countries.slice(0, 3).map(country => (
                  <span 
                    key={country.name} 
                    className="text-2xl first:-ml-0 -ml-2" 
                    role="img" 
                    aria-label={country.name}
                  >
                    {country.flag}
                  </span>
                ))}
                {continent.countries.length > 3 && (
                  <span className="text-sm font-medium text-gray-500 ml-2">
                    +{continent.countries.length - 3}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {continent.name}
                </h3>
                <div className="text-sm text-gray-500">
                  {selectedRegion === 'europe' ? '2-3 jours ouvrés' :
                   selectedRegion === 'northAmerica' ? '3-5 jours ouvrés' :
                   selectedRegion === 'asia' ? '4-7 jours ouvrés' :
                   selectedRegion === 'oceania' ? '5-8 jours ouvrés' :
                   '4-7 jours ouvrés'}
                </div>
              </div>
            </div>
            <ChevronDown className={clsx(
              "h-5 w-5 text-indigo-500 transition-transform",
              showRegionDropdown && "transform rotate-180"
            )} />
          </button>

          {/* Dropdown Menu - Improved Design */}
          {showRegionDropdown && (
            <div className="absolute z-20 w-full mt-2 bg-white rounded-xl border border-indigo-100 shadow-lg divide-y divide-gray-100 overflow-hidden">
              {Object.entries(CONTINENTS).map(([code, region]) => (
                <button
                  key={code}
                  onClick={() => {
                    setSelectedRegion(code);
                    setShowRegionDropdown(false);
                  }}
                  className={clsx(
                    'w-full flex items-center gap-4 p-4 hover:bg-indigo-50 transition-colors',
                    selectedRegion === code && 'bg-indigo-50'
                  )}
                >
                  <div className="flex items-center">
                    {region.countries.slice(0, 3).map(country => (
                      <span 
                        key={country.name} 
                        className="text-2xl first:-ml-0 -ml-2" 
                        role="img" 
                        aria-label={country.name}
                      >
                        {country.flag}
                      </span>
                    ))}
                    {region.countries.length > 3 && (
                      <span className="text-sm font-medium text-gray-500 ml-2">
                        +{region.countries.length - 3}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {region.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {code === 'europe' ? '2-3 jours ouvrés' :
                       code === 'northAmerica' ? '3-5 jours ouvrés' :
                       code === 'asia' ? '4-7 jours ouvrés' :
                       code === 'oceania' ? '5-8 jours ouvrés' :
                       '4-7 jours ouvrés'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price Table - Improved Design */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] bg-white rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 rounded-tl-xl sticky left-0 z-10 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="font-semibold text-gray-900">Format</div>
                  <div className="text-sm text-gray-500">Dimensions</div>
                </th>
                {Object.entries(PRODUCT_PRICING).map(([productId, product]) => (
                  <th key={productId} className="px-4 py-4 text-center">
                    <div className="font-semibold text-gray-900">
                      {productId === 'art-poster' ? 'Poster d\'Art' :
                       productId === 'premium-mat' ? 'Poster Premium Mat' :
                       'Poster Premium Semi-Brillant'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100">
              {SIZES.map((size) => (
                <tr key={size.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="py-4 px-4 sticky left-0 bg-white">
                    <div className="font-medium text-gray-900">{size.dimensions.inches}</div>
                    <div className="text-sm text-gray-500">{size.dimensions.cm}</div>
                  </td>
                  {Object.entries(PRODUCT_PRICING).map(([productId, product]) => {
                    const pricing = product.sizes[size.id]?.[selectedRegion];
                    if (!pricing) return <td key={productId} className="py-4 px-4 text-center">-</td>;

                    const totalPrice = pricing.price + pricing.shipping.basePrice;
                    const profit = totalPrice - size.cost - pricing.shipping.basePrice;
                    const profitPercentage = (profit / totalPrice) * 100;

                    return (
                      <td key={productId} className="py-4 px-4">
                        <div className="text-center space-y-2">
                          <div className="text-lg font-semibold text-indigo-600">
                            {totalPrice.toFixed(2)}€
                          </div>
                          <div className="flex flex-col items-center gap-1 text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Truck className="h-4 w-4" />
                              <span>+{pricing.shipping.basePrice.toFixed(2)}€</span>
                            </div>
                            <div className="text-green-600 font-medium">
                              +{profit.toFixed(2)}€ ({Math.round(profitPercentage)}%)
                            </div>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Info Card - Improved Design */}
      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Truck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Livraison {continent.name}</div>
              <div className="text-sm text-gray-600">
                {selectedRegion === 'europe' ? '2-3 jours ouvrés' :
                 selectedRegion === 'northAmerica' ? '3-5 jours ouvrés' :
                 selectedRegion === 'asia' ? '4-7 jours ouvrés' :
                 selectedRegion === 'oceania' ? '5-8 jours ouvrés' :
                 '4-7 jours ouvrés'}
              </div>
            </div>
          </div>

          <div className="h-px sm:h-12 sm:w-px bg-indigo-200" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Premier article</div>
              <div className="text-sm text-gray-600">{continent.shipping.basePrice}€</div>
            </div>
          </div>

          <div className="h-px sm:h-12 sm:w-px bg-indigo-200" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Plus className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Article supplémentaire</div>
              <div className="text-sm text-gray-600">+{continent.shipping.additionalItemPrice}€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Questions fréquentes
        </h2>
        <p className="text-lg text-gray-600">
          Tout ce que vous devez savoir sur nos produits d'impression
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-200">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="py-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-start justify-between text-left"
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              <span className="ml-6 flex-shrink-0">
                {openIndex === index ? (
                  <ChevronUp className="h-6 w-6 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-indigo-500" />
                )}
              </span>
            </button>
            <div
              className={clsx(
                'mt-2 pr-12 transition-all duration-300',
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              )}
            >
              <p className="text-base text-gray-600">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Vous ne trouvez pas la réponse à votre question ?{' '}
          <Link to="/contact" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Contactez notre support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Filter and sort products
  const filteredProducts = PRODUCTS
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.rating - a.rating;
      } else if (sortBy === 'price-low') {
        return a.startingPrice - b.startingPrice;
      } else {
        return b.startingPrice - a.startingPrice;
      }
    });

  return (
    <div className="space-y-16">
      {/* Hero Section - Improved Design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2426&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full">
            <Star className="h-5 w-5 mr-2 text-yellow-300" />
            <span className="font-medium">Note moyenne de 4.8/5 sur plus de 500 avis</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            Lancez votre business d'impression à la demande
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Des produits de qualité premium, une logistique simplifiée et des marges attractives
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="mt-8">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>

      {/* Products Section with Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Produits d'impression
            </h2>
            <p className="text-gray-600 mb-6">
              Nos produits d'impression sont fabriqués avec des matériaux de haute qualité et imprimés localement au plus près de vos clients pour une livraison rapide et écologique.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg mt-1">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Qualité premium</h3>
                  <p className="text-sm text-gray-600">Papiers haut de gamme et encres professionnelles pour des résultats exceptionnels.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg mt-1">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Livraison mondiale</h3>
                  <p className="text-sm text-gray-600">Expédition depuis nos centres locaux dans plus de 15 pays pour des délais optimisés.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg mt-1">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Marges élevées</h3>
                  <p className="text-sm text-gray-600">Jusqu'à 70% de marge sur chaque vente pour maximiser vos profits.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                to="/products/art-poster"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Package className="h-5 w-5 mr-2" />
                Découvrir nos produits
              </Link>
            </div>
          </div>
          
          {/* Network Map */}
          <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Globe2 className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900">Réseau mondial</h3>
            </div>
            
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                alt="Réseau d'impression mondial" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with locations */}
              <div className="absolute inset-0">
                <div className="w-full h-full relative">
                  {/* Europe */}
                  <div className="absolute top-[30%] left-[48%] animate-pulse">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-indigo-600 rounded-full opacity-30 animate-ping"></div>
                  </div>
                  
                  {/* North America */}
                  <div className="absolute top-[35%] left-[25%] animate-pulse">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-indigo-600 rounded-full opacity-30 animate-ping"></div>
                  </div>
                  
                  {/* Asia */}
                  <div className="absolute top-[40%] left-[70%] animate-pulse">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-indigo-600 rounded-full opacity-30 animate-ping"></div>
                  </div>
                  
                  {/* Australia */}
                  <div className="absolute top-[65%] left-[80%] animate-pulse">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-indigo-600 rounded-full opacity-30 animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 p-2 rounded-lg text-center">
                <div className="font-medium text-gray-900">15+ pays</div>
                <div className="text-xs text-gray-600">Centres d'impression</div>
              </div>
              
              <div className="bg-indigo-50 p-2 rounded-lg text-center">
                <div className="font-medium text-gray-900">200+</div>
                <div className="text-xs text-gray-600">Partenaires</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side: Product Cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Nos produits d'impression
            </h2>
            
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                {/* Image with overlay */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Rating */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                  
                  {/* Popular badge */}
                  {product.popular && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-xs font-medium">
                      Populaire
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      À partir de <span className="text-lg font-semibold text-indigo-600">{product.startingPrice}€</span>
                    </div>
                    <Link
                      to={`/products/${product.id}`}
                      className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <span className="text-sm">Détails</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price Comparison Section */}
      <div className="px-4 sm:px-0">
        <PriceComparison />
      </div>

      {/* Services Section with Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 sm:p-12 text-white shadow-xl mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2426&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full">
            <Briefcase className="h-5 w-5 mr-2" />
            <span className="font-medium">Services professionnels</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold">
            Boostez votre business avec nos services complémentaires
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Des solutions sur mesure pour vous démarquer de la concurrence
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-3 gap-8">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Image with overlay */}
              <div className="aspect-[3/2] relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg">
                  <Icon className="h-4 w-4 text-indigo-600" />
                </div>
                
                {/* Price */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                  <span className="font-semibold text-indigo-600">{service.price}€</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {service.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-center text-xs text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-indigo-600 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Commander maintenant</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Benefits Section - Improved Design */}
      <div className="grid md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl w-fit mb-4">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* FAQ Section - Improved in component */}
      <div className="px-4 sm:px-0">
        <FAQ />
      </div>

      {/* CTA Section - Improved Design */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-center text-white mx-4 sm:mx-0 shadow-xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Prêt à lancer votre business ?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-white/90">
            Commencez dès maintenant avec notre gamme de produits premium et notre logistique clé en main
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}