import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Instagram, BookmarkIcon, Eye, Download, FileText, Loader2, Package, DollarSign } from 'lucide-react';
import { useGenerations } from '../hooks/useGenerations';
import { downloadImage } from '../utils/download';
import toast from 'react-hot-toast';
import clsx from 'clsx';

// Components
import MockupPreviewModal from '../components/mockup/MockupPreviewModal';
import ProductSheet from '../components/dashboard/ProductSheet';
import ProductList from '../components/dashboard/ProductList';
import type { UserProfile } from '../types/user';

interface Product {
  id: string;
  userId: string;
  type: string;
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

export default function Dashboard() {
  const { user } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [previewMockup, setPreviewMockup] = useState<{id: string; name: string; url: string} | null>(null);
  const [selectedMockups, setSelectedMockups] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'instagram' | 'pinterest'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductSheet, setShowProductSheet] = useState(false);
  const { generations, loading } = useGenerations();

  // Get all mockups from all generations
  const allMockups = generations.flatMap(generation => generation.mockups);

  // Calculate counts for each category
  const categoryCounts = {
    all: allMockups.length,
    instagram: allMockups.filter(m => m.platform === 'instagram').length,
    pinterest: allMockups.filter(m => m.platform === 'pinterest').length
  };

  // Filter mockups based on selected category
  const filteredMockups = allMockups.filter(mockup => 
    selectedCategory === 'all' ? true : mockup.platform === selectedCategory
  );

  // Pagination
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filteredMockups.length / ITEMS_PER_PAGE);
  const indexOfLastMockup = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMockup = indexOfLastMockup - ITEMS_PER_PAGE;
  const currentMockups = filteredMockups.slice(indexOfFirstMockup, indexOfLastMockup);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        toast.error('Erreur lors du chargement du profil');
      }
    );

    // Fetch user's products
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    return () => unsubscribe();
  }, [user]);

  const handleDownload = async (mockup: { name: string; url: string }) => {
    try {
      await downloadImage(mockup.url, mockup.name);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="space-y-8">
      {/* Mockup Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            1. Sélectionnez vos mockups
          </h2>
          <div className="text-sm text-gray-600">
            {allMockups.length} mockup{allMockups.length > 1 ? 's' : ''} généré{allMockups.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', name: 'Tous', icon: ImageIcon },
            { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
            { id: 'pinterest', name: 'Pinterest', icon: BookmarkIcon, color: 'bg-red-500' }
          ].map((category) => {
            const Icon = category.icon;
            const count = categoryCounts[category.id as keyof typeof categoryCounts];

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'all' | 'instagram' | 'pinterest')}
                className={clsx(
                  'flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200',
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
                <span className={clsx(
                  'inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium rounded-full',
                  selectedCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : filteredMockups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucune génération pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentMockups.map((mockup, index) => (
              <div
                key={`${mockup.id}-${index}`}
                onClick={() => setSelectedMockups(prev => 
                  prev.includes(mockup.id)
                    ? prev.filter(id => id !== mockup.id)
                    : [...prev, mockup.id]
                )}
                className={clsx(
                  "group relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg",
                  selectedMockups.includes(mockup.id) && "ring-4 ring-indigo-600 scale-95 hover:scale-100"
                )}
              >
                {mockup.platform && (
                  <div className={clsx(
                    'absolute top-2 right-2 z-10 px-2 py-1 rounded-lg text-xs font-medium text-white',
                    mockup.platform === 'instagram' ? 'bg-pink-500' : 'bg-red-500'
                  )}>
                    {mockup.platform === 'instagram' ? 'Instagram' : 'Pinterest'}
                  </div>
                )}

                <img
                  src={mockup.url}
                  alt={mockup.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {selectedMockups.includes(mockup.id) && (
                  <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm" />
                )}

                <div className={clsx(
                  "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100",
                  "flex items-center justify-center gap-4 transition-all duration-300"
                )}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewMockup(mockup);
                    }}
                    className="p-2 bg-white text-gray-600 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(mockup);
                    }}
                    className="p-2 bg-white text-gray-600 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={clsx(
                  'w-10 h-10 rounded-lg transition-all duration-200',
                  currentPage === page
                    ? 'gradient-bg text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Selection */}
      {selectedMockups.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            2. Sélectionnez un produit
          </h2>

          <ProductList
            products={products}
            onSelectProduct={setSelectedProduct}
            selectedProductId={selectedProduct?.id}
          />
        </div>
      )}

      {/* Export Actions */}
      {selectedMockups.length > 0 && selectedProduct && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Exporter
              </h2>
              <p className="text-gray-600">
                Générez la fiche produit pour Shopify ou Etsy
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProductSheet(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FileText className="h-5 w-5 mr-2" />
                Générer la fiche produit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {previewMockup && (
        <MockupPreviewModal
          mockup={previewMockup}
          onClose={() => setPreviewMockup(null)}
          onDownload={() => handleDownload(previewMockup)}
        />
      )}

      {selectedProduct && (
        <ProductSheet
          isOpen={showProductSheet}
          onClose={() => setShowProductSheet(false)}
          product={selectedProduct}
          selectedMockups={selectedMockups}
          mockupData={allMockups}
        />
      )}
    </div>
  );
}