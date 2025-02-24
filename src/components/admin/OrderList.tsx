import React, { useState } from 'react';
import { Package, Loader2, Clock, CheckCircle, XCircle, Truck, ChevronDown, ChevronUp, DollarSign, Eye, MapPin, Box, Edit } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../../types/order';

interface OrderListProps {
  orders: Order[];
  onRefresh: () => Promise<void>;
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'En attente', color: 'yellow' },
  { value: 'paid', label: 'Payée', color: 'green' },
  { value: 'shipped', label: 'Expédiée', color: 'blue' },
  { value: 'delivered', label: 'Livrée', color: 'gray' }
] as const;

export default function OrderList({ orders, onRefresh }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'shipped' && { shippedAt: new Date().toISOString() }),
        ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() })
      });
      
      await onRefresh();
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
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

                  {/* Status Selector */}
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.firestoreId, e.target.value)}
                      disabled={updatingStatus === order.firestoreId}
                      className={clsx(
                        'px-3 py-1 text-sm font-medium rounded-full border-2 transition-colors',
                        order.status === 'pending' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' :
                        order.status === 'paid' ? 'bg-green-100 border-green-200 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 border-blue-200 text-blue-800' :
                        'bg-gray-100 border-gray-200 text-gray-800'
                      )}
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
    </div>
  );
}