import React from 'react';
import { Zap, DollarSign, Clock, Layers, Palette, Image, ShoppingBag, BarChart2, ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Définition des outils remplacés
const REPLACED_TOOLS = [
  {
    name: "Photoshop",
    icon: Palette,
    price: 29.99,
    color: "#31A8FF",
    features: ["Création de mockups", "Manipulation d'images", "Ajustements visuels"],
    complexity: "Élevée",
    learningTime: "6+ mois"
  },
  {
    name: "Canva Pro",
    icon: Image,
    price: 12.99,
    color: "#00C4CC",
    features: ["Création de designs", "Templates", "Exports d'images"],
    complexity: "Moyenne",
    learningTime: "1-2 mois"
  },
  {
    name: "Shopify",
    icon: ShoppingBag,
    price: 29.99,
    color: "#96BF47",
    features: ["Gestion de produits", "Vente en ligne", "Traitement des commandes"],
    complexity: "Moyenne",
    learningTime: "2-3 mois"
  },
  {
    name: "Hootsuite",
    icon: Layers,
    price: 19.99,
    color: "#FF7A59",
    features: ["Programmation de posts", "Gestion multi-plateformes", "Analytics"],
    complexity: "Moyenne",
    learningTime: "1 mois"
  },
  {
    name: "Google Analytics",
    icon: BarChart2,
    price: 0,
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
            Remplacez 5 outils coûteux par une seule plateforme
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
                    <div 
                      className="p-3 rounded-lg mb-3"
                      style={{ backgroundColor: `${tool.color}20` }}
                    >
                      <tool.icon style={{ color: tool.color }} className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center justify-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{tool.price}€/mois</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Flèche centrale */}
            <div className="flex justify-center items-center">
              <div className="bg-indigo-600 rounded-full p-3 shadow-lg hidden md:block">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div className="flex md:hidden items-center justify-center w-full">
                <div className="w-1 h-12 bg-indigo-600"></div>
                <div className="bg-indigo-600 rounded-full p-2 shadow-lg">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* MockupPro - côté droit simplifié */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold mb-2">Pixmock</h3>
                <div className="text-xl font-semibold mb-4">49€/mois</div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  Économisez {(totalCost - 49).toFixed(2)}€/mois
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
                  <th className="px-6 py-4 text-center text-sm font-medium text-indigo-600">MockupPro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Coût mensuel</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{totalCost.toFixed(2)}€</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">49€</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Temps d'apprentissage</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">12+ mois</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">1 semaine</td>
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