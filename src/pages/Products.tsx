import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Globe2, Truck, Shield, Star, Zap, CheckCircle, Image, DollarSign, Crown, Users, Info, ChevronRight, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { CONTINENTS, PRODUCT_PRICING } from '../data/shipping';
import { SIZES } from '../data/sizes';
import clsx from 'clsx';

const PRODUCTS = [
  {
    id: 'art-poster',
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Art1.webp',
    startingPrice: 3.90,
    rating: 4.8,
    reviewCount: 127,
    features: [
      'Papier texturé premium',
      'Rendu artistique unique',
      'Idéal pour les œuvres d\'art',
      'Finition mate élégante'
    ]
  },
  {
    id: 'premium-mat',
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Mat1.webp',
    startingPrice: 3.70,
    rating: 4.9,
    reviewCount: 243,
    features: [
      'Papier premium 250g/m²',
      'Finition mate anti-reflets',
      'Rendu professionnel',
      'Qualité galerie d\'art'
    ]
  },
  {
    id: 'premium-semigloss',
    name: 'Poster Premium Semi-Brillant',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Glossy1.webp',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    startingPrice: 3.50,
    rating: 4.7,
    reviewCount: 189,
    features: [
      'Papier photo premium',
      'Couleurs éclatantes',
      'Finition semi-brillante',
      'Idéal pour la photo'
    ]
  }
];

const SHIPPING_COUNTRIES = [
  { name: 'France', time: '2-3 jours', price: 5.90, icon: '🇫🇷' },
  { name: 'Belgique', time: '3-4 jours', price: 7.90, icon: '🇧🇪' },
  { name: 'Suisse', time: '4-5 jours', price: 9.90, icon: '🇨🇭' },
  { name: 'Luxembourg', time: '3-4 jours', price: 7.90, icon: '🇱🇺' },
  { name: 'Allemagne', time: '3-4 jours', price: 7.90, icon: '🇩🇪' },
  { name: 'Italie', time: '4-5 jours', price: 8.90, icon: '🇮🇹' },
  { name: 'Espagne', time: '4-5 jours', price: 8.90, icon: '🇪🇸' },
  { name: 'Pays-Bas', time: '3-4 jours', price: 7.90, icon: '🇳🇱' }
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
  const continent = CONTINENTS[selectedRegion];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 overflow-hidden">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Comparaison des prix par région
      </h2>

      {/* Region Selector */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 mb-4">
        <div className="flex gap-2 sm:gap-4 min-w-max sm:min-w-0 sm:flex-wrap">
          {Object.entries(CONTINENTS).map(([code, continent]) => (
            <button
              key={code}
              onClick={() => setSelectedRegion(code)}
              className={clsx(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200',
                selectedRegion === code
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              )}
            >
              <div className="flex -space-x-1">
                {continent.countries.slice(0, 3).map(country => (
                  <span key={country.name} className="text-lg sm:text-xl">{country.flag}</span>
                ))}
                {continent.countries.length > 3 && (
                  <span className="text-xs sm:text-sm ml-1">+{continent.countries.length - 3}</span>
                )}
              </div>
              <span className="text-sm sm:text-base font-medium">{continent.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Table */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left py-4 px-3 sm:px-4 bg-gray-50 rounded-tl-xl sticky left-0 z-10 bg-white">
                  <div className="font-semibold text-gray-900">Format</div>
                  <div className="text-sm text-gray-500">Dimensions</div>
                </th>
                {Object.entries(PRODUCT_PRICING).map(([productId, product]) => (
                  <th key={productId} className="px-3 sm:px-4 py-4 bg-gray-50 text-center">
                    <div className="font-semibold text-gray-900">
                      {productId === 'art-poster' ? 'Poster d\'Art' :
                       productId === 'premium-mat' ? 'Poster Premium Mat' :
                       'Poster Premium Semi-Brillant'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SIZES.map((size) => (
                <tr key={size.id} className="hover:bg-gray-50">
                  <td className="py-4 px-3 sm:px-4 sticky left-0 bg-white">
                    <div className="font-medium text-gray-900">{size.dimensions.inches}</div>
                    <div className="text-sm text-gray-500">{size.dimensions.cm}</div>
                  </td>
                  {Object.entries(PRODUCT_PRICING).map(([productId, product]) => {
                    const pricing = product.sizes[size.id]?.[selectedRegion];
                    if (!pricing) return <td key={productId} className="py-4 px-3 sm:px-4 text-center">-</td>;

                    return (
                      <td key={productId} className="py-4 px-3 sm:px-4">
                        <div className="text-center space-y-2">
                          <div className="text-lg font-semibold text-gray-900">
                            {pricing.price.toFixed(2)}€
                          </div>
                          <div className="flex flex-col items-center gap-1 text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Truck className="h-4 w-4" />
                              <span>+{pricing.shipping.basePrice.toFixed(2)}€</span>
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

      {/* Shipping Info Card */}
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

          <div className="h-px sm:h-12 sm:w-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Premier article</div>
              <div className="text-sm text-gray-600">{continent.shipping.basePrice}€</div>
            </div>
          </div>

          <div className="h-px sm:h-12 sm:w-px bg-gray-200" />

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
    <div className="bg-white rounded-2xl shadow-sm p-8">
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
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
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
  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Nos produits d'impression
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Rating */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center">
                  <Star className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    À partir de <span className="text-lg font-semibold text-gray-900">{product.startingPrice}€</span>
                  </div>
                  <div className="flex items-center text-indigo-600 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Voir le produit</span>
                    <svg className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Worldwide Shipping Section */}
      <div className="rounded-2xl px-4 sm:px-0">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe2 className="h-8 w-8" />
            <h2 className="text-2xl sm:text-3xl font-bold">Expédition dans le monde entier</h2>
          </div>
          <p className="text-xl max-w-2xl mx-auto">
          Des imprimeries partenaires sur chaque continent pour une logistique optimisée et des délais de livraison rapides pour satisfaire vos clients
          </p>
        </div>

        {/* Price Comparison */}
       <div className="px-4 sm:px-0">
        <PriceComparison />
      </div>
      </div>

       {/* FAQ Section */}
       <div className="px-4 sm:px-0">
        <FAQ />
      </div>
    </div>
  );
}