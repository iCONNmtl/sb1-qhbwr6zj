import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Sparkles, Droplets, Frame, Star, Globe2, Printer, Truck, Shield } from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import clsx from 'clsx';

const PRODUCTS = [
  {
    id: 'art-poster',
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    startingPrice: 12,
    rating: 4.8,
    reviewCount: 127
  },
  {
    id: 'premium-mat',
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    image: 'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670',
    startingPrice: 15,
    rating: 4.9,
    reviewCount: 243
  },
  {
    id: 'premium-semigloss',
    name: 'Poster Premium Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 250g/m²',
    image: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    startingPrice: 15,
    rating: 4.7,
    reviewCount: 189
  },
  {
    id: 'classic-mat',
    name: 'Poster Classique Mat',
    description: 'Impression mate sur papier 180g/m²',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426',
    startingPrice: 10,
    rating: 4.6,
    reviewCount: 156
  },
  {
    id: 'classic-semigloss',
    name: 'Poster Classique Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 180g/m²',
    image: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&q=80&w=2000',
    startingPrice: 10,
    rating: 4.5,
    reviewCount: 134
  }
];

const PRINTER_NETWORK = [
  {
    region: 'Europe',
    locations: ['Paris', 'Berlin', 'Milan', 'Amsterdam'],
    deliveryTime: '2-3 jours'
  },
  {
    region: 'Amérique du Nord',
    locations: ['New York', 'Los Angeles', 'Toronto', 'Chicago'],
    deliveryTime: '3-5 jours'
  },
  {
    region: 'Asie-Pacifique',
    locations: ['Tokyo', 'Sydney', 'Singapour', 'Séoul'],
    deliveryTime: '4-6 jours'
  }
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
          Des impressions de qualité professionnelle pour mettre en valeur vos créations. Choisissez parmi notre gamme de finitions et de formats.
        </p>
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

      {/* Printer Network Info */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Un réseau d'imprimeurs d'excellence
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Nous collaborons avec les meilleurs imprimeurs à travers le monde pour garantir une qualité exceptionnelle et des délais de livraison optimaux.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRINTER_NETWORK.map((region) => (
            <div key={region.region} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe2 className="h-6 w-6 text-white" />
                <h3 className="text-lg font-semibold">{region.region}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4 text-white/70" />
                  <span>{region.locations.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-white/70" />
                  <span>Livraison en {region.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="font-bold text-2xl mb-1">15+</div>
            <div className="text-white/90">Centres d'impression</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="font-bold text-2xl mb-1">24/7</div>
            <div className="text-white/90">Production continue</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="font-bold text-2xl mb-1">98%</div>
            <div className="text-white/90">Satisfaction client</div>
          </div>
        </div>
      </div>

      {/* Quality Commitment */}
      <div className="bg-white rounded-2xl shadow-sm p-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Notre engagement qualité
          </h2>
          <p className="text-lg text-gray-600">
            Un réseau international d'imprimeurs certifiés pour une qualité exceptionnelle
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Printer className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Imprimeurs certifiés
            </h3>
            <p className="text-gray-600">
              Nos partenaires sont rigoureusement sélectionnés selon des critères stricts de qualité.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe2 className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Réseau international
            </h3>
            <p className="text-gray-600">
              Des centres d'impression dans le monde entier pour une livraison rapide et locale.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Qualité garantie
            </h3>
            <p className="text-gray-600">
              Chaque impression est vérifiée et validée selon nos standards de qualité.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Livraison optimisée
            </h3>
            <p className="text-gray-600">
              Production au plus près du client pour des délais de livraison réduits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}