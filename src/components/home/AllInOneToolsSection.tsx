import React from 'react';
import { Zap, DollarSign, Clock, Layers, Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Définition des outils remplacés
const REPLACED_TOOLS = [
  {
    name: "Création",
    logo: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Tools1.webp",
    price: 22.99,
    color: "#31A8FF",
    features: ["Création de mockups", "Manipulation d'images", "Ajustements visuels"],
    complexity: "Élevée",
    learningTime: "6+ mois"
  },
  {
    name: "Upscale",
    logo: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Tools2.webp",
    price: 12.99,
    color: "#00C4CC",
    features: ["Création de designs", "Templates", "Exports d'images"],
    complexity: "Moyenne",
    learningTime: "1-2 mois"
  },
  {
    name: "IA",
    logo: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Tools3.webp",
    price: 20,
    color: "#96BF47",
    features: ["Gestion de produits", "Vente en ligne", "Traitement des commandes"],
    complexity: "Moyenne",
    learningTime: "2-3 mois"
  },
  {
    name: "Mockups",
    logo: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Tools4.webp",
    price: 14.95,
    color: "#FF7A59",
    features: ["Programmation de posts", "Gestion multi-plateformes", "Analytics"],
    complexity: "Moyenne",
    learningTime: "1 mois"
  },
  {
    name: "POD",
    logo: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Tools5.webp",
    price: 14.99,
    color: "#F9AB00",
    features: ["Suivi des performances", "Rapports détaillés", "Analyse des ventes"],
    complexity: "Élevée",
    learningTime: "3+ mois"
  },
  {
    name: "Productivité",
    logo: "https://d2v7vpg8oce97p.cloudfront.net/Branding/Tools6.webp",
    price: 19.90,
    color: "#F9AB00",
    features: ["Suivi des performances", "Rapports détaillés", "Analyse des ventes"],
    complexity: "Élevée",
    learningTime: "3+ mois"
  }
];

// Calcul du coût total des outils remplacés
const totalCost = REPLACED_TOOLS.reduce((sum, tool) => sum + tool.price, 0);

export default function AllInOneToolsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Remplacez 6 outils coûteux par une seule plateforme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simplifiez votre workflow et économisez du temps et de l'argent avec notre solution tout-en-un
          </p>
        </div>

        {/* Comparaison visuelle simplifiée */}
        <div className="relative mb-20">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Outils remplacés - côté gauche */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {REPLACED_TOOLS.map((tool) => (
                <div 
                  key={tool.name}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center mb-3">
                      <img 
                        src={tool.logo} 
                        alt={tool.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center justify-center">
                        <span>{tool.price}€/mois</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Flèche centrale - responsive */}
            <div className="flex justify-center items-center">
              <div className="w-full relative">
                {/* Flèche vers la droite sur desktop */}
                <svg 
                  className="w-3/4 h-auto mx-auto hidden md:block" 
                  viewBox="0 0 200 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M0 20H180M180 20L160 5M180 20L160 35" 
                    stroke="#1F2937" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Flèche vers le bas sur mobile */}
                <svg 
                  className="w-12 h-24 mx-auto md:hidden" 
                  viewBox="0 0 24 48" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 4L12 40M12 40L22 30M12 40L2 30" 
                    stroke="#1F2937" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* MockupPro - côté droit simplifié */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-2">Pixmock</h3>
                <div className="text-xl font-semibold mb-4">19,90€/mois</div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  Économisez {(totalCost - 19.90).toFixed(2)}€/mois
                </div>
                <div className="text-sm mb-6">
                  Tout ce dont vous avez besoin en une seule plateforme
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau comparatif */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">Comparaison détaillée</h3>
            <p className="text-gray-600 mt-1">Voyez pourquoi Pixmock est la solution la plus efficace</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">5 outils séparés</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-indigo-600">Pixmock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Coût mensuel</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{totalCost.toFixed(2)}€</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">19,90€</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Temps d'apprentissage</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">12+ mois</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">1 jour</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Intégration entre outils</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Workflow automatisé</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Support unifié</td>
                  <td className="px-6 py-4 text-center">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Temps de production</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">3-4 heures par produit</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">15 minutes par produit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}