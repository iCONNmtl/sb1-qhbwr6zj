import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Showcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Des visuels qui convertissent
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Nos clients constatent une augmentation moyenne de 85% de leur taux de conversion grâce à des présentations produits professionnelles.
            </p>
            <div className="space-y-4">
              {[
                'Augmentation du taux de conversion',
                'Réduction du taux de retour',
                'Amélioration de la confiance client',
                'Gain de temps considérable'
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <ArrowRight className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl transform -rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="Conversion chart"
              className="relative rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}