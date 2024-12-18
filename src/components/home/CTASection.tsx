import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="gradient-bg rounded-2xl p-12 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        Prêt à révolutionner vos présentations ?
      </h2>
      <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
        Rejoignez des milliers de designers qui gagnent du temps grâce à MockupPro
      </p>
      <Link
        to="/signup"
        className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200"
      >
        <Zap className="h-5 w-5 mr-2" />
        Commencer gratuitement
      </Link>
    </section>
  );
}