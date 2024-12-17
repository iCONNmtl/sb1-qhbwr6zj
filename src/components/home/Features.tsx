import React from 'react';
import { Zap, Image, ShoppingBag, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Génération instantanée',
    description: 'Créez des mockups en quelques secondes, sans compétences techniques requises.'
  },
  {
    icon: Image,
    title: 'Qualité professionnelle',
    description: 'Des rendus haute résolution qui mettent en valeur vos produits.'
  },
  {
    icon: ShoppingBag,
    title: 'Optimisé e-commerce',
    description: 'Parfait pour vos fiches produits et visuels marketing.'
  },
  {
    icon: TrendingUp,
    title: 'Boost des conversions',
    description: 'Des présentations qui augmentent vos taux de conversion.'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conçu pour les professionnels de l'e-commerce
          </h2>
          <p className="text-xl text-gray-600">
            Des fonctionnalités puissantes pour des résultats exceptionnels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}