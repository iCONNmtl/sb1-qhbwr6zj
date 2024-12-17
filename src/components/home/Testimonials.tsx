import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Fondatrice de BeautyStore',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Depuis que j\'utilise MockupPro, mes ventes ont augmenté de 40%. Les clients apprécient vraiment la qualité des visuels.',
    stats: '+40% de ventes'
  },
  {
    name: 'Thomas Dubois',
    role: 'E-commerce Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Un gain de temps incroyable ! Je peux maintenant créer tous mes visuels produits en quelques minutes.',
    stats: '8h économisées/semaine'
  },
  {
    name: 'Marie Lambert',
    role: 'Directrice Marketing',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'La qualité des mockups est exceptionnelle. Nos fiches produits sont maintenant beaucoup plus professionnelles.',
    stats: '+65% de conversions'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez comment nos clients transforment leur e-commerce
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg inline-block font-medium">
                {testimonial.stats}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}