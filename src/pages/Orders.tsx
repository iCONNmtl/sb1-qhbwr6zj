import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Truck, Clock, CheckCircle, ChevronDown, ChevronUp, Loader2, Mail, ArrowRight, Check } from 'lucide-react';
import OrderStats from './OrderStats';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../types/order';
import type { UserProfile } from '../types/user';

const STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée'
} as const;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-gray-100 text-gray-800'
} as const;

const STATUS_ICONS = {
  pending: Clock,
  paid: CheckCircle,
  shipped: Truck,
  delivered: Package
} as const;

const SETUP_STEPS = [
  {
    title: "Configuration rapide",
    icon: Mail,
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showSetupInstructions, setShowSetupInstructions] = useState(true);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Get initial setup status from Firestore
    const fetchSetupStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setIsSetupCompleted(!!userData.orderSetupCompleted);
          setShowSetupInstructions(!userData.orderSetupCompleted);
        }
      } catch (error) {
        console.error('Error fetching setup status:', error);
      }
    };

    fetchSetupStatus();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            firestoreId: doc.id,
            totalAmount: typeof data.totalAmount === 'string' ? parseFloat(data.totalAmount) : data.totalAmount,
            items: data.items.map((item: any) => ({
              ...item,
              price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
              quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
            }))
          };
        }) as Order[];

        // Sort by creation date (newest first)
        ordersData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSetupComplete = async () => {
    if (!user) return;

    try {
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        orderSetupCompleted: true
      });

      setIsSetupCompleted(true);
      setShowSetupInstructions(false);
      toast.success('Configuration terminée !');
    } catch (error) {
      console.error('Error updating setup status:', error);
      toast.error('Erreur lors de la sauvegarde du statut');
    }
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
      {/* Setup Instructions */}
      <div className={clsx(
        "bg-gradient-to-br from-white to-indigo-50/20 rounded-xl shadow-sm overflow-hidden border border-indigo-100",
        "transition-all duration-300 ease-in-out",
        showSetupInstructions ? "opacity-100" : "opacity-0 h-0"
      )}>
        <div className="p-6 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Import automatique des commandes
                </h2>
                <p className="text-gray-600 mt-1">
                  Configurez une fois, importez automatiquement toutes vos commandes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isSetupCompleted && (
                <button
                  onClick={handleSetupComplete}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="h-5 w-5 mr-2" />
                  C'est fait !
                </button>
              )}
              <button
                onClick={() => setShowSetupInstructions(false)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-white/50 rounded-lg transition-all"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {SETUP_STEPS.map((section, index) => {
              const Icon = section.icon;
              return (
                <div 
                  key={index} 
                  className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="absolute -top-4 left-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-sm">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
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
              );
            })}
          </div>
        </div>
      </div>

      {/* Show expand button when instructions are hidden */}
      {!showSetupInstructions && (
        <button
          onClick={() => setShowSetupInstructions(true)}
          className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <ChevronDown className="h-5 w-5" />
          Afficher les instructions d'import
        </button>
      )}

      {/* Order Stats */}
      <OrderStats orders={orders} />

      {/* Order List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune commande
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas encore de commande.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Package className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Commandes
                  </h2>
                  <p className="text-sm text-gray-500">
                    {orders.length} commande{orders.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => {
              const StatusIcon = STATUS_ICONS[order.status];
              const isExpanded = expandedOrder === order.firestoreId;

              return (
                <div key={order.firestoreId} className="group">
                  {/* Order Header */}
                  <div 
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.firestoreId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.platform}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerEmail}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.totalAmount.toFixed(2)}€
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusIcon className={clsx(
                            'h-4 w-4',
                            order.status === 'pending' ? 'text-yellow-500' :
                            order.status === 'paid' ? 'text-green-500' :
                            order.status === 'shipped' ? 'text-blue-500' :
                            'text-gray-500'
                          )} />
                          <span className={clsx(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            STATUS_COLORS[order.status]
                          )}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6">
                      {/* Items */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Articles</h4>
                        <div className="grid gap-4">
                          {order.items.map((item, index) => (
                            <div 
                              key={index}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md">
                                      {item.size}
                                    </span>
                                    {item.dimensions && (
                                      <span className="text-sm text-gray-500">
                                        {item.dimensions.cm} • {item.dimensions.inches}
                                      </span>
                                    )}
                                  </div>
                                  {item.sku && (
                                    <div className="text-xs text-gray-500 font-mono">
                                      SKU: {item.sku}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-medium text-gray-900">
                                    {(item.price * item.quantity).toFixed(2)}€
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.price.toFixed(2)}€ × {item.quantity}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Livraison</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-900">
                                Adresse de livraison
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>{order.customerName}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-900">
                                Contact
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>Email: {order.customerEmail}</p>
                                {order.shippingAddress.phone && (
                                  <p>Tél: {order.shippingAddress.phone}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}