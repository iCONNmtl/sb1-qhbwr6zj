import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Sparkles, Droplets, Frame, Star, Globe2, Printer, Truck, Shield } from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import clsx from 'clsx';

const PRODUCTS = [
  {
    id: 'poster-mat',
    name: 'Poster Mat Premium',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    icon: Droplets,
    features: [
      'Papier premium 250g/m²',
      'Finition mate anti-reflets',
      'Rendu artistique',
      'Idéal pour la décoration',
      'Certifié FSC'
    ],
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2574',
    startingPrice: 15,
    rating: 4.8,
    reviewCount: 127
  },
  {
    id: 'poster-glossy',
    name: 'Poster Brillant Premium',
    description: 'Impression brillante éclatante sur papier photo 250g/m²',
    icon: Sparkles,
    features: [
      'Papier photo 250g/m²',
      'Finition ultra-brillante',
      'Couleurs éclatantes',
      'Idéal pour les photos',
      'Certifié FSC'
    ],
    image: 'https://images.unsplash.com/photo-1581430872221-d1cfed785922?auto=format&fit=crop&q=80&w=2670',
    startingPrice: 18,
    rating: 4.9,
    reviewCount: 243
  },
  {
    id: 'poster-frame',
    name: 'Poster Encadré',
    description: 'Vos posters encadrés avec élégance dans des cadres en aluminium',
    icon: Frame,
    features: [
      'Cadre aluminium premium',
      'Verre anti-reflets',
      'Montage professionnel',
      'Prêt à accrocher',
      'Protection UV'
    ],
    image: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&q=80&w=2512',
    startingPrice: 35,
    rating: 4.7,
    reviewCount: 89
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
      <div className="grid md:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => {
          const Icon = product.icon;
          return (
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
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      À partir de {product.startingPrice}€
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={product.rating} showRating />
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount} avis)
                  </span>
                </div>

                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className={clsx(
                    'block w-full py-3 px-4 text-center rounded-xl transition-all duration-200',
                    'bg-indigo-600 text-white group-hover:bg-indigo-700'
                  )}
                >
                  Voir le produit
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Printer Network Info */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 to-pink-500 rounded-2xl p-8 text-white">
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