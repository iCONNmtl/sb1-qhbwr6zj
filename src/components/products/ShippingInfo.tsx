import React, { useState } from 'react';
import { Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { CONTINENTS } from '../../data/shipping';
import clsx from 'clsx';

interface ShippingInfoProps {
  productId: string;
}

export default function ShippingInfo({ productId }: ShippingInfoProps) {
  const [expandedContinent, setExpandedContinent] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Truck className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Livraison internationale
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(CONTINENTS).map(([code, continent]) => (
          <div key={code} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedContinent(expandedContinent === code ? null : code)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-wrap gap-1">
                  {continent.countries.slice(0, 3).map(country => (
                    <span key={country.name} className="text-xl" role="img" aria-label={country.name}>
                      {country.flag}
                    </span>
                  ))}
                  {continent.countries.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{continent.countries.length - 3}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{continent.name}</div>
                  <div className="text-sm text-gray-500">
                    À partir de {continent.shipping.basePrice.toFixed(2)}€
                  </div>
                </div>
              </div>
              {expandedContinent === code ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {expandedContinent === code && (
              <div className="px-6 py-4 bg-gray-50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Frais de port
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Premier article</span>
                        <span className="font-medium">{continent.shipping.basePrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Article supplémentaire</span>
                        <span className="font-medium">+{continent.shipping.additionalItemPrice.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Pays desservis
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {continent.countries.map(country => (
                        <div
                          key={country.name}
                          className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-sm"
                        >
                          <span role="img" aria-label={country.name}>{country.flag}</span>
                          <span className="text-gray-600">{country.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <strong>Note:</strong> Les délais de livraison peuvent varier selon le pays de destination. Un numéro de suivi sera fourni pour chaque commande.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}