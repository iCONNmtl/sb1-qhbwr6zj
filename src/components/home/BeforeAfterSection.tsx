import React from 'react';
import { Compare } from '../ui/compare';

const ARGUMENTS = [
  {
    title: "Rendu photoréaliste",
    description: "Des ombres et reflets naturels, une profondeur de champ réaliste et des textures fidèles pour un résultat ultra-professionnel.",
    highlight: "Réaliste"
  },
  {
    title: "Taux de conversion x3",
    description: "Des images produits professionnelles renforcent la crédibilité, ce qui augmente la confiance des clients et améliore le taux de conversion.",
    highlight: "Confiance"
  },
  {
    title: "Génération instantanée",
    description: "Plus besoin d'attendre des heures. Vos visuels sont générés en quelques secondes, vous permettant de vous concentrer sur la création et la vente.",
    highlight: "Rapidité"
  }
];

export default function BeforeAfterSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des visuels photoréalistes pour mettre en avant vos produits
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Transformez instantanément vos designs en mise en scènes ultra-réalistes !
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Comparison Slider */}
          <div className="relative">
            <Compare
              firstImage="https://d2v7vpg8oce97p.cloudfront.net/Branding/before.webp"
              secondImage="https://d2v7vpg8oce97p.cloudfront.net/Branding/after.webp"
              className="w-full aspect-square rounded-2xl"
              firstImageClassName="object-cover"
              secondImageClassname="object-cover"
              slideMode="hover"
              autoplay={true}
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
              Design brut
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
              Mockup professionnel
            </div>
          </div>

          {/* Arguments */}
          <div className="space-y-12">
            {ARGUMENTS.map((arg, index) => (
              <div key={index} className="space-y-2 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-200">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {arg.title}
                  </h3>
                  <div className="text-sm font-medium text-indigo-600">
                    {arg.highlight}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {arg.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}