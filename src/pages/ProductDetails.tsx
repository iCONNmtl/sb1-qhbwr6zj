import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Package, Shield, Clock } from 'lucide-react';
import clsx from 'clsx';

const PRODUCT_IMAGES = {
  'poster-mat': [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
  ],
  'poster-glossy': [
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512'
  ],
  'poster-frame': [
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670'
  ]
};

const PRODUCTS = {
  'poster-mat': {
    name: 'Poster Mat Premium',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    features: [
      'Papier premium 250g/m²',
      'Finition mate anti-reflets',
      'Rendu artistique',
      'Idéal pour la décoration',
      'Certifié FSC'
    ],
    sizes: [
      { id: '20x30', name: '20x30 cm', price: 15 },
      { id: '30x40', name: '30x40 cm', price: 25 },
      { id: '40x60', name: '40x60 cm', price: 35 },
      { id: '50x70', name: '50x70 cm', price: 45 },
      { id: '60x90', name: '60x90 cm', price: 65 }
    ]
  },
  'poster-glossy': {
    name: 'Poster Brillant Premium',
    description: 'Impression brillante éclatante sur papier photo 250g/m²',
    features: [
      'Papier photo 250g/m²',
      'Finition ultra-brillante',
      'Couleurs éclatantes',
      'Idéal pour les photos',
      'Certifié FSC'
    ],
    sizes: [
      { id: '20x30', name: '20x30 cm', price: 18 },
      { id: '30x40', name: '30x40 cm', price: 28 },
      { id: '40x60', name: '40x60 cm', price: 38 },
      { id: '50x70', name: '50x70 cm', price: 48 },
      { id: '60x90', name: '60x90 cm', price: 68 }
    ]
  },
  'poster-frame': {
    name: 'Poster Encadré',
    description: 'Vos posters encadrés avec élégance dans des cadres en aluminium',
    features: [
      'Cadre aluminium premium',
      'Verre anti-reflets',
      'Montage professionnel',
      'Prêt à accrocher',
      'Protection UV'
    ],
    sizes: [
      { id: '20x30', name: '20x30 cm', price: 35 },
      { id: '30x40', name: '30x40 cm', price: 55 },
      { id: '40x60', name: '40x60 cm', price: 85 },
      { id: '50x70', name: '50x70 cm', price: 115 },
      { id: '60x90', name: '60x90 cm', price: 165 }
    ]
  }
} as const;

const SHIPPING = [
  {
    country: 'France',
    price: 5.90,
    time: '2-3 jours ouvrés'
  },
  {
    country: 'Belgique',
    price: 7.90,
    time: '3-4 jours ouvrés'
  },
  {
    country: 'Suisse',
    price: 9.90,
    time: '4-5 jours ouvrés'
  },
  {
    country: 'Luxembourg',
    price: 7.90,
    time: '3-4 jours ouvrés'
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

          {/* Sizes */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tailles disponibles
            </h2>
            <div className="grid grid-cols-2 gap-4">
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
                  <div className="font-medium text-gray-900">
                    {size.name}
                  </div>
                  <div className="text-lg font-bold text-indigo-600">
                    {size.price}€
                  </div>
                </button>
              ))}
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

          {/* Shipping */}
          <div className="space-y-4 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Livraison
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {SHIPPING.map((option) => (
                <div
                  key={option.country}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {option.country}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{option.time}</span>
                    <span className="font-medium text-indigo-600">
                      {option.price}€
                    </span>
                  </div>
                </div>
              ))}
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
      </div>
    </div>
  );
}