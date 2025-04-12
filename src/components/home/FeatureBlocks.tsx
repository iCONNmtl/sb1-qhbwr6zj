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
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Compare } from '../ui/compare';
import clsx from 'clsx';

// Feature block data
const FEATURE_BLOCKS = [
  {
    title: "Qu'est-ce que Pixmock ?",
    description: "Pixmock est une plateforme tout-en-un qui transforme vos designs en mockups professionnels en quelques secondes. Notre technologie avancée vous permet de créer des présentations percutantes pour vos clients et vos réseaux sociaux.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2000&auto=format&fit=crop",
    icon: Wand2,
    color: "from-blue-500 to-indigo-600",
    link: "/mockups",
    linkText: "Découvrir notre librairie",
    stats: [
      { icon: Star, value: "4.9/5", label: "Note moyenne" },
      { icon: Clock, value: "0.5s", label: "Génération par mockup" },
      { icon: TrendingUp, value: "+300%", label: "Taux de conversion" }
    ]
  },
  {
    title: "Créez ou importez vos designs",
    description: "Utilisez notre générateur AI pour créer des designs uniques ou importez vos propres créations. Notre éditeur visuel vous permet de personnaliser chaque aspect de votre design avec une interface intuitive.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
    icon: Upload,
    color: "from-purple-500 to-pink-600",
    link: "/design-generator",
    linkText: "Essayer le générateur AI",
    stats: [
      { icon: Wand2, value: "IA avancée", label: "Technologie" },
      { icon: Clock, value: "10 sec", label: "Temps de génération" },
      { icon: Star, value: "Illimité", label: "Nombre de designs" }
    ]
  },
  {
    title: "Créez votre produit",
    description: "Transformez vos designs en produits prêts à vendre. Choisissez parmi une variété de formats et de tailles, définissez vos prix et créez des fiches produits optimisées pour maximiser vos ventes.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=2000&auto=format&fit=crop",
    icon: ShoppingBag,
    color: "from-amber-500 to-orange-600",
    link: "/products",
    linkText: "Explorer les produits",
    stats: [
      { icon: DollarSign, value: "70%", label: "Marge bénéficiaire" },
      { icon: ShoppingBag, value: "11+", label: "Formats disponibles" },
      { icon: Globe2, value: "Mondial", label: "Réseau d'impression" }
    ],
    highlight: {
      title: "Livraison mondiale",
      description: "Expédition dans plus de 40 pays avec suivi en temps réel",
      icon: Truck
    }
  },
  {
    title: "Générez vos images produits",
    description: "Créez des mockups photoréalistes qui mettent en valeur vos designs. Notre technologie avancée génère des images de qualité professionnelle adaptées à chaque plateforme de vente et réseau social.",
    useCompare: true,
    firstImage: "https://d2v7vpg8oce97p.cloudfront.net/Branding/before.webp",
    secondImage: "https://d2v7vpg8oce97p.cloudfront.net/Branding/after.webp",
    icon: ImageIcon,
    color: "from-emerald-500 to-teal-600",
    link: "/generator",
    linkText: "Générer des mockups",
    stats: [
      { icon: Clock, value: "2 min", label: "Temps gagné par image" },
      { icon: ImageIcon, value: "4K", label: "Qualité d'image" },
      { icon: Star, value: "100+", label: "Mockups disponibles" }
    ]
  },
  {
    title: "Gérez vos commandes et analysez vos stats",
    description: "Suivez vos commandes, gérez vos expéditions et analysez vos performances de vente en temps réel. Notre tableau de bord intuitif vous donne toutes les informations nécessaires pour optimiser votre business.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    icon: BarChart2,
    color: "from-rose-500 to-red-600",
    link: "/orders",
    linkText: "Voir le tableau de bord",
    stats: [
      { icon: TrendingUp, value: "+45%", label: "Croissance moyenne" },
      { icon: DollarSign, value: "12k€", label: "CA moyen mensuel" },
      { icon: Clock, value: "24h", label: "Traitement commande" }
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 pointer-events-none" />
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