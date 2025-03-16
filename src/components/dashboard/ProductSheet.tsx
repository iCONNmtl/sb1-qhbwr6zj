import React from 'react';
import { X, Package, DollarSign, FileDown, Loader2, Image } from 'lucide-react';
import ShopifyCSVGenerator from './ShopifyCSVGenerator';
import clsx from 'clsx';

interface ProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    type: string;
    designUrl: string;
    variants: Array<{
      sizeId: string;
      name: string;
      price: number;
      cost: number;
      sku: string;
      dimensions: {
        cm: string;
        inches: string;
      };
    }>;
  };
  selectedMockups: string[];
  mockupData: Array<{
    id: string;
    name: string;
    url: string;
    platform?: string;
  }>;
}

export default function ProductSheet({ isOpen, onClose, product, selectedMockups, mockupData }: ProductSheetProps) {
  if (!isOpen) return null;

  const selectedMockupData = mockupData.filter(mockup => selectedMockups.includes(mockup.id));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Fiche produit
                </h2>
                <p className="text-sm text-gray-500">
                  {product.type}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Product Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Image className="h-5 w-5 text-gray-500" />
                Design principal
              </h3>
              <div className="aspect-square w-40 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.designUrl}
                  alt={product.type}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Variantes</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coût</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.variants.map((variant, index) => (
                      <tr key={variant.sizeId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {variant.dimensions.inches}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {variant.dimensions.cm}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {variant.price.toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {variant.cost.toFixed(2)}€
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-green-600">
                            +{(variant.price - variant.cost).toFixed(2)}€
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Mockups */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Mockups sélectionnés</h3>
              <div className="grid grid-cols-4 gap-4">
                {selectedMockupData.map((mockup) => (
                  <div key={mockup.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                    <img
                      src={mockup.url}
                      alt={mockup.name}
                      className="w-full h-full object-cover"
                    />
                    {mockup.platform && (
                      <div className={clsx(
                        'absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium text-white',
                        mockup.platform === 'instagram' ? 'bg-pink-500' : 'bg-red-500'
                      )}>
                        {mockup.platform}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedMockups.length} mockup{selectedMockups.length > 1 ? 's' : ''} sélectionné{selectedMockups.length > 1 ? 's' : ''}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Fermer
              </button>
              <ShopifyCSVGenerator
                selectedMockups={selectedMockups}
                mockupData={mockupData}
                selectedProduct={product}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}