import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, ChevronRight, Eye } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination';
import clsx from 'clsx';

interface Product {
  id: string;
  type: string;
  title: string;
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
}

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedProductId?: string;
}

export default function ProductList({ products, onSelectProduct, selectedProductId }: ProductListProps) {
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = usePagination(products, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Produits disponibles
              </h2>
              <p className="text-sm text-gray-500">
                {products.length} produit{products.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {products.length === 0 && (
            <Link
              to="/products"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Package className="h-5 w-5 mr-2" />
              Créer un produit
            </Link>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Vous n'avez pas encore créé de produit
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {paginatedItems.map((product) => {
              const totalVariants = product.variants.length;
              const averagePrice = product.variants.reduce((sum, v) => sum + v.price, 0) / totalVariants;
              const averageCost = product.variants.reduce((sum, v) => sum + v.cost, 0) / totalVariants;
              const averageProfit = averagePrice - averageCost;

              return (
                <button
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className={clsx(
                    'w-full p-4 text-left hover:bg-gray-50 transition-colors',
                    selectedProductId === product.id && 'bg-indigo-50'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.designUrl}
                        alt={product.title || product.type}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {product.title || product.type}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {totalVariants} taille{totalVariants > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="text-right">
                      <div className="flex items-center justify-end text-sm font-medium text-gray-900">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {averagePrice.toFixed(2)}€
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        +{averageProfit.toFixed(2)}€
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}