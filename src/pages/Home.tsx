import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Image, 
  Clock, 
  Star, 
  Check, 
  Users, 
  Zap,
  MousePointerClick,
  ImagePlus,
  PaintBucket,
  Settings,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { PlanConfig } from '../types/user';

export default function Home() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansSnap = await getDocs(collection(db, 'plans'));
        const plansData = plansSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PlanConfig[];
        setPlans(plansData.sort((a, b) => a.price - b.price));
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const testimonials = [
    {
      name: "Marie Laurent",
      role: "Designer Freelance",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content: "Grâce à Pixmock, je peux maintenant présenter mes designs de manière professionnelle en quelques secondes. Un vrai gain de temps !"
    },
    {
      name: "Thomas Martin",
      role: "Directeur Artistique",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content: "La possibilité de générer plusieurs mockups en un clic nous fait gagner des heures de travail chaque semaine."
    },
    {
      name: "Sophie Dubois",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content: "La qualité des rendus est exceptionnelle. Mes clients sont toujours impressionnés par le professionnalisme des présentations."
    }
  ];

  const faqs = [
    {
      question: "Comment fonctionne Pixmock ?",
      answer: "C'est simple ! Uploadez votre design, sélectionnez un ou plusieurs mockups, et notre système génère automatiquement des rendus professionnels en quelques secondes."
    },
    {
      question: "Comment fonctionnent les crédits ?",
      answer: "Chaque génération de mockup consomme un crédit. Les crédits sont renouvelés chaque mois selon votre plan d'abonnement."
    },
    {
      question: "Quelle est la qualité des exports ?",
      answer: "Nous générons des images PNG en haute résolution (2048x2048px) parfaites pour vos présentations clients et supports marketing."
    },
    {
      question: "Puis-je générer plusieurs mockups à la fois ?",
      answer: "Absolument ! C'est l'un de nos points forts. Sélectionnez autant de mockups que vous le souhaitez et générez-les tous en un seul clic."
    }
  ];

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Créez des mockups professionnels en quelques secondes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transformez instantanément vos designs en présentations percutantes. Générez plusieurs mockups en un clic et impressionnez vos clients.
        </p>
        <div>
          <Link
            to="/generator"
            className="inline-flex items-center px-8 py-4 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
          >
            <Zap className="h-5 w-5 mr-2" />
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Clock className="h-8 w-8 text-indigo-600" />,
            title: "Gain de temps incroyable",
            description: "Générez des dizaines de mockups en quelques secondes au lieu de passer des heures sur Photoshop"
          },
          {
            icon: <MousePointerClick className="h-8 w-8 text-indigo-600" />,
            title: "Multi-génération en 1 clic",
            description: "Sélectionnez plusieurs mockups et générez-les tous simultanément pour une productivité maximale"
          },
          {
            icon: <ImagePlus className="h-8 w-8 text-indigo-600" />,
            title: "Qualité professionnelle",
            description: "Exports en haute résolution pour des présentations clients impeccables"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="card p-8 hover:translate-y-[-4px] transition-all duration-200"
          >
            <div className="p-3 bg-indigo-50 rounded-xl w-fit">
              {feature.icon}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Features Showcase */}
      <section className="card p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Pixmock ?
          </h2>
          <p className="text-xl text-gray-600">
            Des fonctionnalités pensées pour les professionnels
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="h-6 w-6 text-indigo-600" />,
              title: "Génération ultra rapide",
              description: "Obtenez vos mockups en quelques secondes"
            },
            {
              icon: <PaintBucket className="h-6 w-6 text-indigo-600" />,
              title: "Rendu réaliste",
              description: "Des mockups qui mettent en valeur vos designs"
            },
            {
              icon: <Settings className="h-6 w-6 text-indigo-600" />,
              title: "Processus automatisé",
              description: "Plus besoin de compétences Photoshop"
            },
            {
              icon: <Image className="h-6 w-6 text-indigo-600" />,
              title: "Export haute qualité",
              description: "Images PNG 2048x2048px"
            },
            {
              icon: <Clock className="h-6 w-6 text-indigo-600" />,
              title: "Gain de temps",
              description: "Des heures de travail économisées"
            },
            {
              icon: <Users className="h-6 w-6 text-indigo-600" />,
              title: "Collaboration facile",
              description: "Partagez vos mockups avec votre équipe"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 rounded-2xl p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir sur Pixmock
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-start space-x-4">
                <HelpCircle className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="card p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Des tarifs adaptés à vos besoins
          </h2>
          <p className="text-xl text-gray-600">
            Commencez gratuitement, évoluez selon vos besoins
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-50 rounded-xl p-8 transition-all duration-200 ${
                plan.name === 'Pro'
                  ? 'ring-2 ring-indigo-600 shadow-lg scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-end justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-600 mb-1">/mois</span>
                </div>
                <p className="mt-2 text-sm text-indigo-600 font-medium">
                  {plan.credits} crédits/mois
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block w-full py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                  plan.name === 'Pro'
                    ? 'gradient-bg text-white hover:opacity-90'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                Commencer
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 rounded-2xl p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ce qu'en pensent nos utilisateurs
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les retours d'expérience de nos clients
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="card p-6 relative hover:translate-y-[-4px] transition-all duration-200"
            >
              <div className="absolute -top-6 left-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-4 border-white"
                />
              </div>
              <div className="pt-6">
                <Star className="h-6 w-6 text-yellow-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Prêt à révolutionner vos présentations ?
        </h2>
        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de designers qui gagnent du temps grâce à Pixmock
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200"
        >
          <Zap className="h-5 w-5 mr-2" />
          Commencer gratuitement
        </Link>
      </section>
    </div>
  );
}