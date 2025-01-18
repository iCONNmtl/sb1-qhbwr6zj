import React from 'react';
import clsx from 'clsx';
import { useAutoSlider } from '../../hooks/useAutoSlider';

const FEATURES = [
  {
    title: "Bibliothèque complète de mockups",
    description: "Accédez à une large collection de mockups professionnels, enrichie chaque semaine avec de nouveaux modèles pour rester à la pointe des tendances. Des mockups adaptés à tous vos besoins, du web au mobile en passant par le print.",
  },
  {
    title: "Importez vos propres mockups",
    description: "Créez et partagez vos propres mockups personnalisés. Notre outil vous permet d'ajouter facilement vos créations à votre bibliothèque privée. Gardez le contrôle total sur vos designs et adaptez-les à votre marque.",
  },
  {
    title: "Génération rapide et professionnelle", 
    description: "Gagnez un temps précieux en générant vos mockups en quelques secondes. Obtenez des résultats professionnels sans compromis sur la qualité. Notre technologie avancée assure des rendus réalistes et percutants.",
  },
  {
    title: "Export et partage simplifiés",
    description: "Exportez vos mockups en haute résolution et partagez-les directement sur vos réseaux sociaux préférés. Intégration native avec Instagram, Pinterest et les principales plateformes e-commerce pour une diffusion optimale de vos créations.",
  }
];

export default function FeaturesSlider() {
  const { activeIndex, goTo, setIsPaused } = useAutoSlider({
    itemsCount: FEATURES.length,
    interval: 5000
  });

  return (
    <section className="bg-gray-50 pt-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Pourquoi choisir Pixmock ?
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Numbers */}
          <div className="flex lg:flex-col gap-2 justify-center">
            {FEATURES.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className={clsx(
                  "group flex items-center transition-all duration-300",
                  "w-full lg:w-64 p-3 rounded-xl",
                  activeIndex === index 
                    ? "bg-white shadow-lg" 
                    : "hover:bg-white/50"
                )}
              >
                {/* Icon Container */}
                <div className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  activeIndex === index 
                    ? "bg-indigo-50" 
                    : "bg-white group-hover:bg-indigo-50"
                )}>
                  <div className={clsx(
                    "text-sm font-medium transition-colors duration-300",
                    activeIndex === index 
                      ? "text-indigo-600" 
                      : "text-gray-400 group-hover:text-indigo-600"
                  )}>
                    {index + 1}
                  </div>
                </div>
                
                {/* Title */}
                <div className={clsx(
                  "ml-3 font-medium text-left transition-colors duration-300",
                  activeIndex === index ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                )}>
                  {FEATURES[index].title}
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div 
            className="flex-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-8 lg:p-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  {FEATURES[activeIndex].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {FEATURES[activeIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}