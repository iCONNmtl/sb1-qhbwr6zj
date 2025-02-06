import React from 'react';

const TESTIMONIALS = [
  {
    name: 'Alice Prigent',
    username: 'E-commerce Etsy',
    avatar: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Avatar3.webp',
    content: "Franchement, super pratique ! En deux clics, je fais mes mockups et je peux les adapter direct pour Pinterest. Un vrai gain de temps !"
  },
  {
    name: 'David Lopez',
    username: 'Community Manager',
    avatar: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Avatar5.webp',
    content: 'Je trouve toujours un mockup qui correspond à ce que je veux. C’est rapide, facile à utiliser et les résultats sont vraiment pros.'
  },
  {
    name: 'Emma Brown',
    username: 'Freelance',
    avatar: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Avatar4.webp',
    content: 'Le fait de pouvoir personnaliser avec du texte ou des images, c’est top. Et ça prend littéralement quelques secondes !'
  },
  {
    name: 'James Wilson',
    username: 'Designer Graphique',
    avatar: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Avatar1.webp',
    content: 'Générer plusieurs mockups d’un coup, ça change tout. Plus besoin de galérer, tout est prêt hyper vite.'
  },
  {
    name: 'Sophia Lee',
    username: 'Freelance',
    avatar: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Avatar6.webp',
    content: 'J’adore qu’il y ait des nouveautés régulièrement, on sent que l’outil s’adapte à ce qu’on attend. Hyper cool !'
  },
  {
    name: 'Michael Davis',
    username: 'E-commerce',
    avatar: 'https://d2v7vpg8oce97p.cloudfront.net/Branding/Avatar2.webp',
    content: 'La qualité est dingue, et tout est optimisé pour les réseaux. Je ne peux plus m’en passer pour mes fiches produits !'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Découvrez ce que les gens en disent
          </h2>
          <p className="text-gray-600">
          Des avis authentiques de nos utilisateurs sur leur expérience avec Pixmock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.username}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.username}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}