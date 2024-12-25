import React from 'react';
import { FileDown, Layers, CheckCircle } from 'lucide-react';

export default function CustomMockupInstructions() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Comment créer votre mockup ?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Suivez ces instructions pour créer votre propre mockup personnalisé
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Grid layout for instruction blocks */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* PSD Structure */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileDown className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Structure du PSD</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Taille recommandée : 3000x2000px
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Résolution : 300 DPI
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Mode couleur : RGB
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Smart Object nommé "Design"
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                  Calques organisés en groupes
                </li>
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Étapes à suivre</h3>
            </div>
            <div className="space-y-3">
              {[
                'Cliquez sur "Uploader mon PSD"',
                'Un dossier Google Drive sera créé pour vous',
                'Déposez votre PSD dans le dossier partagé',
                'Cliquez sur "Créer mon mockup"'
              ].map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes - Full width below */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Important</h3>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <ul className="text-sm text-indigo-900 space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                Le mockup sera uniquement visible par vous
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                Il apparaîtra dans la catégorie "Mes mockups"
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-indigo-600 mr-2" />
                Vérifiez que votre PSD respecte la structure demandée
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}