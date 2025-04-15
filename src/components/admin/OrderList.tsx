import React, { useState } from 'react';
import { Eye, CreditCard, Clock, CheckCircle, XCircle, Truck, Package, ChevronDown, ChevronUp, DollarSign, MapPin, Box, FileText, Loader2, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ImageLoader from '../ImageLoader';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../Pagination';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../../types/order';
import CreateInvoiceDialog from './CreateInvoiceDialog';

interface OrderListProps {
  orders: Order[];
  onRefresh: () => Promise<void>;
}

export default function OrderList({ orders, onRefresh }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems: paginatedOrders
  } = usePagination(orders);

  // Count mockups by platform
  const totalItemsSold = orders.reduce((total, order) => {
    return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'paid' | 'shipped' | 'delivered') => {
    setProcessingOrderId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      const updates: Record<string, any> = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      // Add additional fields based on status
      if (newStatus === 'paid' && !orders.find(o => o.firestoreId === orderId)?.paidAt) {
        updates.isPaid = true;
        updates.paidAt = new Date().toISOString();
      } else if (newStatus === 'shipped') {
        updates.shippedAt = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updates.deliveredAt = new Date().toISOString();
      }
      
      await updateDoc(orderRef, updates);
      
      toast.success(`Statut mis à jour: ${newStatus}`);
      await onRefresh();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    // Show confirmation dialog
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
      return;
    }

    setDeletingOrderId(orderId);
    try {
      // Delete the order document
      await deleteDoc(doc(db, 'orders', orderId));
      toast.success('Commande supprimée avec succès');
      await onRefresh();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Erreur lors de la suppression de la commande');
    } finally {
      setDeletingOrderId(null);
    }
  };

  return (
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
                {orders.length} commande{orders.length > 1 ? 's' : ''} • {totalItemsSold} article{totalItemsSold > 1 ? 's' : ''} vendu{totalItemsSold > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {paginatedOrders.map((order) => {
          const totalVariants = order.items.length;
          const averagePrice = order.items.reduce((sum, v) => sum + v.price, 0) / totalVariants;
          const averageCost = order.items.reduce((sum, v) => sum + v.purchasePrice, 0) / totalVariants;
          const averageProfit = averagePrice - averageCost;

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
                      {order.status === 'pending' ? <Clock className="h-5 w-5 text-yellow-600" /> :
                       order.status === 'paid' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                       order.status === 'shipped' ? <Truck className="h-5 w-5 text-blue-600" /> : <Package className="h-5 w-5 text-gray-600" />}
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
                        order.totalAmount - order.purchasePrice >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {order.totalAmount - order.purchasePrice >= 0 ? "+" : ""}{(order.totalAmount - order.purchasePrice).toFixed(2)}€
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

                <div className="flex items-center gap-2">
                  {/* Status Update Buttons */}
                  <div className="flex items-center gap-2 mr-2">
                    {order.status !== 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.firestoreId, 'pending')}
                        disabled={processingOrderId === order.firestoreId}
                        className={clsx(
                          'p-2 rounded-lg transition-colors',
                          processingOrderId === order.firestoreId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-50'
                        )}
                        title="Marquer comme en attente"
                      >
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </button>
                    )}
                    
                    {order.status !== 'paid' && (
                      <button
                        onClick={() => handleUpdateStatus(order.firestoreId, 'paid')}
                        disabled={processingOrderId === order.firestoreId}
                        className={clsx(
                          'p-2 rounded-lg transition-colors',
                          processingOrderId === order.firestoreId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'
                        )}
                        title="Marquer comme payée"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </button>
                    )}
                    
                    {order.status !== 'shipped' && (
                      <button
                        onClick={() => handleUpdateStatus(order.firestoreId, 'shipped')}
                        disabled={processingOrderId === order.firestoreId}
                        className={clsx(
                          'p-2 rounded-lg transition-colors',
                          processingOrderId === order.firestoreId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                        )}
                        title="Marquer comme expédiée"
                      >
                        <Truck className="h-5 w-5 text-blue-600" />
                      </button>
                    )}
                    
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleUpdateStatus(order.firestoreId, 'delivered')}
                        disabled={processingOrderId === order.firestoreId}
                        className={clsx(
                          'p-2 rounded-lg transition-colors',
                          processingOrderId === order.firestoreId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        )}
                        title="Marquer comme livrée"
                      >
                        <Package className="h-5 w-5 text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(order.firestoreId)}
                    disabled={deletingOrderId === order.firestoreId}
                    className={clsx(
                      'p-2 rounded-lg transition-colors mr-2',
                      deletingOrderId === order.firestoreId ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'
                    )}
                    title="Supprimer la commande"
                  >
                    {deletingOrderId === order.firestoreId ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>

                  {/* Invoice Button */}
                  <button
                    onClick={() => setShowInvoiceDialog(order)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mr-2"
                    title="Créer une facture"
                  >
                    <FileText className="h-5 w-5" />
                  </button>

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

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Invoice Dialog */}
      {showInvoiceDialog && (
        <CreateInvoiceDialog
          order={showInvoiceDialog}
          onClose={() => setShowInvoiceDialog(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}