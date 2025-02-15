import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Sparkles, Droplets, Frame } from 'lucide-react';
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
    startingPrice: 15
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
    startingPrice: 18
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
    startingPrice: 35
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

      {/* Features */}
      <div className="bg-white rounded-2xl shadow-sm p-12 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Une qualité d'impression exceptionnelle
          </h2>
          <p className="text-lg text-gray-600">
            Nos produits sont imprimés avec les meilleures technologies pour un rendu professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Emballage sécurisé
            </h3>
            <p className="text-gray-600">
              Vos impressions sont soigneusement emballées dans des tubes rigides pour une protection optimale pendant le transport.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Qualité professionnelle
            </h3>
            <p className="text-gray-600">
              Nos imprimantes professionnelles et nos papiers haut de gamme garantissent des impressions de qualité exceptionnelle.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Frame className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Finitions premium
            </h3>
            <p className="text-gray-600">
              Choisissez parmi nos différentes finitions pour sublimer vos créations et leur donner un aspect professionnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}