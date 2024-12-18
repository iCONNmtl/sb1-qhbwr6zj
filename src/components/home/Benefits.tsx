import React from 'react';
import { Clock, MousePointerClick, ImagePlus } from 'lucide-react';

const BENEFITS = [
  {
    icon: Clock,
    title: "Gain de temps incroyable",
    description: "Générez des dizaines de mockups en quelques secondes au lieu de passer des heures sur Photoshop"
  },
  {
    icon: MousePointerClick,
    title: "Multi-génération en 1 clic",
    description: "Sélectionnez plusieurs mockups et générez-les tous simultanément pour une productivité maximale"
  },
  {
    icon: ImagePlus,
    title: "Qualité professionnelle",
    description: "Exports en haute résolution pour des présentations clients impeccables"
  }
];

export default function Benefits() {
  return (
    <section className="grid md:grid-cols-3 gap-8">
      {BENEFITS.map((benefit) => {
        const Icon = benefit.icon;
        return (
          <div
            key={benefit.title}
            className="card p-8 hover:translate-y-[-4px] transition-all duration-200"
          >
            <div className="p-3 bg-indigo-50 rounded-xl w-fit">
              <Icon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {benefit.title}
            </h3>
            <p className="mt-2 text-gray-600">
              {benefit.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}