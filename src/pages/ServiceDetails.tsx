import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  FileCheck, 
  Download, 
  ShoppingBag, 
  Star, 
  MessageSquare,
  ArrowRight,
  Palette,
  Layers,
  Briefcase
} from 'lucide-react';

// Services data
const SERVICES = {
  'design-pack': {
    id: 'design-pack',
    name: 'Pack de Designs Personnalisés',
    description: 'Designs uniques créés par nos graphistes professionnels pour votre business',
    longDescription: 'Notre pack de designs personnalisés est conçu pour vous fournir des créations uniques et professionnelles qui correspondent parfaitement à votre marque et à vos produits. Nos graphistes expérimentés travaillent en étroite collaboration avec vous pour comprendre votre vision et la transformer en designs prêts à être vendus.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    price: 149,
    features: [
      '5 designs originaux et exclusifs',
      'Formats adaptés à tous vos produits',
      '2 révisions incluses',
      'Livraison en 7 jours',
      'Fichiers sources inclus (PSD, AI)',
      'Droits d\'utilisation commerciale complets',
      'Assistance post-livraison de 30 jours'
    ],
    icon: Palette,
    process: [
      {
        title: 'Briefing',
        description: 'Nous discutons de vos besoins, de votre marque et de vos préférences'
      },
      {
        title: 'Conception',
        description: 'Nos designers créent des ébauches basées sur votre briefing'
      },
      {
        title: 'Révisions',
        description: 'Vous pouvez demander jusqu\'à 2 séries de modifications'
      },
      {
        title: 'Finalisation',
        description: 'Nous peaufinons les designs et préparons les fichiers finaux'
      },
      {
        title: 'Livraison',
        description: 'Vous recevez tous les fichiers sources et formats d\'export'
      }
    ],
    testimonials: [
      {
        name: 'Sophie M.',
        role: 'Propriétaire de boutique Etsy',
        content: 'Les designs créés par l\'équipe ont transformé ma boutique. Mes ventes ont augmenté de 40% dès le premier mois !',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
      },
      {
        name: 'Thomas R.',
        role: 'Entrepreneur e-commerce',
        content: 'Service exceptionnel et designs de grande qualité. Le processus était fluide et les résultats ont dépassé mes attentes.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
      }
    ],
    faq: [
      {
        question: 'Combien de temps faut-il pour recevoir mes designs ?',
        answer: 'Le délai standard est de 7 jours ouvrés à partir de la validation du briefing. Pour les demandes urgentes, nous proposons une option de livraison express en 3 jours moyennant un supplément.'
      },
      {
        question: 'Puis-je demander des modifications après la livraison ?',
        answer: 'Le pack inclut 2 séries de révisions pendant le processus de création. Après la livraison finale, des modifications supplémentaires peuvent être effectuées moyennant des frais additionnels.'
      },
      {
        question: 'Quels formats de fichiers vais-je recevoir ?',
        answer: 'Vous recevrez les fichiers sources (PSD, AI) ainsi que des exports en haute résolution (PNG, JPG, PDF) adaptés à l\'impression et au web.'
      }
    ]
  },
  'mockup-pack': {
    id: 'mockup-pack',
    name: 'Pack de Mockups Personnalisés',
    description: 'Mockups sur mesure pour vos produits spécifiques avec un rendu photoréaliste',
    longDescription: 'Notre pack de mockups personnalisés vous permet de présenter vos produits de manière professionnelle et réaliste. Que vous ayez besoin de mockups pour des produits physiques, des emballages ou des présentations digitales, nos designers créeront des templates parfaitement adaptés à vos besoins spécifiques.',
    image: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    price: 199,
    features: [
      '3 mockups personnalisés',
      'Adaptés à vos produits spécifiques',
      'Rendu photoréaliste',
      'Fichiers sources inclus (PSD)',
      'Smart Objects pour une mise à jour facile',
      'Angles et perspectives multiples',
      'Support technique inclus'
    ],
    icon: Layers,
    process: [
      {
        title: 'Consultation',
        description: 'Nous discutons de vos besoins spécifiques et des produits à présenter'
      },
      {
        title: 'Conception',
        description: 'Nos designers créent des mockups sur mesure pour vos produits'
      },
      {
        title: 'Rendu',
        description: 'Nous appliquons des textures, ombres et reflets réalistes'
      },
      {
        title: 'Révisions',
        description: 'Vous pouvez demander des ajustements pour parfaire le résultat'
      },
      {
        title: 'Livraison',
        description: 'Vous recevez les fichiers PSD avec Smart Objects et exports'
      }
    ],
    testimonials: [
      {
        name: 'Marc D.',
        role: 'Designer produit',
        content: 'Ces mockups ont révolutionné ma façon de présenter mes produits. Le rendu est si réaliste que mes clients pensent voir des photos réelles !',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
      },
      {
        name: 'Julie L.',
        role: 'Propriétaire de marque',
        content: 'L\'investissement en vaut vraiment la peine. J\'utilise ces mockups pour toutes mes campagnes marketing et les résultats sont impressionnants.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
      }
    ],
    faq: [
      {
        question: 'Puis-je demander des mockups pour des produits spécifiques ?',
        answer: 'Absolument ! C\'est justement l\'objectif de ce service. Nous créons des mockups sur mesure pour vos produits spécifiques, qu\'il s\'agisse d\'affiches, de vêtements, d\'emballages ou d\'autres articles.'
      },
      {
        question: 'Comment fonctionne la mise à jour des designs dans les mockups ?',
        answer: 'Tous nos mockups sont livrés avec des Smart Objects dans Photoshop, ce qui vous permet de mettre à jour vos designs en quelques clics. Il vous suffit de remplacer le contenu du Smart Object et le mockup se met automatiquement à jour.'
      },
      {
        question: 'Ai-je besoin de Photoshop pour utiliser les mockups ?',
        answer: 'Pour profiter pleinement des fonctionnalités d\'édition, Photoshop est recommandé. Cependant, nous fournissons également des exports en PNG haute résolution que vous pouvez utiliser immédiatement.'
      }
    ]
  },
  'branding-pack': {
    id: 'branding-pack',
    name: 'Pack Branding Complet',
    description: 'Solution complète pour votre identité de marque, du logo aux supports marketing',
    longDescription: 'Notre pack branding complet est la solution idéale pour les entrepreneurs qui souhaitent établir une identité de marque cohérente et professionnelle. De la conception du logo à la création de supports marketing, nous vous accompagnons dans toutes les étapes de la construction de votre image de marque.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    price: 349,
    features: [
      'Logo et identité visuelle',
      'Charte graphique complète',
      '5 designs exclusifs',
      '3 mockups personnalisés',
      'Bannières pour réseaux sociaux',
      'Cartes de visite et papeterie',
      'Guide d\'utilisation de la marque',
      'Fichiers sources de tous les éléments'
    ],
    icon: Briefcase,
    process: [
      {
        title: 'Analyse',
        description: 'Nous étudions votre marché, votre cible et vos concurrents'
      },
      {
        title: 'Stratégie',
        description: 'Nous définissons le positionnement et les valeurs de votre marque'
      },
      {
        title: 'Conception',
        description: 'Nous créons votre logo et les éléments visuels de votre identité'
      },
      {
        title: 'Application',
        description: 'Nous déclinons votre identité sur différents supports'
      },
      {
        title: 'Finalisation',
        description: 'Nous livrons tous les fichiers et le guide d\'utilisation'
      }
    ],
    testimonials: [
      {
        name: 'Alexandre P.',
        role: 'Fondateur de startup',
        content: 'Ce pack a été un investissement crucial pour le lancement de ma marque. L\'équipe a parfaitement compris ma vision et l\'a transformée en une identité visuelle cohérente et impactante.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
      },
      {
        name: 'Emma B.',
        role: 'Créatrice de contenu',
        content: 'La qualité du travail est exceptionnelle. J\'ai maintenant une marque professionnelle qui me démarque vraiment de la concurrence. Le retour sur investissement a été immédiat.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80'
      }
    ],
    faq: [
      {
        question: 'Que comprend exactement la charte graphique ?',
        answer: 'La charte graphique inclut la définition des couleurs (avec codes HEX, RGB, CMYK), les typographies principales et secondaires, les règles d\'utilisation du logo (tailles minimales, espaces de protection, versions), les éléments graphiques secondaires et les exemples d\'application.'
      },
      {
        question: 'Combien de propositions de logo recevrai-je ?',
        answer: 'Vous recevrez 3 propositions de concepts de logo différents. Après avoir choisi votre direction préférée, nous travaillerons sur 2 séries de révisions pour perfectionner le design final.'
      },
      {
        question: 'Est-ce que je peux utiliser mon branding pour tous types de supports ?',
        answer: 'Oui, vous recevrez tous les fichiers nécessaires pour utiliser votre identité de marque sur tous les supports, qu\'ils soient imprimés ou digitaux. Nous fournissons également un guide d\'utilisation pour vous aider à maintenir la cohérence de votre marque.'
      }
    ]
  }
};

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES[id as keyof typeof SERVICES];

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Service non trouvé</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Retour aux produits
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Icon className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {service.name}
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {service.longDescription}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-indigo-600">
              {service.price}€
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Livraison en 7 jours
            </div>
          </div>
          
          <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Commander maintenant
          </button>
        </div>
        
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={service.image} 
            alt={service.name}
            className="w-full h-full object-cover aspect-[4/3]"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Ce qui est inclus
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {service.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg mt-1">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">{feature}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Notre processus
        </h2>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-200 -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid md:grid-cols-5 gap-8">
            {service.process.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-4 relative z-10">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Ce que disent nos clients
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {service.testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Questions fréquentes
        </h2>
        
        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {service.faq.map((item, index) => (
            <div key={index} className="py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Prêt à transformer votre marque ?
        </h2>
        <p className="text-lg mb-6 text-white/90">
          Commandez dès maintenant et recevez votre {service.name.toLowerCase()} en 7 jours
        </p>
        <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
          <ShoppingBag className="h-5 w-5 inline-block mr-2" />
          Commander pour {service.price}€
        </button>
        
        <div className="mt-4 text-sm text-white/80">
          <p>Besoin d'informations supplémentaires ?</p>
          <Link to="/contact" className="text-white underline hover:text-white/90">
            Contactez notre équipe
          </Link>
        </div>
      </div>

      {/* Related Services */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Services complémentaires
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.values(SERVICES)
            .filter(s => s.id !== service.id)
            .map((relatedService) => {
              const RelatedIcon = relatedService.icon;
              return (
                <Link
                  key={relatedService.id}
                  to={`/services/${relatedService.id}`}
                  className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="p-3 bg-indigo-100 rounded-xl h-fit">
                    <RelatedIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {relatedService.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {relatedService.description}
                    </p>
                    <div className="text-indigo-600 text-sm font-medium">
                      À partir de {relatedService.price}€
                    </div>
                  </div>
                  
                  <div className="self-center">
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}