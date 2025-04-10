import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Edit, Trash2, Plus, Loader2, ChevronDown, ChevronUp, DollarSign, Eye, Globe2, Calendar, BarChart2, Layers, Store } from 'lucide-react';
import ImageLoader from '../components/ImageLoader';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import ProductPlatformExport from '../components/products/ProductPlatformExport';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Product {
  id: string;
  firestoreId: string;
  type: string;
  title: string;
  name: string;
  designUrl: string;
  variants: {
    sizeId: string;
    name: string;
    price: number;
    cost: number;
    sku: string;
    dimensions: {
      cm: string;
      inches: string;
    };
  }[];
  createdAt: string;
}

export default function MyProducts() {
  const { user } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState<Product | null>(null);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems: paginatedProducts
  } = usePagination(products);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        const productsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        })) as Product[];

        // Sort by creation date (newest first)
        productsData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    setDeletingId(productId);
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(p => p.firestoreId !== productId));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-500">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mes produits
          </h1>
          <p className="text-gray-600 mt-1">
            {products.length} produit{products.length > 1 ? 's' : ''} créé{products.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/products"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Créer un produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun produit
          </h2>
          <p className="text-gray-600 mb-8">
            Vous n'avez pas encore créé de produit. Commencez par en créer un !
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer mon premier produit
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {paginatedProducts.map((product) => {
            // Calculate stats
            const totalVariants = product.variants.length;
            const minPrice = Math.min(...product.variants.map(v => v.price));
            const maxPrice = Math.max(...product.variants.map(v => v.price));
            const totalProfit = product.variants.reduce((sum, v) => sum + (v.price - v.cost), 0);
            const avgProfit = totalProfit / totalVariants;
            const avgProfitPercentage = (avgProfit / (product.variants.reduce((sum, v) => sum + v.price, 0) / totalVariants)) * 100;

            return (
              <div 
                key={product.firestoreId} 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <ImageLoader
                        src={product.designUrl}
                        alt={product.title || product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {product.title || product.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{product.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{totalVariants} taille{totalVariants > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">+{avgProfit.toFixed(2)}€ ({Math.round(avgProfitPercentage)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Créé le {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowExportDialog(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Exporter"
                      >
                        <Store className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/product/edit/${product.firestoreId}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.firestoreId)}
                        disabled={deletingId === product.firestoreId}
                        className={clsx(
                          'p-2 rounded-lg transition',
                          deletingId === product.firestoreId
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-red-600 hover:bg-red-50'
                        )}
                        title="Supprimer"
                      >
                        {deletingId === product.firestoreId ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => setExpandedProduct(expandedProduct === product.firestoreId ? null : product.firestoreId)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Voir les détails"
                      >
                        {expandedProduct === product.firestoreId ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedProduct === product.firestoreId && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-4">Variantes</h4>
                      <div className="overflow-x-auto -mx-6">
                        <div className="inline-block min-w-full align-middle px-6">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Format
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Dimensions
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  SKU
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Prix
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Coût
                                </th>
                                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Bénéfice
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {product.variants.map((variant, idx) => (
                                <tr key={variant.sizeId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {variant.dimensions.inches}
                                  </td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {variant.dimensions.cm}
                                  </td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    {variant.sku}
                                  </td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {variant.price}€
                                  </td>
                                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {variant.cost}€
                                  </td>
                                  <td className="px-3 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-green-600">
                                        +{(variant.price - variant.cost).toFixed(2)}€
                                      </span>
                                      <span className="ml-2 text-xs text-gray-500">
                                        ({Math.round(((variant.price - variant.cost) / variant.price) * 100)}%)
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setShowExportDialog(product)}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          <Store className="h-5 w-5 mr-2" />
                          Exporter vers les plateformes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <ProductPlatformExport
          isOpen={true}
          onClose={() => setShowExportDialog(null)}
          product={showExportDialog}
        />
      )}
    </div>
  );
}