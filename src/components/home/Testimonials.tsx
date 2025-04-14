import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Designer Freelance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "MockupPro a complètement transformé mon workflow. Je peux maintenant créer des présentations client en quelques minutes au lieu de plusieurs heures sur Photoshop. Mes clients sont impressionnés par la qualité professionnelle des mockups.",
    rating: 5,
    company: 'Studio Créatif',
    location: 'Paris, France',
    highlight: 'Temps de création réduit de 85%'
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    role: 'Entrepreneur E-commerce',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "Depuis que j'utilise MockupPro, mes ventes ont augmenté de 40%. La qualité des mockups et la facilité d'intégration avec Shopify m'ont permis de lancer de nouveaux produits beaucoup plus rapidement. Le ROI est incroyable.",
    rating: 5,
    company: 'PrintDesign',
    location: 'Lyon, France',
    highlight: 'Ventes augmentées de 40%'
  },
  {
    id: 3,
    name: 'Emma Leroy',
    role: 'Directrice Marketing',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "La fonctionnalité de programmation des posts sur les réseaux sociaux est un game-changer. Nous avons pu automatiser notre stratégie de contenu et obtenir des résultats cohérents sur toutes les plateformes. L'équipe support est également exceptionnelle.",
    rating: 5,
    company: 'AgenceDigitale',
    location: 'Bordeaux, France',
    highlight: 'Engagement social multiplié par 3'
  },
  {
    id: 4,
    name: 'Alexandre Moreau',
    role: 'Artiste Digital',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "Je cherchais une solution pour présenter mes œuvres numériques de manière professionnelle sans passer des heures sur Photoshop. MockupPro m'a permis de créer des présentations magnifiques en quelques clics. Mes clients adorent le résultat!",
    rating: 5,
    company: 'Studio Numérique',
    location: 'Marseille, France',
    highlight: 'Taux de conversion client de 78%'
  },
  {
    id: 5,
    name: 'Julie Lambert',
    role: 'Propriétaire de boutique Etsy',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "MockupPro a révolutionné ma boutique Etsy. La qualité des mockups et la facilité d'utilisation sont incomparables. J'ai pu créer une gamme complète de produits en une journée, ce qui m'aurait pris des semaines auparavant.",
    rating: 5,
    company: 'Créations Uniques',
    location: 'Nantes, France',
    highlight: 'Catalogue produits multiplié par 4'
  },
  {
    id: 6,
    name: 'Marc Dupont',
    role: 'Graphiste Indépendant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "L'intégration avec les plateformes de vente est exceptionnelle. Je peux créer, publier et vendre mes designs en quelques clics. Le temps gagné me permet de me concentrer sur la création plutôt que sur la technique.",
    rating: 5,
    company: 'DesignStudio',
    location: 'Toulouse, France',
    highlight: 'Productivité augmentée de 60%'
  },
  {
    id: 7,
    name: 'Camille Roux',
    role: 'Responsable E-commerce',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "La qualité des mockups générés est impressionnante. Nos produits se vendent beaucoup mieux depuis que nous utilisons MockupPro pour nos visuels. Le retour sur investissement a été immédiat.",
    rating: 5,
    company: 'ModeBoutique',
    location: 'Nice, France',
    highlight: 'ROI de 300% en 2 mois'
  },
  {
    id: 8,
    name: 'Antoine Lefebvre',
    role: 'Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "J'ai essayé plusieurs solutions avant de découvrir MockupPro. C'est de loin la plus complète et la plus simple à utiliser. Je recommande à 100% pour tous les entrepreneurs qui veulent gagner du temps et de l'argent.",
    rating: 5,
    company: 'StartupInnovante',
    location: 'Lille, France',
    highlight: 'Économie de 200€/mois'
  },
  {
    id: 9,
    name: 'Lucie Bernard',
    role: 'Illustratrice',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "Mes illustrations prennent vie grâce à MockupPro. Je peux maintenant présenter mon travail de manière professionnelle sans avoir besoin de compétences techniques avancées. Un outil indispensable pour tout créatif!",
    rating: 5,
    company: 'ArtCréatif',
    location: 'Strasbourg, France',
    highlight: 'Ventes augmentées de 55%'
  }
];

// Diviser les témoignages en groupes de 3
const TESTIMONIAL_GROUPS = [];
for (let i = 0; i < TESTIMONIALS.length; i += 3) {
  TESTIMONIAL_GROUPS.push(TESTIMONIALS.slice(i, i + 3));
}

export default function Testimonials() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [direction, setDirection] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setActiveGroupIndex((prev) => (prev + 1) % TESTIMONIAL_GROUPS.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setDirection(-1);
    setActiveGroupIndex((prev) => (prev - 1 + TESTIMONIAL_GROUPS.length) % TESTIMONIAL_GROUPS.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setDirection(1);
    setActiveGroupIndex((prev) => (prev + 1) % TESTIMONIAL_GROUPS.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce que nos clients disent de nous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment Pixmock transforme le quotidien de nos utilisateurs
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main testimonial slider */}
          <div className="relative overflow-hidden min-h-[500px] md:min-h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeGroupIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <div className="grid md:grid-cols-3 gap-6 h-full">
                  {TESTIMONIAL_GROUPS[activeGroupIndex].map((testimonial) => (
                    <div 
                      key={testimonial.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start mb-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1">
                              <Quote className="h-2 w-2 text-white" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                            <div className="flex items-center mt-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4 flex-grow">
                          <p className="text-gray-700 text-sm italic leading-relaxed">
                            "{testimonial.content}"
                          </p>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white shadow-lg text-gray-800 hover:bg-gray-100 transition-colors pointer-events-auto"
              aria-label="Témoignages précédents"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white shadow-lg text-gray-800 hover:bg-gray-100 transition-colors pointer-events-auto"
              aria-label="Témoignages suivants"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {TESTIMONIAL_GROUPS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setDirection(index > activeGroupIndex ? 1 : -1);
                  setActiveGroupIndex(index);
                }}
                className={clsx(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeGroupIndex === index
                    ? "bg-indigo-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Voir groupe de témoignages ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}