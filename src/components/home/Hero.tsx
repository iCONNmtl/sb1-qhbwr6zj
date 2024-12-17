import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import FloatingStats from './hero/FloatingStats';
import HeroVisuals from './hero/HeroVisuals';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left relative">
            <FloatingStats />
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 mt-8 animate-fade-in">
              Transformez vos produits en <span className="text-indigo-600">présentations percutantes</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 animate-fade-in-delay-1">
              Créez des mockups professionnels en quelques secondes. Boostez vos ventes avec des visuels qui convertissent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-delay-2">
              <Link
                to="/generator"
                className="px-8 py-4 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Commencer gratuitement
              </Link>
              <Link
                to="/mockups"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                Voir les mockups
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeroVisuals />
          </div>
        </div>
      </div>
    </section>
  );
}