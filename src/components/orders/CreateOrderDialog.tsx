import React, { useState, useEffect } from 'react';
import { X, Package, Loader2, Plus, Minus, DollarSign, MapPin, Calendar, Search, Filter, ArrowUpDown } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { OrderPlatform, ShippingAddress } from '../../types/order';

interface CreateOrderDialogProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PLATFORMS: { id: OrderPlatform; label: string }[] = [
  { id: 'shopify', label: 'Shopify' },
  { id: 'etsy', label: 'Etsy' }
];

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

interface OrderItem {
  productId: string;
  productTitle: string;
  variantId: string;
  size: string;
  quantity: number;
  price: number;
  purchasePrice: number;
  dimensions: {
    cm: string;
    inches: string;
  };
  designUrl?: string;
}

export default function CreateOrderDialog({ userId, onClose, onSuccess }: CreateOrderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: 'shopify' as OrderPlatform,
    orderId: `ORD-${Date.now().toString().slice(-6)}`,
    customerName: '',
    customerEmail: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'France',
      phone: ''
    } as ShippingAddress,
    items: [] as OrderItem[],
    notes: ''
  });

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setProducts([]);
          setLoadingProducts(false);
          return;
        }

        const productsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Product[];
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [userId]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchString = searchTerm.toLowerCase();
    const productTitle = (product.title ?? '').toLowerCase();
    const productType = (product.type ?? '').toLowerCase();
    
    return productTitle.includes(searchString) || productType.includes(searchString);
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.title || a.type).localeCompare(b.title || b.type);
    } else if (sortBy === 'price-low') {
      const aPrice = Math.min(...a.variants.map(v => v.price));
      const bPrice = Math.min(...b.variants.map(v => v.price));
      return aPrice - bPrice;
    } else {
      const aPrice = Math.max(...a.variants.map(v => v.price));
      const bPrice = Math.max(...b.variants.map(v => v.price));
      return bPrice - aPrice;
    }
  });

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const calculateTotals = () => {
    const totalItems = formData.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const purchasePrice = formData.items.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);
    
    return {
      totalItems,
      totalAmount,
      purchasePrice,
      profit: totalAmount - purchasePrice
    };
  };

  const handleAddToOrder = () => {
    if (!selectedProduct || !selectedVariantId) return;
    
    const variant = selectedProduct.variants.find(v => v.sizeId === selectedVariantId);
    if (!variant) return;
    
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: selectedProduct.id,
          productTitle: selectedProduct.title || selectedProduct.type,
          variantId: selectedVariantId,
          size: variant.sizeId,
          quantity: 1,
          price: variant.price,
          purchasePrice: variant.cost,
          dimensions: variant.dimensions,
          designUrl: selectedProduct.designUrl
        }
      ]
    }));
    
    // Reset selection
    setSelectedVariantId(null);
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemQuantityChange = (index: number, quantity: number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        quantity
      };
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.shippingAddress.street) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Veuillez ajouter au moins un article');
      return;
    }

    setLoading(true);
    
    try {
      const { totalAmount, purchasePrice } = calculateTotals();
      const orderId = nanoid();
      
      // Create order in Firestore
      await addDoc(collection(db, 'orders'), {
        id: orderId,
        userId,
        platform: formData.platform,
        orderId: formData.orderId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        items: formData.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          purchasePrice: item.purchasePrice,
          size: item.size,
          dimensions: item.dimensions,
          sku: `${item.productId}-${item.size}`,
          designUrl: item.designUrl
        })),
        totalAmount,
        purchasePrice,
        status: 'pending',
        isPaid: false,
        shippingMethod: {
          carrier: 'colissimo',
          method: 'Standard',
          cost: 0, // No shipping cost as requested
          estimatedDays: 3
        },
        notes: formData.notes || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Commande créée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Créer une commande
                </h3>
                <p className="text-sm text-gray-500">
                  Renseignez les informations de la commande
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plateforme
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as OrderPlatform })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {PLATFORMS.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ORD-123456"
                  required
                />
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Date de commande
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  La date de commande sera automatiquement définie à aujourd'hui: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Informations client
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email du client
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="client@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Adresse de livraison
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rue
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123 rue de la Paix"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Paris"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="75001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    État/Région
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Île-de-France"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="France"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={formData.shippingAddress.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                Sélection des produits
              </h4>
              
              {loadingProducts ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
                  <p className="text-gray-600">Chargement des produits...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Aucun produit disponible</p>
                  <p className="text-sm text-gray-500">
                    Créez d'abord des produits dans la section "Produits"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search and Sort */}
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Rechercher un produit..."
                      />
                    </div>
                    
                    {/* Sort */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSortOptions(!showSortOptions)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <ArrowUpDown className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {sortBy === 'name' ? 'Nom' : 
                           sortBy === 'price-low' ? 'Prix croissant' : 
                           'Prix décroissant'}
                        </span>
                      </button>
                      
                      {showSortOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setSortBy('name');
                                setShowSortOptions(false);
                              }}
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm',
                                sortBy === 'name' 
                                  ? 'bg-indigo-50 text-indigo-600' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              Nom
                            </button>
                            <button
                              onClick={() => {
                                setSortBy('price-low');
                                setShowSortOptions(false);
                              }}
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm',
                                sortBy === 'price-low' 
                                  ? 'bg-indigo-50 text-indigo-600' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              Prix croissant
                            </button>
                            <button
                              onClick={() => {
                                setSortBy('price-high');
                                setShowSortOptions(false);
                              }}
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm',
                                sortBy === 'price-high' 
                                  ? 'bg-indigo-50 text-indigo-600' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              Prix décroissant
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Product List */}
                  <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto p-1">
                    {sortedProducts.map(product => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelectedProductId(selectedProductId === product.id ? null : product.id)}
                        className={clsx(
                          "flex items-center p-3 rounded-lg text-left transition-colors border",
                          selectedProductId === product.id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                          {product.designUrl && (
                            <img 
                              src={product.designUrl} 
                              alt={product.title || product.type} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {product.title || product.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.variants.length} taille{product.variants.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Variant Selection */}
                  {selectedProduct && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">
                        Sélectionner une taille pour {selectedProduct.title || selectedProduct.type}
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {selectedProduct.variants.map(variant => (
                          <button
                            key={variant.sizeId}
                            type="button"
                            onClick={() => setSelectedVariantId(selectedVariantId === variant.sizeId ? null : variant.sizeId)}
                            className={clsx(
                              "p-3 rounded-lg text-left border transition-colors",
                              selectedVariantId === variant.sizeId
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                          >
                            <div className="font-medium text-gray-900">
                              {variant.dimensions.inches}
                            </div>
                            <div className="text-sm text-gray-500">
                              {variant.dimensions.cm}
                            </div>
                            <div className="mt-1 flex justify-between text-sm">
                              <span className="text-gray-500">Prix:</span>
                              <span className="font-medium text-gray-900">{variant.price}€</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddToOrder}
                          disabled={!selectedVariantId}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter à la commande
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Items */}
            {formData.items.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  Articles sélectionnés
                </h4>
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">
                          {item.productTitle}
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Taille</div>
                          <div className="font-medium text-gray-900">
                            {item.dimensions.inches} ({item.dimensions.cm})
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Quantité</div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleItemQuantityChange(index, Math.max(1, item.quantity - 1))}
                              className="p-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-y border-gray-300 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleItemQuantityChange(index, item.quantity + 1)}
                              className="p-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Prix</div>
                          <div className="font-medium text-gray-900">
                            {item.price}€ × {item.quantity} = {(item.price * item.quantity).toFixed(2)}€
                          </div>
                          <div className="text-sm text-green-600">
                            Bénéfice: {((item.price - item.purchasePrice) * item.quantity).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Informations supplémentaires sur la commande..."
              />
            </div>

            {/* Order Summary */}
            {formData.items.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Récapitulatif de la commande
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre d'articles:</span>
                    <span className="font-medium text-gray-900">{totals.totalItems}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">{totals.totalAmount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coût d'achat:</span>
                    <span className="font-medium text-gray-900">{totals.purchasePrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bénéfice estimé:</span>
                    <span className="font-medium text-green-600">+{totals.profit.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Créer la commande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}