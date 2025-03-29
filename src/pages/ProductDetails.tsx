import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, ArrowRight, Truck, Package, Shield, Globe2, Info, Clock } from 'lucide-react';
import { SIZES, SIZE_PRICING } from '../data/sizes';
import { CONTINENTS } from '../data/shipping';
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
  const pricing = SIZE_PRICING[size.id];
  const continentPricing = pricing.continents[continentCode];
  
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
  const [selectedContinent, setSelectedContinent] = useState('europe');

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

      {/* Product Overview Block - Slider and Features side by side */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left side - Image Slider */}
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

          {/* Right side - Product Info & Features */}
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

      {/* Region and Sizes Block - Side by side */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tarification dynamique et réseau d'impression mondial
          </h2>
          <p className="text-gray-600">
            Nos prix sont calculés automatiquement lors de la réception d'une commande en fonction du pays de livraison. 
            Grâce à notre réseau d'imprimeries partenaires réparties dans le monde entier, nous imprimons vos affiches au plus près 
            de vos clients. Cette approche nous permet de minimiser les frais et délais de livraison, tout en réduisant significativement 
            notre empreinte carbone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left side - Region Selection */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Sélectionnez votre région
              </h2>
              <p className="text-gray-600">
                Choisissez votre zone géographique pour voir les prix et délais de livraison spécifiques à votre région. 
                Nos centres d'impression locaux garantissent des délais optimisés et des frais de port réduits.
              </p>
            </div>

            <div className="grid gap-4">
              {Object.entries(CONTINENTS).map(([code, continent]) => {
                const displayedCountries = continent.countries.slice(0, 3);
                const remainingCount = continent.countries.length - displayedCountries.length;
                
                return (
                  <button
                    key={code}
                    onClick={() => setSelectedContinent(code)}
                    className={clsx(
                      'p-6 rounded-xl border-2 transition-all duration-200 w-full',
                      selectedContinent === code
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {/* Header with flags and region name */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {displayedCountries.map(country => (
                            <span 
                              key={country.name} 
                              className="text-2xl first:-ml-0 -ml-2" 
                              role="img" 
                              aria-label={country.name}
                            >
                              {country.flag}
                            </span>
                          ))}
                          {remainingCount > 0 && (
                            <span className="text-sm font-medium text-gray-500 ml-2">
                              +{remainingCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {continent.name}
                      </h3>
                    </div>

                    {/* Shipping costs and delivery info */}
                    <div className="space-y-4">
                      {/* Shipping costs */}
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Frais de port</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {continent.shipping.basePrice}€
                            <span className="text-sm text-gray-500 font-normal ml-1">/ article</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600">Article supplémentaire</div>
                          <div className="font-medium text-gray-900">
                            +{continent.shipping.additionalItemPrice}€
                          </div>
                        </div>
                      </div>

                      {/* Delivery time */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Délai de livraison estimé</span>
                        </div>
                        <div className="font-medium text-gray-900">
                          {code === 'europe' ? '2-3 jours ouvrés' :
                           code === 'northAmerica' ? '3-5 jours ouvrés' :
                           code === 'asia' ? '4-7 jours ouvrés' :
                           code === 'oceania' ? '5-8 jours ouvrés' :
                           '4-7 jours ouvrés'}
                        </div>
                      </div>

                      {/* Local printing info */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>Expédition depuis nos centres d'impression locaux</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side - Sizes & Pricing */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Tailles disponibles pour {CONTINENTS[selectedContinent].name}
              </h2>
              <p className="text-gray-600">
                Découvrez nos différents formats et leurs prix optimisés pour votre région. Les prix incluent 
                l'impression locale et sont calculés pour maximiser votre marge tout en restant compétitifs 
                sur votre marché.
              </p>
            </div>

            <div className="grid gap-4">
              {SIZES.map((size) => {
                const pricing = SIZE_PRICING[size.id];
                const continentPricing = pricing.continents[selectedContinent];
                const { profit, profitPercentage, totalPrice } = calculateProfit(size, selectedContinent);
                
                return (
                  <div key={size.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{size.dimensions.inches}</div>
                        <div className="text-sm text-gray-500">{size.dimensions.cm}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{totalPrice}€</div>
                        <div className="text-sm text-green-600">
                          +{profit}€ ({Math.round(profitPercentage)}% de marge)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        Coût: {size.cost}€ + {continentPricing.shipping.basePrice}€ (livraison)
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Info className="h-4 w-4 mr-1" />
                        Prix recommandé: {size.suggestedPrice}€
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Info className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Informations importantes
          </h2>
        </div>

        {/* Shipping Notes */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-sm text-indigo-900">
              <ul className="space-y-1 list-disc pl-4">
                <li>Tous les envois sont effectués via des transporteurs express</li>
                <li>Suivi en ligne disponible pour toutes les commandes</li>
                <li>Assurance incluse jusqu'à 100€ par colis</li>
                <li>Emballage sécurisé en tube rigide pour une protection optimale</li>
              </ul>
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