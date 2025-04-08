import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle, Truck, CreditCard, Loader2, DollarSign, MapPin, Box, ChevronUp, ChevronDown, Eye, FileText, BarChart2, Plus } from 'lucide-react';
import CreditPaymentDialog from '../components/orders/CreditPaymentDialog';
import CreateOrderDialog from '../components/orders/CreateOrderDialog';
import OrderStats from './OrderStats';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../types/order';
import type { UserProfile } from '../types/user';

const TABS = [
  { id: 'instructions', label: 'Instructions', icon: FileText },
  { id: 'stats', label: 'Statistiques', icon: BarChart2 },
  { id: 'orders', label: 'Commandes', icon: Package }
] as const;

type Tab = typeof TABS[number]['id'];

const SETUP_STEPS = [
  {
    title: "Configuration rapide",
    icon: FileText,
    description: "Importez automatiquement vos commandes en 3 étapes simples",
    steps: [
      {
        title: "Accédez à votre boîte email",
        description: "Connectez-vous à votre compte email principal"
      },
      {
        title: "Créez une règle de transfert",
        description: "Dans les paramètres, configurez le transfert automatique des emails de commande",
        highlight: "e0mhvbrtqwlcy3kk7q49p4gces25cy14@hook.eu1.make.com"
      },
      {
        title: "C'est tout !",
        description: "Vos commandes seront automatiquement importées dans votre tableau de bord"
      }
    ]
  },
  {
    title: "Plateformes compatibles",
    icon: Package,
    description: "Nous supportons les principales plateformes e-commerce",
    platforms: [
      { 
        name: "Etsy", 
        email: "transaction@etsy.com",
        color: "bg-orange-100 text-orange-800 border-orange-200"
      },
      { 
        name: "Shopify", 
        email: "orders@shopify.com",
        color: "bg-green-100 text-green-800 border-green-200"
      },
      { 
        name: "WooCommerce", 
        email: "orders@*.myshopify.com",
        color: "bg-purple-100 text-purple-800 border-purple-200"
      }
    ]
  },
  {
    title: "Traitement intelligent",
    icon: Truck,
    description: "Traitement automatisé de vos commandes",
    features: [
      {
        title: "Import en temps réel",
        description: "Les commandes sont importées dès réception de l'email"
      },
      {
        title: "Mise à jour automatique",
        description: "Le statut des commandes est mis à jour automatiquement"
      },
      {
        title: "Notifications",
        description: "Recevez une notification pour chaque nouvelle commande"
      }
    ]
  }
];

