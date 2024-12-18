import React from 'react';
import { Zap, PaintBucket, Settings, Image, Clock, Users } from 'lucide-react';

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
    description: "Images JPG jusqu'à 4K"
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
    <section className="card p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pourquoi choisir MockupPro ?
        </h2>
        <p className="text-xl text-gray-600">
          Des fonctionnalités pensées pour les professionnels
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div 
              key={feature.title} 
              className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}