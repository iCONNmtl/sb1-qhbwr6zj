import React from 'react';
import { TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

export default function ROISection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-2xl" />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl" />
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2426&q=80"
                alt="Business Growth"
                className="rounded-2xl shadow-xl object-cover w-full aspect-[4/3] relative z-10"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 mb-6">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Augmentation des ventes</span>
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
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
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
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-600" />
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
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl">
                    <BarChart2 className="h-6 w-6 text-indigo-600" />
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