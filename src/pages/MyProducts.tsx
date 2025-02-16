import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import ImageLoader from '../components/ImageLoader';
import toast from 'react-hot-toast';
import clsx from 'clsx';

type ProductType = 'poster-mat' | 'poster-glossy' | 'poster-frame';

interface Product {
  id: string;
  firestoreId: string;
  type: ProductType;
  designUrl: string;
  variants: {
    sizeId: string;
  }[];
  createdAt: string;
}

const PRODUCT_TYPES = {
  'poster-mat': 'Poster Mat Premium',
  'poster-glossy': 'Poster Brillant Premium',
  'poster-frame': 'Poster Encadré'
} as const;

export default function MyProducts() {
  const { user } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.firestoreId} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageLoader
                      src={product.designUrl}
                      alt={PRODUCT_TYPES[product.type]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">
                      {PRODUCT_TYPES[product.type]}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {product.variants.length} taille{product.variants.length > 1 ? 's' : ''} • 
                      Créé le {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/product/edit/${product.firestoreId}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
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
                    >
                      {deletingId === product.firestoreId ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}