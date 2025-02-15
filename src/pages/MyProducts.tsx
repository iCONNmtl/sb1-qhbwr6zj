import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import ImageLoader from '../components/ImageLoader';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Product {
  id: string;
  firestoreId: string;
  type: 'poster-mat' | 'poster-glossy' | 'poster-frame';
  designUrl: string;
  variants: {
    sizeId: string;
    cost: number;
    suggestedPrice: number;
    sku: string;
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.firestoreId}
              className="bg-white rounded-xl shadow-sm overflow-hidden group"
            >
              {/* Image */}
              <div className="aspect-[4/3] relative">
                <ImageLoader
                  src={product.designUrl}
                  alt={`Design ${product.id}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
                    <div className="text-white">
                      <div className="font-medium">
                        {PRODUCT_TYPES[product.type]}
                      </div>
                      <div className="text-sm opacity-90">
                        {product.variants.length} taille{product.variants.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/product/edit/${product.firestoreId}`}
                        className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.firestoreId)}
                        disabled={deletingId === product.firestoreId}
                        className={clsx(
                          'p-2 bg-white rounded-lg transition',
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
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="font-medium text-gray-900">
                    {PRODUCT_TYPES[product.type]}
                  </div>
                  <div className="text-sm text-gray-500">
                    Créé le {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.sku}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{variant.sizeId}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{variant.cost}€</span>
                        <span className="text-green-600">+{variant.suggestedPrice - variant.cost}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}