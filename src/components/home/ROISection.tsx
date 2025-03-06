import React from 'react';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';

export default function ROISection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Maximisez vos revenus tout en réduisant vos dépenses
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Profitez d’un marché en pleine expansion avec une solution tout-en-un, ultra rapide et au meilleur prix.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl" />
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl" />
              <img
                src="https://d2v7vpg8oce97p.cloudfront.net/Branding/Rate.webp"
                alt="Conversion Rate"
                className="rounded-2xl object-cover w-full aspect-[4/3] relative z-10"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Un marché en pleine explosion
                    </h3>
                    <p className="text-gray-600">
                    Les affiches sont l’un des produits les plus en vogue du moment. Pourquoi ne pas lancer les vôtres dès aujourd’hui ?
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Une solution tout-en-un et ultra abordable
                    </h3>
                    <p className="text-gray-600">
                    Plus besoin de logiciels complexes et coûteux. Avec Pixmock, tout est réuni en un seul outil, au meilleur prix du marché.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Votre produit prêt en 1 minute
                    </h3>
                    <p className="text-gray-600">
                    Transformez votre design en une affiche finalisée et directement disponible sur votre boutique en un temps record.
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