import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Book, Crown, Play, Star, ChevronRight, HelpCircle, TrendingUp, Target, DollarSign, ShoppingBag, BarChart2, Users, Zap, Home, Rocket, Layers, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Training } from '../types/training';

const CATEGORIES = [
  { id: 'all', name: 'Toutes les formations', icon: Book },
  { id: 'tool', name: 'Utilisation de l\'outil', icon: Layers },
  { id: 'business', name: 'Business & Marketing', icon: TrendingUp },
  { id: 'design', name: 'Créer ses designs', icon: Lightbulb }
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

const SUCCESS_STORIES = [
  {
    name: "Sophie M.",
    before: "800€",
    after: "15,600€",
    period: "par mois",
    duration: "en 3 mois",
    quote: "La combinaison de MockupPro et des formations a transformé mon business",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  },
  {
    name: "Marc D.",
    before: "1,200€",
    after: "8,900€",
    period: "par mois",
    duration: "en 2 mois",
    quote: "J'ai enfin compris comment vendre efficacement mes designs",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  },
  {
    name: "Julie L.",
    before: "500€",
    after: "12,300€",
    period: "par mois",
    duration: "en 4 mois",
    quote: "Les stratégies enseignées sont concrètes et faciles à appliquer",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80"
  }
];

const LEARNING_PATH = [
  {
    icon: Layers,
    title: "Maîtrisez Pixmock",
    description: "Apprenez à utiliser toutes les fonctionnalités de la plateforme"
  },
  {
    icon: Lightbulb,
    title: "Créez des designs qui se vendent",
    description: "Découvrez les tendances et techniques pour créer des designs attractifs"
  },
  {
    icon: TrendingUp,
    title: "Développez votre business",
    description: "Mettez en place une stratégie marketing efficace pour vendre vos créations"
  },
  {
    icon: Rocket,
    title: "Automatisez et scalez",
    description: "Optimisez votre workflow pour gagner en productivité et augmenter vos revenus"
  }
];

export default function Training() {
  const { user } = useStore();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Filter out categories with no trainings
  const availableCategories = CATEGORIES.filter(category => {
    if (category.id === 'all') return true;
    return trainings.some(training => training.category === category.id);
  });

  const filteredTrainings = trainings.filter(training => 
    selectedCategory === 'all' ? true : training.category === selectedCategory
  );

  if (loading) {
    return <LoadingSpinner message="Chargement des formations..." />;
  }

  return (
    <div className="space-y-8 sm:space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900">Formations</span>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full">
          <Crown className="h-5 w-5 mr-2" />
          <span className="font-medium">Formations exclusives</span>
        </div>
        
        {/* Learning Path */}
        <div className="relative mt-16 px-4">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent hidden md:block" />
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {LEARNING_PATH.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Training Categories */}
      {trainings.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Des formations pour chaque objectif
          </h2>
          
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {availableCategories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={clsx(
                    'px-3 sm:px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 flex-shrink-0',
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
                  <span className="text-sm sm:text-base">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Training Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredTrainings.map(training => (
              <Link
                key={training.id}
                to={`/training/${training.id}`}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
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
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {training.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
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
      )}
    </div>
  );
}