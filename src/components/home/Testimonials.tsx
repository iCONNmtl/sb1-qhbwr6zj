import React from 'react';
import { TrendingUp, Clock, BarChart2 } from 'lucide-react';
import RatingStars from '../common/RatingStars';

const TESTIMONIALS = [
  {
    name: "Marie Laurent",
    role: "Designer Freelance",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 5,
    date: "Il y a 2 jours",
    content: "Pixmock a révolutionné ma façon de présenter mes designs aux clients. Le temps de préparation est passé de 2 heures à 15 minutes.",
    stats: {
      icon: Clock,
      label: "Temps économisé",
      value: "88%",
      detail: "2h → 15min par présentation"
    }
  },
  {
    name: "Thomas Martin",
    role: "Directeur Artistique",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 5,
    date: "Il y a 1 semaine",
    content: "Notre taux de conversion a augmenté de manière significative grâce à des présentations plus professionnelles et impactantes.",
    stats: {
      icon: TrendingUp,
      label: "Taux de conversion",
      value: "+37%",
      detail: "Sur les propositions commerciales"
    }
  },
  {
    name: "Sophie Dubois",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    rating: 5,
    date: "Il y a 2 semaines",
    content: "La qualité des rendus est exceptionnelle. Le nombre de clients a augmenté grâce à une meilleure projection des résultats finaux",
    stats: {
      icon: BarChart2,
      label: "Clients annuels",
      value: "+28%",
      detail: "Grâce à de meilleures présentations"
    }
  }
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 rounded-2xl p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ce qu'en pensent nos utilisateurs
        </h2>
        <p className="text-xl text-gray-600">
        Grâce à notre outil, ils boostent leur taux de conversion, gagnent du temps précieux et améliorent leur productivité.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial) => {
          const StatIcon = testimonial.stats.icon;
          
          return (
            <div
              key={testimonial.name}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
            >
              <div className="relative">
                <div className="absolute -top-10 left-0 right-0 flex justify-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-sm"
                  />
                </div>
                
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <RatingStars rating={testimonial.rating} />
                  </div>

                  <p className="text-gray-600 mb-6">
                    "{testimonial.content}"
                  </p>

                  {/* Stats Card */}
                  <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <StatIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {testimonial.stats.value}
                        </div>
                        <div className="text-sm text-indigo-600/70">
                          {testimonial.stats.label}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-indigo-600/70">
                      {testimonial.stats.detail}
                    </p>
                  </div>

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
            </div>
          );
        })}
      </div>
    </section>
  );
}