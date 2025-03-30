import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, ArrowRight, Truck, Package, Shield, Globe2, Info, Clock, DollarSign, ChevronDown } from 'lucide-react';
import { SIZES } from '../data/sizes';
import { CONTINENTS, PRODUCT_PRICING } from '../data/shipping';
import clsx from 'clsx';

const PRODUCTS = {
  'art-poster': {
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    startingPrice: 10,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
      'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
    ],
    features: [
      'Papier texturé premium',
      'Rendu artistique unique',
      'Idéal pour les œuvres d\'art',
      'Finition mate élégante'
    ]
  },
  'premium-mat': {
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    startingPrice: 15,
    images: [
      'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512'
    ],
    features: [
      'Papier premium 250g/m²',
      'Finition mate anti-reflets',
      'Rendu professionnel',
      'Qualité galerie d\'art'
    ]
  },
  'premium-semigloss': {
    name: 'Poster Premium Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    startingPrice: 15,
    images: [
      'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
      'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
    ],
    features: [
      'Papier photo premium',
      'Couleurs éclatantes',
      'Finition semi-brillante',
      'Idéal pour la photo'
    ]
  }
} as const;

type ProductId = keyof typeof PRODUCTS;

function calculateProfit(size: typeof SIZES[0], continentCode: string): {
  profit: number;
  profitPercentage: number;
  totalPrice: number;
} {
  const pricing = PRODUCT_PRICING['art-poster'].sizes[size.id];
  const continentPricing = pricing[continentCode];
  
  // Calculate total price including shipping
  const totalPrice = continentPricing.price + continentPricing.shipping.basePrice;
  
  // Calculate profit (selling price - cost - shipping)
  const profit = totalPrice - size.cost - continentPricing.shipping.basePrice;
  
  // Calculate profit percentage
  const profitPercentage = (profit / totalPrice) * 100;
  
  return {
    profit,
    profitPercentage,
    totalPrice
  };
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('europe');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  if (!id || !PRODUCTS[id as ProductId]) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Produit non trouvé</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const product = PRODUCTS[id as ProductId];
  const continent = CONTINENTS[selectedRegion];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Retour aux produits
        </Link>
        <Link
          to={`/product?type=${id}`}
          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
        >
          <Settings className="h-5 w-5 mr-2" />
          Configurer le produit
        </Link>
      </div>

      {/* Product Overview Block */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image Slider */}
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
            >
              <ChevronRight className="h-6 w-6 text-gray-900" />
            </button>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all',
                    currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="text-lg font-medium text-indigo-600">
                  À partir de {product.startingPrice}€
                </div>
              </div>
              <p className="text-lg text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Caractéristiques
              </h2>
              <div className="grid gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Region and Pricing Block */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tarification dynamique et réseau d'impression mondial
          </h2>
          <p className="text-gray-600">
            Nos prix sont calculés automatiquement lors de la réception d'une commande en fonction du pays de livraison. 
            Grâce à notre réseau d'imprimeries partenaires réparties dans le monde entier, nous imprimons vos affiches au plus près 
            de vos clients.
          </p>
        </div>

        <div className="p-8">
          {/* Region Dropdown */}
          <div className="relative mb-12">
            <button
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
              className="w-full flex items-center justify-between p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
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
                "h-5 w-5 text-gray-400 transition-transform",
                showRegionDropdown && "transform rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {showRegionDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-lg divide-y divide-gray-100">
                {Object.entries(CONTINENTS).map(([code, region]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedRegion(code);
                      setShowRegionDropdown(false);
                    }}
                    className={clsx(
                      'w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors',
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

          {/* Shipping Info */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Frais de port</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {continent.shipping.basePrice}€
                    <span className="text-sm text-gray-500 font-normal ml-1">/ article</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                +{continent.shipping.additionalItemPrice}€ par article supplémentaire
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Délai de livraison</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedRegion === 'europe' ? '2-3 jours ouvrés' :
                     selectedRegion === 'northAmerica' ? '3-5 jours ouvrés' :
                     selectedRegion === 'asia' ? '4-7 jours ouvrés' :
                     selectedRegion === 'oceania' ? '5-8 jours ouvrés' :
                     '4-7 jours ouvrés'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Expédition depuis nos centres locaux
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Emballage sécurisé</div>
                  <div className="text-lg font-semibold text-gray-900">
                    Protection optimale
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Tube rigide et emballage renforcé
              </div>
            </div>
          </div>

          {/* Sizes & Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tailles disponibles pour {continent.name}
            </h3>
            <div className="grid gap-4">
              {SIZES.map((size) => {
                const pricing = PRODUCT_PRICING['art-poster'].sizes[size.id][selectedRegion];
                const totalPrice = pricing.price + pricing.shipping.basePrice;
                const profit = totalPrice - size.cost - pricing.shipping.basePrice;
                
                return (
                  <div key={size.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <div className="font-medium text-gray-900">{size.dimensions.inches}</div>
                        <div className="text-sm text-gray-500">{size.dimensions.cm}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Prix d'achat</div>
                        <div className="font-medium text-gray-900">{size.cost}€</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Frais de port</div>
                        <div className="font-medium text-gray-900">{pricing.shipping.basePrice}€</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Prix de vente estimé</div>
                        <div className="font-medium text-gray-900">
                          {pricing.price}€
                          <span className="ml-2 text-sm text-green-600">
                            (+{profit.toFixed(2)}€)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Prêt à créer votre produit ?
        </h2>
        <Link
          to={`/product?type=${id}`}
          className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 text-lg font-medium"
        >
          Configurer maintenant
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}