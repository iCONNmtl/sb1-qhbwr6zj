import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Prêt à transformer vos présentations produits ?
        </h2>
        <p className="text-xl text-indigo-100 mb-8">
          Rejoignez des milliers d'e-commerçants qui augmentent leurs ventes grâce à des visuels professionnels
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Commencer gratuitement
        </Link>
      </div>
    </section>
  );
}