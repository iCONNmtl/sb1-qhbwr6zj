import React from 'react';
import { 
  Wand2, 
  Upload, 
  ShoppingBag, 
  Image as ImageIcon, 
  BarChart2,
  ArrowRight,
  Clock,
  Globe2,
  TrendingUp,
  DollarSign,
  Truck,
  Star,
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Compare } from '../ui/compare';
import clsx from 'clsx';

// Feature block data
const FEATURE_BLOCKS = [
  {
    title: "Qu'est-ce que Pixmock ?",
    description: "Pixmock est la plateforme créative tout-en-un pensée pour les marques et créateurs en Print on Demand. Générez, éditez et publiez facilement vos visuels, configurez vos produits, gérez vos commandes, et boostez vos ventes grâce à des outils puissants réunis au même endroit.",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Home1.webp",
    icon: Wand2,
    color: "from-blue-500 to-indigo-600",
    link: "/mockups",
    linkText: "Découvrir notre librairie",
    stats: [
      { icon: Star, value: "100%", label: "Clients Satisfaits" },
      { icon: DollarSign, value: "+10K", label: "Affiches vendus" },
      { icon: TrendingUp, value: "Mise à jour", label: "Régulièrement" }
    ]
  },
  {
    title: "Créez ou importez vos designs",
    description: "Créez vos visuels avec notre outils ou importez vos créations existantes. Utilisez notre éditeur intégré façon Photoshop pour personnaliser chaque détail : texte, couleurs, formes, calques… Aucune compétence technique requise.",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Home2.webp",
    icon: Upload,
    color: "from-purple-500 to-pink-600",
    link: "/design-generator",
    linkText: "Essayer le générateur AI",
    stats: [
      { icon: Wand2, value: "Intuitif", label: "Technologie" },
      { icon: Clock, value: "10 sec", label: "Temps de génération" },
      { icon: Star, value: "Illimité", label: "Nombre de designs" }
    ]
  },
  {
    title: "Configurez vos produits",
    description: "Associez vos designs à nos produits Print on Demand (Art, Mat, Semi-Glossy). Définissez facilement les tailles, variantes, marges et intégrez votre boutique Shopify ou Etsy en quelques clics.",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Home3.webp",
    icon: ShoppingBag,
    color: "from-amber-500 to-orange-600",
    link: "/products",
    linkText: "Explorer les produits",
    stats: [
      { icon: Store, value: "3", label: "Produits disponibles" },
      { icon: ShoppingBag, value: "11+", label: "Formats disponibles" },
      { icon: Globe2, value: "Mondial", label: "Réseau d'impression" }
    ],
    highlight: {
      title: "Livraison mondiale",
      description: "Expédition dans le monde entier avec suivi en temps réel",
      icon: Truck
    }
  },
  {
    title: "Générez vos images produits",
    description: "Grâce à nos modèles de mockups et notre moteur de génération, Pixmock vous permet de créer automatiquement des images produits professionnelles prêtes à vendre. Gagnez du temps et assurez un rendu visuel cohérent sur toute votre boutique.",
    useCompare: true,
    firstImage: "https://d2v7vpg8oce97p.cloudfront.net/Branding/before.webp",
    secondImage: "https://d2v7vpg8oce97p.cloudfront.net/Branding/after.webp",
    icon: ImageIcon,
    color: "from-emerald-500 to-teal-600",
    link: "/generator",
    linkText: "Générer des mockups",
    stats: [
      { icon: Clock, value: "20 secondes", label: "Temps d'une génération" },
      { icon: ImageIcon, value: "2048x2048px", label: "Qualité d'image" },
      { icon: Star, value: "100+", label: "Mockups disponibles" }
    ]
  },
  {
    title: "Gérez vos commandes et analysez vos stats",
    description: "Suivez vos ventes en temps réel, gérez vos commandes et analysez vos performances depuis un tableau de bord simple et complet. Pilotez votre activité et optimisez vos revenus grâce à des données claires et exploitables.",
    image: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Home4.webp",
    icon: BarChart2,
    color: "from-rose-500 to-red-600",
    link: "/orders",
    linkText: "Voir le tableau de bord",
    stats: [
      { icon: BarChart2, value: "+5", label: "Onglets de statistiques" },
      { icon: Clock, value: "Mise à jour", label: "Temps réel" },
      { icon: Truck, value: "24h", label: "Traitement commande" }
    ],
    testimonial: {
      quote: "J'ai multiplié mon chiffre d'affaires par 3 en seulement 2 mois grâce à Pixmock !",
      author: "Sophie M., Créatrice d'affiches",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
    }
  }
];

export default function FeatureBlocks() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Tout ce dont vous avez besoin pour réussir
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Une solution complète pour créer, présenter et vendre vos designs
        </p>
      </div>

      <div className="space-y-24">
        {FEATURE_BLOCKS.map((block, index) => {
          const isEven = index % 2 === 0;
          const Icon = block.icon;
          
          return (
            <div 
              key={index}
              className={clsx(
                "flex flex-col md:flex-row items-center gap-8 md:gap-16",
                !isEven && "md:flex-row-reverse"
              )}
            >
              {/* Image or Compare Component */}
              <div className="w-full md:w-1/2 relative">
                <div className={clsx(
                  "absolute -inset-4 rounded-2xl"
                )} />
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                  {block.useCompare ? (
                    <div className="w-full h-full">
                      <Compare
                        firstImage={block.firstImage}
                        secondImage={block.secondImage}
                        className="w-full h-full rounded-2xl"
                        firstImageClassName="object-cover"
                        secondImageClassname="object-cover"
                        slideMode="hover"
                        autoplay={true}
                      />
                      
                      {/* Labels */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 z-10">
                        Design brut
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 z-10">
                        Mockup professionnel
                      </div>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={block.image} 
                        alt={block.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 pointer-events-none" />
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className={clsx(
                  "inline-flex items-center px-4 py-2 rounded-full text-white font-medium text-sm",
                  `bg-gradient-to-r ${block.color}`
                )}>
                  <Icon className="h-4 w-4 mr-2" />
                  <span>Étape {index + 1}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {block.title}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {block.description}
                </p>

                {/* Stats moved here */}
                {block.stats && (
                  <div className="grid grid-cols-3 gap-2">
                    {block.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="bg-white rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <stat.icon className="h-4 w-4 text-indigo-600" />
                          <span className="font-semibold text-gray-900">{stat.value}</span>
                        </div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlight Box */}
                {block.highlight && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                      <block.highlight.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900">{block.highlight.title}</h4>
                      <p className="text-sm text-amber-800 mt-1">{block.highlight.description}</p>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}