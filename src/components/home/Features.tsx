import React from 'react';
import { Zap, PaintBucket, Settings, Image, Clock, Users } from 'lucide-react';
import FeaturesSlider from './FeaturesSlider';

const FEATURES = [
  {
    icon: Zap,
    title: "Génération ultra rapide",
    description: "Obtenez vos mockups en quelques secondes"
  },
  {
    icon: PaintBucket,
    title: "Rendu réaliste",
    description: "Des mockups qui mettent en valeur vos designs"
  },
  {
    icon: Settings,
    title: "Processus automatisé",
    description: "Plus besoin de compétences Photoshop"
  },
  {
    icon: Image,
    title: "Export haute qualité",
    description: "Images PNG ou WEBP 2048x2048px"
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Des heures de travail économisées"
  },
  {
    icon: Users,
    title: "Collaboration facile",
    description: "Partagez vos mockups avec votre équipe"
  }
];

export default function Features() {
  return (
    <section>
      {/* Slider Section */}
      <FeaturesSlider />

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-gray-200 mt-12 pt-12 md:py-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Des fonctionnalités pensées pour vous
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="flex items-start space-x-4 p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}