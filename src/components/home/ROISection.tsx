import React from 'react';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';

export default function ROISection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl" />
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl" />
              <img
                src="https://d2v7vpg8oce97p.cloudfront.net/Branding/Rate.webp"
                alt="Conversion Rate"
                className="rounded-2xl shadow-xl object-cover w-full aspect-[4/3] relative z-10"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 mb-6">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Boost des ventes</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Gagnez plus et dépensez moins
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Augmentez significativement votre taux de conversion tout en réduisant vos coûts.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Augmentez vos revenus
                    </h3>
                    <p className="text-gray-600">
                      Des visuels professionnels augmentent votre taux de conversion et votre panier moyen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Réduisez vos dépenses
                    </h3>
                    <p className="text-gray-600">
                      L'outils tout en un, qui vous fait économiser plusieurs centaines de dollars chaque mois.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Économisez votre temps
                    </h3>
                    <p className="text-gray-600">
                      Gagnez des heures chaques semaines, pour vous développer beaucoup plus rapidement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}