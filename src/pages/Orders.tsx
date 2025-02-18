import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Truck, Clock, CheckCircle, ChevronDown, ChevronUp, Loader2, Mail, ArrowRight, Check, CreditCard } from 'lucide-react';
import OrderStats from './OrderStats';
import CreditPaymentDialog from '../components/orders/CreditPaymentDialog';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../types/order';
import type { UserProfile } from '../types/user';

const STATUS_ICONS = {
  pending: Clock,
  paid: Check,
  shipped: Truck,
  delivered: CheckCircle
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-gray-100 text-gray-800'
};

const STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée'
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState<{
    orderId: string;
    purchasePrice: number;
  } | null>(null);
  const { user, userProfile } = useStore();

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        ...doc.data() as Order,
        firestoreId: doc.id
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatProfit = (profit: number) => {
    const formattedAmount = formatPrice(Math.abs(profit));
    return profit >= 0 ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <OrderStats orders={orders} />

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
          <div className="p-6">
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
              const profit = order.totalAmount - order.purchasePrice;

              return (
                <div key={order.firestoreId} className="group">
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
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-gray-900">
                              Total: {formatPrice(order.totalAmount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Coût: {formatPrice(order.purchasePrice)}
                            </div>
                            <div className={clsx(
                              "text-sm font-medium",
                              profit >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              Bénéfice: {formatProfit(profit)}
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
                            STATUS_COLORS[order.status]
                          )}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {order.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentDialog({
                                orderId: order.firestoreId,
                                purchasePrice: order.purchasePrice
                              });
                            }}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Payer la commande
                          </button>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Articles</h4>
                        <div className="grid gap-4">
                          {order.items.map((item, index) => {
                            const itemProfit = (item.price - item.purchasePrice) * item.quantity;
                            return (
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
                                    <div className="flex items-center gap-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        Total: {formatPrice(item.price * item.quantity)}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Coût: {formatPrice(item.purchasePrice * item.quantity)}
                                      </div>
                                      <div className={clsx(
                                        "text-sm font-medium",
                                        itemProfit >= 0 ? "text-green-600" : "text-red-600"
                                      )}>
                                        Bénéfice: {formatProfit(itemProfit)}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatPrice(item.price)} × {item.quantity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Informations de livraison</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              Adresse de livraison
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                              {order.shippingAddress.country}
                            </div>
                          </div>
                          {order.trackingNumber && (
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                Numéro de suivi
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.trackingNumber}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Actions</h4>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              window.location.href = `mailto:${order.customerEmail}`;
                            }}
                            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                          >
                            <Mail className="h-5 w-5 mr-2" />
                            Contacter le client
                          </button>
                          {order.status === 'paid' && (
                            <button
                              onClick={() => {
                                // Handle shipping action
                              }}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              <Truck className="h-5 w-5 mr-2" />
                              Marquer comme expédiée
                            </button>
                          )}
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

      {paymentDialog && userProfile && (
        <CreditPaymentDialog
          orderId={paymentDialog.orderId}
          userId={user!.uid}
          purchasePrice={paymentDialog.purchasePrice}
          availableCredits={userProfile.subscription.credits}
          onClose={() => setPaymentDialog(null)}
          onSuccess={() => {
            setPaymentDialog(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}