export default function Orders() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<{
    orderId: string;
    purchasePrice: number;
  } | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [savingAutoPaySetting, setSavingAutoPaySetting] = useState(false);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems: paginatedOrders
  } = usePagination(orders);

  useEffect(() => {
    if (!user) return;

    // Subscribe to user profile
    const unsubscribeUser = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);
          setAutoPayEnabled(userData.autoPayOrders || false);
        }
      }
    );

    // Subscribe to orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id,
        totalAmount: Number(doc.data().totalAmount || 0),
        purchasePrice: Number(doc.data().purchasePrice || 0),
        items: doc.data().items.map((item: any) => ({
          ...item,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 0),
          purchasePrice: Number(item.purchasePrice || 0)
        }))
      })) as Order[];

      ordersData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(ordersData);
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribeOrders();
    };
  }, [user]);

  const handleToggleAutoPay = async () => {
    if (!user) return;

    setSavingAutoPaySetting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        autoPayOrders: !autoPayEnabled
      });
      setAutoPayEnabled(!autoPayEnabled);
      toast.success('Paramètre mis à jour avec succès');
    } catch (error) {
      console.error('Error updating auto-pay setting:', error);
      toast.error('Erreur lors de la mise à jour du paramètre');
    } finally {
      setSavingAutoPaySetting(false);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentDialog(null);
  };

  const handleOrderCreated = () => {
    setShowCreateDialog(false);
    toast.success('Commande créée avec succès');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-500">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'instructions' && (
            <div className="space-y-8">
              {/* Vertical layout for instruction blocks */}
              <div className="space-y-8">
                {SETUP_STEPS.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div 
                      key={index} 
                      className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-sm flex-shrink-0">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {section.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {section.description}
                          </p>
                          
                          {'steps' in section && (
                            <div className="space-y-4">
                              {section.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                                    {stepIndex + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{step.title}</div>
                                    <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
                                    {step.highlight && (
                                      <div className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                                        <code className="text-sm text-indigo-600 font-mono break-all">
                                          {step.highlight}
                                        </code>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {'platforms' in section && (
                            <div className="space-y-3">
                              {section.platforms.map((platform, platformIndex) => (
                                <div 
                                  key={platformIndex} 
                                  className={clsx(
                                    "p-3 rounded-lg border",
                                    platform.color
                                  )}
                                >
                                  <div className="font-medium mb-1">{platform.name}</div>
                                  <div className="text-sm opacity-80 font-mono">
                                    {platform.email}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {'features' in section && (
                            <div className="space-y-4">
                              {section.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {feature.title}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                      {feature.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Demo Video Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Démonstration vidéo
                </h3>
                <p className="text-gray-600 mb-6">
                  Regardez cette vidéo pour voir comment fonctionne l'importation automatique des commandes
                </p>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="Démonstration d'importation de commandes"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <OrderStats orders={orders} />
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Auto-pay Setting */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Paiement automatique</h3>
                      <p className="text-sm text-gray-500">
                        Les nouvelles commandes seront payées automatiquement avec vos crédits
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleAutoPay}
                    disabled={savingAutoPaySetting}
                    className={clsx(
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      autoPayEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                    )}
                  >
                    <span
                      className={clsx(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        autoPayEnabled ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Create Order Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Commandes
                </h2>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Créer une commande
                </button>
              </div>

              {/* Orders List */}
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucune commande
                  </h2>
                  <p className="text-gray-600">
                    Vous n'avez pas encore de commande.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => {
                    const StatusIcon = order.status === 'pending' ? Clock :
                                     order.status === 'paid' ? CheckCircle :
                                     order.status === 'shipped' ? Truck : Package;
                    const profit = order.totalAmount - order.purchasePrice;

                    return (
                      <div key={order.firestoreId} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                            {/* Order Info */}
                            <div className="flex items-center gap-3">
                              <div className={clsx(
                                'p-2 rounded-lg',
                                order.status === 'pending' ? 'bg-yellow-100' :
                                order.status === 'paid' ? 'bg-green-100' :
                                order.status === 'shipped' ? 'bg-blue-100' :
                                'bg-gray-100'
                              )}>
                                <StatusIcon className={clsx(
                                  'h-5 w-5',
                                  order.status === 'pending' ? 'text-yellow-600' :
                                  order.status === 'paid' ? 'text-green-600' :
                                  order.status === 'shipped' ? 'text-blue-600' :
                                  'text-gray-600'
                                )} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {order.orderId}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.platform}
                                </div>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerEmail}
                              </div>
                            </div>

                            {/* Financial Info */}
                            <div className="flex items-center gap-6">
                              <div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-gray-400" />
                                  <div className="text-sm font-medium text-gray-900">
                                    {order.totalAmount.toFixed(2)}€
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-gray-500">
                                  Coût: {order.purchasePrice.toFixed(2)}€
                                </div>
                                <div className={clsx(
                                  "text-sm font-medium",
                                  profit >= 0 ? "text-green-600" : "text-red-600"
                                )}>
                                  {profit >= 0 ? "+" : ""}{profit.toFixed(2)}€
                                </div>
                              </div>
                            </div>

                            {/* Status */}
                            <div>
                              <span className={clsx(
                                'px-3 py-1 text-sm font-medium rounded-full',
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              )}>
                                {order.status === 'pending' ? 'En attente' :
                                 order.status === 'paid' ? 'Payée' :
                                 order.status === 'shipped' ? 'Expédiée' :
                                 'Livrée'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => setPaymentDialog({
                                  orderId: order.firestoreId,
                                  purchasePrice: order.purchasePrice
                                })}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                              >
                                <CreditCard className="h-5 w-5 mr-2" />
                                Payer
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order.firestoreId ? null : order.firestoreId)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                              {expandedOrder === order.firestoreId ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Order Details */}
                        {expandedOrder === order.firestoreId && (
                          <div className="mt-6 border-t border-gray-100 pt-6">
                            <div className="grid grid-cols-2 gap-6">
                              {/* Shipping Information */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  Informations de livraison
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                      {order.shippingAddress.street}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.shippingAddress.country}
                                    </p>
                                    {order.shippingAddress.phone && (
                                      <p className="text-sm text-gray-600">
                                        Tél: {order.shippingAddress.phone}
                                      </p>
                                    )}
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">Méthode:</span>
                                      <span className="font-medium text-gray-900">
                                        {order.shippingMethod.carrier} - {order.shippingMethod.method}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                      <span className="text-gray-600">Délai estimé:</span>
                                      <span className="font-medium text-gray-900">
                                        {order.shippingMethod.estimatedDays} jours
                                      </span>
                                    </div>
                                    {order.shippingMethod.trackingNumber && (
                                      <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-gray-600">Numéro de suivi:</span>
                                        <span className="font-medium text-gray-900">
                                          {order.shippingMethod.trackingNumber}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Order Timeline */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  Historique de la commande
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">Commande créée</p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    {order.paidAt && (
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <DollarSign className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">Paiement reçu</p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(order.paidAt).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {order.shippedAt && (
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <Truck className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">Commande expédiée</p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(order.shippedAt).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {order.deliveredAt && (
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <Package className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">Commande livrée</p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(order.deliveredAt).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Products */}
                            <div className="mt-6">
                              <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
                                <Box className="h-4 w-4 text-gray-500" />
                                Produits commandés
                              </h4>
                              <div className="space-y-4">
                                {order.items.map((item, index) => (
                                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      {/* Size Info */}
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {item.size}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {item.dimensions.cm}
                                        </div>
                                      </div>

                                      {/* Price Info */}
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          Prix unitaire: {item.price}€
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          Quantité: {item.quantity}
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                          Total: {(item.price * item.quantity).toFixed(2)}€
                                        </div>
                                      </div>

                                      {/* SKU */}
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          SKU
                                        </div>
                                        <div className="text-sm font-mono text-gray-500">
                                          {item.sku}
                                        </div>
                                      </div>

                                      {/* Design Link */}
                                      <div>
                                        {item.designUrl && (
                                          <div>
                                            <div className="text-sm font-medium text-gray-900 mb-2">
                                              Design
                                            </div>
                                            <a
                                              href={item.designUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                            >
                                              <Eye className="h-4 w-4 mr-2" />
                                              Voir le design
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {orders.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Dialog */}
      {paymentDialog && userProfile && (
        <CreditPaymentDialog
          orderId={paymentDialog.orderId}
          userId={user!.uid}
          purchasePrice={paymentDialog.purchasePrice}
          availableCredits={userProfile.subscription.credits}
          onClose={() => setPaymentDialog(null)}
          onSuccess={() => handlePaymentSuccess(paymentDialog.orderId)}
        />
      )}

      {/* Create Order Dialog */}
      {showCreateDialog && user && (
        <CreateOrderDialog
          userId={user.uid}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleOrderCreated}
        />
      )}
    </div>
  );
}