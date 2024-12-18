import React from 'react';
import { Link } from 'react-router-dom';
import { Wand2, Image } from 'lucide-react';
import { FloatingStats, HeroVisuals } from './hero';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Stats */}
            <FloatingStats />

            {/* Hero content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transformez vos designs en présentations percutantes
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Créez des mockups professionnels en quelques secondes. Boostez vos ventes avec des visuels qui convertissent.
              </p>
              
              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/generator"
                  className="flex items-center justify-center px-8 py-4 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  Commencer gratuitement
                </Link>
                <Link
                  to="/mockups"
                  className="flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                >
                  <Image className="h-5 w-5 mr-2" />
                  Voir la librairie
                </Link>
              </div>
            </div>
          </div>

          {/* Hero visuals */}
          <div className="lg:block">
            <HeroVisuals />
          </div>
        </div>
      </div>
    </section>
  );
}