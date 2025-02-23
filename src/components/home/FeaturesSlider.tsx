import React from 'react';
import clsx from 'clsx';
import { useAutoSlider } from '../../hooks/useAutoSlider';
import { Wand2, Palette, Layout, ShoppingBag } from 'lucide-react';

const FEATURES = [
  {
    title: "Créez vos affiches à partir de votre design",
    description: "Transformez vos créations en affiches imprimables en quelques clics. Choisissez votre papier, importez votre design, ajustez les dimensions et obtenez instantanément des produits prêts à être vendus.",
    icon: Wand2,
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/A1.webp",
    highlights: [
      "Importation simple par glisser-déposer",
      "Formats adaptés aux standards du marché",
      "Optimisation pour une impression parfaite",
      "Choix entre papier mat, glossy et art premium"
    ]
  },
  {
    title: "Créez des visuels professionnels et percutants",
    description: "Générez automatiquement des visuels ultra-réalistes pour mettre en valeur vos affiches grâce à des mises en scène professionnelles. Ajoutez facilement du texte, des badges et votre logo pour personnaliser vos images et renforcer votre marque. Adaptez vos visuels aux formats Pinterest et Instagram pour maximiser votre visibilité sur les réseaux sociaux.",
    icon: Palette,
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/A2.webp",
    highlights: [
      "Mockups en haute résolution",
      "Positionnement automatique intelligent",
      "Personnalisation avec texte, badges et logo",
      "Resize pour Pinterest et Instagram en un clic"
    ]
  },
  {
    title: "Publiez et générez des revenus sur vos boutiques",
    description: "Mettez vos affiches en vente en un seul clic. Plus besoin de longues manipulations : Pixmock automatise l’export, la mise en ligne et la création des descriptions pour vous faire gagner du temps.",
    icon: Layout,
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/A3.webp",
    highlights: [
      "Export automatique vers Etsy, Shopify et Pinterest",
      "Descriptions générées automatiquement et optimisées SEO",
      "Gestion des variantes sélectionnées",
      "Gestion simplifiée des stocks et mises à jour"
    ]
  },
  {
    title: "Analysez vos statistiques de ventes",
    description: "Gardez un œil sur vos performances et optimisez vos ventes grâce à un tableau de bord complet. Identifiez vos best-sellers, comprenez les tendances et adaptez votre stratégie en temps réel.",
    icon: ShoppingBag,
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/A4.webp",
    highlights: [
      "Tableau de bord détaillé en temps réel",
      "Identification automatique des best-sellers",
      "Analyse des comportements d’achat des clients",
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
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg" 
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
              {/* Image */}
              <div className="aspect-[2/1] overflow-hidden">
                <img 
                  src={FEATURES[activeIndex].image}
                  alt={FEATURES[activeIndex].title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 md:p-8 lg:p-12">


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