import React from 'react';
import clsx from 'clsx';
import { useAutoSlider } from '../../hooks/useAutoSlider';
import { Wand2, Palette, Layout, ShoppingBag } from 'lucide-react';

const FEATURES = [
  {
    title: "Créez vos affiches à partir de votre design",
    description: "Transformez instantanément vos designs en mockups professionnels. Notre technologie avancée s'occupe de tout : positionnement intelligent, ajustement des perspectives et rendu photoréaliste. Importez simplement votre design et laissez la magie opérer.",
    icon: Wand2,
    highlights: [
      "Importation simple par glisser-déposer",
      "Positionnement automatique intelligent",
      "Rendu photoréaliste instantané",
      "Plus de 100 mockups disponibles"
    ]
  },
  {
    title: "Créez des visuels professionnels et percutants",
    description: "Donnez vie à vos designs avec notre collection exclusive de mockups haute qualité. Chaque template est soigneusement conçu pour mettre en valeur votre travail et impressionner vos clients avec des rendus dignes des plus grandes marques.",
    icon: Palette,
    highlights: [
      "Mockups en haute résolution 4K",
      "Effets de lumière et d'ombre réalistes",
      "Perspectives et angles variés",
      "Templates exclusifs premium"
    ]
  },
  {
    title: "Éditez et adaptez pour les réseaux sociaux",
    description: "Un outil complet de personnalisation pour adapter vos mockups à chaque plateforme. Ajoutez du texte, votre logo, des images et optimisez automatiquement les formats pour Instagram, Pinterest et bien plus encore.",
    icon: Layout,
    highlights: [
      "Formats optimisés pour chaque réseau",
      "Éditeur de texte avancé",
      "Gestion des calques intuitive",
      "Export multi-formats en un clic"
    ]
  },
  {
    title: "Générez des revenus sur les marketplaces",
    description: "Transformez vos designs en source de revenus passive. Publiez directement vos créations sur Etsy, Shopify et d'autres marketplaces populaires. Notre système automatisé gère tout le processus de publication et de mise en ligne.",
    icon: ShoppingBag,
    highlights: [
      "Publication automatisée sur Etsy",
      "Intégration Shopify native",
      "Gestion multi-boutiques centralisée",
      "Analytics et suivi des ventes"
    ]
  }
];

export default function FeaturesSlider() {
  const { activeIndex, goTo, setIsPaused } = useAutoSlider({
    itemsCount: FEATURES.length,
    interval: 5000
  });

  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Une solution complète pour vos mockups
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation - Responsive */}
          <div className="flex flex-col gap-2 lg:w-80">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={clsx(
                      "group flex items-center transition-all duration-300",
                      "min-w-[280px] lg:min-w-0 p-3 rounded-xl",
                      activeIndex === index 
                        ? "bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 shadow-lg" 
                        : "hover:bg-white/50"
                    )}
                  >
                    {/* Icon Container */}
                    <div className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      activeIndex === index 
                        ? "bg-white/20" 
                        : "bg-white group-hover:bg-indigo-50"
                    )}>
                      <Icon className={clsx(
                        "h-5 w-5 transition-colors duration-300",
                        activeIndex === index 
                          ? "text-white" 
                          : "text-gray-400 group-hover:text-indigo-600"
                      )} />
                    </div>
                    
                    {/* Title */}
                    <div className={clsx(
                      "ml-3 font-medium text-left transition-colors duration-300",
                      activeIndex === index 
                        ? "text-white" 
                        : "text-gray-500 group-hover:text-gray-900"
                    )}>
                      {feature.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content - Responsive */}
          <div 
            className="flex-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 md:p-8 lg:p-12">
                {/* Icon */}
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  {React.createElement(FEATURES[activeIndex].icon, {
                    className: "h-6 w-6 text-indigo-600"
                  })}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                  {FEATURES[activeIndex].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-8">
                  {FEATURES[activeIndex].description}
                </p>

                {/* Highlights - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FEATURES[activeIndex].highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}