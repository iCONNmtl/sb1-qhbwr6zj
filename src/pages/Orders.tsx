import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Truck, Clock, CheckCircle, ChevronDown, ChevronUp, Loader2, Mail, ArrowRight, Check, CreditCard, BarChart2, FileText } from 'lucide-react';
import OrderStats from './OrderStats';
import CreditPaymentDialog from '../components/orders/CreditPaymentDialog';
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
  const [activeTab, setActiveTab] = useState<Tab>('instructions');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetupInstructions, setShowSetupInstructions] = useState(true);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<{
    orderId: string;
    purchasePrice: number;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribeUser = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);
          setIsSetupCompleted(!!userData.orderSetupCompleted);
          setShowSetupInstructions(!userData.orderSetupCompleted);
        }
      }
    );

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribeOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id,
          totalAmount: Number(doc.data().totalAmount),
          purchasePrice: Number(doc.data().purchasePrice || 0),
          items: doc.data().items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            quantity: Number(item.quantity),
            purchasePrice: Number(item.purchasePrice || 0)
          }))
        })) as Order[];

        ordersData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        toast.error('Erreur lors du chargement des commandes');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeOrders();
    };
  }, [user]);

  const handleSetupComplete = async () => {
    if (!user) return;

    try {
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

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentDialog(null);
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
      {/* Tabs */}
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

              {!isSetupCompleted && (
                <div className="flex justify-center">
                  <button
                    onClick={handleSetupComplete}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    J'ai terminé la configuration
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <OrderStats orders={orders} />
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
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
                  {orders.map((order) => {
                    const StatusIcon = order.status === 'pending' ? Clock :
                                     order.status === 'paid' ? CheckCircle :
                                     order.status === 'shipped' ? Truck : Package;
                    const isExpanded = false;
                    const profit = order.totalAmount - order.purchasePrice;

                    return (
                      <div key={order.firestoreId} className="py-6">
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
                              <div className="flex items-center gap-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.totalAmount.toFixed(2)}€
                                </div>
                                <div className="text-sm text-gray-500">
                                  ({order.purchasePrice.toFixed(2)}€)
                                </div>
                                <div className={clsx(
                                  "text-sm font-medium",
                                  profit >= 0 ? "text-green-600" : "text-red-600"
                                )}>
                                  {profit >= 0 ? "+" : ""}{profit.toFixed(2)}€
                                </div>
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

                          {order.status === 'pending' && (
                            <button
                              onClick={() => setPaymentDialog({
                                orderId: order.firestoreId,
                                purchasePrice: order.purchasePrice
                              })}
                              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                              <CreditCard className="h-5 w-5 mr-2" />
                              Payer la commande
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
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
    </div>
  );
}