import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Truck, Clock, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import OrderStats from './OrderStats';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../types/order';

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

export default function Orders() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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