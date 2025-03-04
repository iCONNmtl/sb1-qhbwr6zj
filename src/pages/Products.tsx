import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Globe2, Truck, Shield } from 'lucide-react';
import clsx from 'clsx';

const PRODUCTS = [
  {
    id: 'art-poster',
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Art.webp',
    startingPrice: 12,
    rating: 4.8,
    reviewCount: 127
  },
  {
    id: 'premium-mat',
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Mat.webp',
    startingPrice: 15,
    rating: 4.9,
    reviewCount: 243
  },
  {
    id: 'premium-semigloss',
    name: 'Poster Premium Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    image: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Glossy.webp',
    startingPrice: 15,
    rating: 4.7,
    reviewCount: 189
  }
];

const SHIPPING_COUNTRIES = [
  { name: 'France', time: '2-3 jours', price: 5.90 },
  { name: 'Belgique', time: '3-4 jours', price: 7.90 },
  { name: 'Suisse', time: '4-5 jours', price: 9.90 },
  { name: 'Luxembourg', time: '3-4 jours', price: 7.90 },
  { name: 'Allemagne', time: '3-4 jours', price: 7.90 },
  { name: 'Italie', time: '4-5 jours', price: 8.90 },
  { name: 'Espagne', time: '4-5 jours', price: 8.90 },
  { name: 'Pays-Bas', time: '3-4 jours', price: 7.90 }
];

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nos produits d'impression
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Des impressions de qualité professionnelle pour mettre en valeur vos créations
        </p>
      </div>

      {/* Worldwide Shipping Banner */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe2 className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Expédition dans le monde entier</h2>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Livraison rapide et sécurisée dans des tubes rigides pour une protection optimale de vos posters
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {SHIPPING_COUNTRIES.map((country) => (
            <div key={country.name} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h3 className="font-medium text-lg mb-2">{country.name}</h3>
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
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  À partir de {product.startingPrice}€
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-1" />
                  Qualité garantie
                </div>
              </div>

              <div className="mt-4 flex items-center text-indigo-600 group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-medium">Voir le produit</span>
                <svg className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quality Guarantee */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Livraison rapide
            </h3>
            <p className="text-gray-600">
              Expédition sous 24h pour toute commande passée avant 15h
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Emballage sécurisé
            </h3>
            <p className="text-gray-600">
              Tube rigide pour une protection optimale pendant le transport
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Garantie qualité
            </h3>
            <p className="text-gray-600">
              Satisfait ou remboursé sous 30 jours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}