import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Book, Crown, Play, Star, ChevronRight, CheckCircle, Users, Clock, Award, ChevronDown, HelpCircle, TrendingUp, Target, DollarSign, ShoppingBag, BarChart2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Training } from '../types/training';

const CATEGORIES = [
  { id: 'all', name: 'Toutes les formations' },
  { id: 'tool', name: 'Utilisation de l\'outil' },
  { id: 'etsy', name: 'Vendre sur Etsy' },
  { id: 'shopify', name: 'Vendre sur Shopify' },
  { id: 'social', name: 'Marketing sur les réseaux sociaux' },
  { id: 'design', name: 'Créer ses designs' }
];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Augmentez vos ventes",
    description: "Apprenez les stratégies qui ont fait leurs preuves pour multiplier votre chiffre d'affaires"
  },
  {
    icon: Target,
    title: "Trouvez vos clients",
    description: "Découvrez comment attirer et fidéliser votre clientèle idéale"
  },
  {
    icon: DollarSign,
    title: "Optimisez vos marges",
    description: "Maîtrisez vos coûts et maximisez votre rentabilité"
  }
];

const BUSINESS_IMPACT = [
  {
    icon: ShoppingBag,
    title: "Ventes multipliées par 3",
    description: "En moyenne, nos étudiants triplent leurs ventes en 3 mois"
  },
  {
    icon: BarChart2,
    title: "ROI de 300%",
    description: "Pour chaque euro investi dans nos formations, nos étudiants en gagnent 4"
  },
  {
    icon: Users,
    title: "+10k clients/mois",
    description: "Nos étudiants touchent en moyenne 10 000 clients potentiels par mois"
  }
];

const COMPLEMENTARY_FEATURES = [
  {
    icon: Zap,
    title: "Synergie parfaite",
    description: "Nos formations sont conçues pour exploiter 100% du potentiel de MockupPro"
  },
  {
    icon: Crown,
    title: "Expertise complète",
    description: "De la création à la vente, maîtrisez toute la chaîne de valeur"
  },
  {
    icon: Target,
    title: "Résultats garantis",
    description: "Suivez notre méthode éprouvée pour réussir à coup sûr"
  }
];

const FAQ_ITEMS = [
  {
    question: "En quoi les formations complètent l'outil MockupPro ?",
    answer: "Nos formations vous apprennent non seulement à utiliser MockupPro de manière optimale, mais aussi à créer des designs qui se vendent, à identifier les tendances du marché, et à mettre en place des stratégies marketing efficaces. C'est la combinaison parfaite entre un outil puissant et le savoir-faire pour l'exploiter au maximum."
  },
  {
    question: "Combien de temps faut-il pour voir des résultats ?",
    answer: "Nos étudiants voient généralement leurs premières ventes dans les 2 semaines suivant la mise en pratique de nos formations. En suivant notre méthode pas à pas, vous pouvez espérer tripler vos ventes en 3 mois."
  },
  {
    question: "Les formations sont-elles adaptées aux débutants ?",
    answer: "Absolument ! Nos formations sont structurées pour accompagner aussi bien les débutants que les utilisateurs expérimentés. Nous commençons par les bases et progressons vers des stratégies avancées."
  },
  {
    question: "Que faire si je ne vois pas de résultats ?",
    answer: "Nous offrons une garantie de satisfaction. Si vous ne voyez pas d'amélioration après 30 jours de mise en pratique, nous vous remboursons intégralement et vous gardez l'accès aux formations."
  }
];

const SUCCESS_STORIES = [
  {
    name: "Sophie M.",
    before: "800€",
    after: "15,600€",
    period: "par mois",
    duration: "en 3 mois",
    quote: "La combinaison de MockupPro et des formations a transformé mon business"
  },
  {
    name: "Marc D.",
    before: "1,200€",
    after: "8,900€",
    period: "par mois",
    duration: "en 2 mois",
    quote: "J'ai enfin compris comment vendre efficacement mes designs"
  },
  {
    name: "Julie L.",
    before: "500€",
    after: "12,300€",
    period: "par mois",
    duration: "en 4 mois",
    quote: "Les stratégies enseignées sont concrètes et faciles à appliquer"
  }
];

export default function Training() {
  const { user } = useStore();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const trainingsRef = collection(db, 'trainings');
        const q = query(trainingsRef, where('status', '==', 'published'));
        const snapshot = await getDocs(q);
        
        const trainingsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Training[];

        setTrainings(trainingsData);
      } catch (error) {
        console.error('Error fetching trainings:', error);
        toast.error('Erreur lors du chargement des formations');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Chargement des formations..." />;
  }

  const filteredTrainings = trainings.filter(training => 
    selectedCategory === 'all' ? true : training.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full">
          <Crown className="h-5 w-5 mr-2" />
          <span className="font-medium">Formations exclusives</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Transformez vos mockups en{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            machine à vendre
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nos formations vous apprennent à exploiter tout le potentiel de MockupPro pour créer un business rentable. Découvrez les stratégies qui ont permis à nos étudiants de générer plus de 10k€/mois.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {[
            { value: "+300%", label: "Augmentation des ventes" },
            { value: "10k+", label: "Clients potentiels/mois" },
            { value: "3x", label: "ROI moyen" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Des formations pour chaque objectif
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={clsx(
                'px-4 py-2 rounded-xl whitespace-nowrap transition-colors',
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Training Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrainings.map(training => (
            <Link
              key={training.id}
              to={`/training/${training.id}`}
              className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={training.thumbnail}
                  alt={training.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
                {training.access === 'premium' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center">
                    <Crown className="h-4 w-4 text-white mr-1" />
                    <span className="text-sm font-medium text-white">Premium</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {training.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {training.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Book className="h-4 w-4 mr-1" />
                    {training.sections.length} section{training.sections.length > 1 ? 's' : ''}
                  </div>
                  {training.access === 'premium' ? (
                    <div className="flex items-center text-amber-600">
                      <Star className="h-4 w-4 mr-1" />
                      {training.credits} crédits
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-green-600">
                      Gratuit
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center text-indigo-600 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Commencer</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Business Impact Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-12 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            L'impact sur votre business
          </h2>
          <p className="text-xl text-white/90">
            Des résultats concrets et mesurables pour votre activité
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {BUSINESS_IMPACT.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {impact.title}
                </h3>
                <p className="text-white/80">
                  {impact.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complementary Features */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            La combinaison parfaite avec MockupPro
          </h2>
          <p className="text-xl text-gray-600">
            Nos formations sont conçues pour exploiter tout le potentiel de l'outil
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {COMPLEMENTARY_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-100 rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
            <span className="text-sm font-medium uppercase tracking-wider text-indigo-600">FAQ</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-gray-600">
            Tout ce que vous devez savoir sur nos formations
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <ChevronDown 
                    className={clsx(
                      "h-5 w-5 text-gray-500 transition-transform duration-200",
                      expandedFaq === index ? "rotate-180" : ""
                    )}
                  />
                </button>
                
                <div 
                  className={clsx(
                    "transition-all duration-200 ease-in-out bg-gray-50",
                    expandedFaq === index 
                      ? "max-h-[500px] opacity-100" 
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="p-6">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à transformer votre business ?
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Rejoignez les milliers d'entrepreneurs qui réussissent grâce à Pixmock et nos formations
        </p>
        <Link
          to={user ? '/generator' : '/signup'}
          className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          <Zap className="h-5 w-5 mr-2" />
          {user ? 'Accéder aux formations' : 'Commencer gratuitement'}
        </Link>
      </div>
    </div>
  );
}