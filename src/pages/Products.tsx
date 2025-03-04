import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Globe2, Truck, Shield, Star, Zap, CheckCircle, Image, DollarSign, Crown, Users } from 'lucide-react';
import clsx from 'clsx';

const PRODUCTS = [
  {
    id: 'art-poster',
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Art.webp',
    startingPrice: 12,
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
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Mat.webp',
    startingPrice: 15,
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
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Glossy.webp',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    startingPrice: 15,
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

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
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

      {/* Worldwide Shipping Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-white">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe2 className="h-8 w-8" />
            <h2 className="text-2xl sm:text-3xl font-bold">Expédition dans le monde entier</h2>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Des imprimeries partenaires sur chaque continent pour une logistique optimisée et des délais de livraison rapides pour satisfaire vos clients
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {SHIPPING_COUNTRIES.map((country) => (
            <div key={country.name} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{country.icon}</span>
                <h3 className="font-medium text-lg">{country.name}</h3>
              </div>
              <div className="space-y-1 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>{country.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{country.price.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <Truck className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Expédition rapide</h3>
            <p className="text-white/80">
              Vos commandes sont expédiées sous 24h pour une livraison express
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <Package className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Emballage sécurisé</h3>
            <p className="text-white/80">
              Tubes rigides et emballages renforcés pour une protection optimale
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <Shield className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Assurance incluse</h3>
            <p className="text-white/80">
              Toutes les commandes sont assurées et réexpédiés sans frais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}