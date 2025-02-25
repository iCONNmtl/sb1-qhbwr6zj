import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Package, Shield, Clock, Info, Globe2 } from 'lucide-react';
import clsx from 'clsx';

const SIZES = [
  { 
    id: '8x10', 
    dimensions: { inches: '8x10"', cm: '20x25cm' },
    cost: 5,
    price: 15
  },
  { 
    id: '8x12', 
    dimensions: { inches: '8x12"', cm: '21x29,7cm' },
    cost: 7,
    price: 18
  },
  { 
    id: '12x18', 
    dimensions: { inches: '12x18"', cm: '30x45cm' },
    cost: 12,
    price: 25
  },
  { 
    id: '24x36', 
    dimensions: { inches: '24x36"', cm: '60x90cm' },
    cost: 25,
    price: 45
  },
  { 
    id: '11x14', 
    dimensions: { inches: '11x14"', cm: '27x35cm' },
    cost: 8,
    price: 20
  },
  { 
    id: '11x17', 
    dimensions: { inches: '11x17"', cm: '28x43cm' },
    cost: 10,
    price: 22
  },
  { 
    id: '18x24', 
    dimensions: { inches: '18x24"', cm: '45x60cm' },
    cost: 18,
    price: 35
  },
  { 
    id: 'A4', 
    dimensions: { inches: 'A4', cm: '21x29,7cm' },
    cost: 7,
    price: 18
  },
  { 
    id: '5x7', 
    dimensions: { inches: '5x7"', cm: '13x18cm' },
    cost: 3,
    price: 10
  },
  { 
    id: '20x28', 
    dimensions: { inches: '20x28"', cm: '50x70cm' },
    cost: 20,
    price: 40
  },
  { 
    id: '28x40', 
    dimensions: { inches: '28x40"', cm: '70x100cm' },
    cost: 30,
    price: 55
  }
];

const PRODUCT_IMAGES = {
  'art-poster': [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
  ],
  'premium-mat': [
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512'
  ],
  'premium-semigloss': [
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
  ],
  'classic-mat': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
  ],
  'classic-semigloss': [
    'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
  ]
};

const PRODUCTS = {
  'art-poster': {
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    features: [
      'Papier texturé 200g/m²',
      'Rendu artistique unique',
      'Idéal pour les œuvres d\'art',
      'Finition mate élégante',
      'Certifié FSC'
    ],
    sizes: SIZES
  },
  'premium-mat': {
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    features: [
      'Papier premium 250g/m²',
      'Finition mate anti-reflets',
      'Rendu professionnel',
      'Idéal pour la décoration',
      'Certifié FSC'
    ],
    sizes: SIZES.map(size => ({
      ...size,
      cost: Math.round(size.cost * 1.2),
      price: Math.round(size.price * 1.2)
    }))
  },
  'premium-semigloss': {
    name: 'Poster Premium Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    features: [
      'Papier photo 250g/m²',
      'Finition semi-brillante',
      'Couleurs éclatantes',
      'Idéal pour les photos',
      'Certifié FSC'
    ],
    sizes: SIZES.map(size => ({
      ...size,
      cost: Math.round(size.cost * 1.2),
      price: Math.round(size.price * 1.2)
    }))
  },
  'classic-mat': {
    name: 'Poster Classique Mat',
    description: 'Impression mate sur papier 180g/m²',
    features: [
      'Papier standard 180g/m²',
      'Finition mate classique',
      'Bon rapport qualité/prix',
      'Usage quotidien',
      'Certifié FSC'
    ],
    sizes: SIZES.map(size => ({
      ...size,
      cost: Math.round(size.cost * 0.8),
      price: Math.round(size.price * 0.8)
    }))
  },
  'classic-semigloss': {
    name: 'Poster Classique Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 180g/m²',
    features: [
      'Papier photo 180g/m²',
      'Finition semi-brillante',
      'Bon rapport qualité/prix',
      'Usage quotidien',
      'Certifié FSC'
    ],
    sizes: SIZES.map(size => ({
      ...size,
      cost: Math.round(size.cost * 0.8),
      price: Math.round(size.price * 0.8)
    }))
  }
} as const;

const SHIPPING = [
  {
    country: 'France',
    price: 5.90,
    time: '2-3 jours ouvrés',
    icon: '🇫🇷'
  },
  {
    country: 'Belgique',
    price: 7.90,
    time: '3-4 jours ouvrés',
    icon: '🇧🇪'
  },
  {
    country: 'Suisse',
    price: 9.90,
    time: '4-5 jours ouvrés',
    icon: '🇨🇭'
  },
  {
    country: 'Luxembourg',
    price: 7.90,
    time: '3-4 jours ouvrés',
    icon: '🇱🇺'
  },
  {
    country: 'Allemagne',
    price: 7.90,
    time: '3-4 jours ouvrés',
    icon: '🇩🇪'
  },
  {
    country: 'Italie',
    price: 8.90,
    time: '4-5 jours ouvrés',
    icon: '🇮🇹'
  },
  {
    country: 'Espagne',
    price: 8.90,
    time: '4-5 jours ouvrés',
    icon: '🇪🇸'
  },
  {
    country: 'Pays-Bas',
    price: 7.90,
    time: '3-4 jours ouvrés',
    icon: '🇳🇱'
  }
];

type ProductId = keyof typeof PRODUCTS;

export default function ProductDetails() {
  const { id } = useParams<{ id: ProductId }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>();

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
  const images = PRODUCT_IMAGES[id as ProductId];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Product Info Section */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Slider */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-900" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-900" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={clsx(
                  'relative aspect-square w-20 rounded-lg overflow-hidden transition-all',
                  currentImageIndex === index ? 'ring-2 ring-indigo-600' : 'opacity-70 hover:opacity-100'
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} - Vue ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Caractéristiques
            </h2>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Worldwide Shipping Badge */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Globe2 className="h-6 w-6" />
              <div>
                <h3 className="font-medium">Expédition dans le monde entier</h3>
                <p className="text-sm text-white/90">Livraison rapide et sécurisée</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/product?type=${id}`}
            className={clsx(
              'block w-full py-4 px-6 text-center rounded-xl transition-all duration-200',
              'bg-indigo-600 text-white hover:bg-indigo-700'
            )}
          >
            Choisir ce produit
          </Link>
        </div>
      </div>

      {/* Sizes Section - Full width */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Tailles disponibles
              </h2>
              <p className="text-sm text-gray-600">
                Choisissez parmi nos différents formats d'impression
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={clsx(
                  'p-4 rounded-xl border-2 transition-all duration-200',
                  selectedSize === size.id
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-900">
                    <span className="font-medium">{size.dimensions.inches}</span>
                    <span className="text-gray-500 ml-2">({size.dimensions.cm})</span>
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {size.price}€
                  </div>
                </div>

                <div className="relative group">
                  <div className="flex items-center text-sm text-gray-600">
                    <Info className="h-4 w-4 mr-1" />
                    Voir détails
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="font-medium mb-2">Détails du format</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Dimensions (cm):</span>
                        <span className="font-medium">{size.dimensions.cm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensions (pouces):</span>
                        <span className="font-medium">{size.dimensions.inches}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/20 text-xs text-white/70">
                        Prix TTC • Expédition non incluse
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shipping Section - Full width */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Truck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Livraison internationale
              </h2>
              <p className="text-sm text-gray-600">
                Expédition sécurisée dans des tubes rigides pour une protection optimale
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SHIPPING.map((option) => (
              <div
                key={option.country}
                className="p-4 bg-gray-50 rounded-xl space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium text-gray-900">
                    {option.country}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prix</span>
                    <span className="font-medium text-indigo-600">
                      {option.price.toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Délai</span>
                    <span className="text-sm text-gray-900">
                      {option.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div className="text-sm text-indigo-900">
                <p className="font-medium mb-1">Informations importantes</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Les délais de livraison sont estimatifs et peuvent varier selon la destination</li>
                  <li>Suivi en ligne disponible pour toutes les commandes</li>
                  <li>Assurance incluse jusqu'à 100€ par colis</li>
                  <li>Livraison express disponible sur demande (supplément)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Truck className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            Livraison rapide
          </div>
          <div className="text-xs text-gray-600">
            2-5 jours ouvrés
          </div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Package className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            Emballage sécurisé
          </div>
          <div className="text-xs text-gray-600">
            Tube rigide
          </div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            Garantie qualité
          </div>
          <div className="text-xs text-gray-600">
            Satisfait ou remboursé
          </div>
        </div>
      </div>
    </div>
  );
}