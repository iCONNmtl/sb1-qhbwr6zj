import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, CheckCircle, ChevronDown, ChevronUp, Loader2, Eye, DollarSign } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../../types/order';

interface OrderListProps {
  orders: Order[];
  onRefresh: () => Promise<void>;
}

export default function OrderList({ orders, onRefresh }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [designUrls, setDesignUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const productsSnap = await getDocs(productsRef);
        const designUrlMap: Record<string, string> = {};
        
        productsSnap.docs.forEach(doc => {
          const product = doc.data();
          product.variants.forEach((variant: any) => {
            if (variant.sku && variant.designUrl) {
              designUrlMap[variant.sku] = variant.designUrl;
            }
          });
        });

        setDesignUrls(designUrlMap);
      } catch (error) {
        console.error('Error fetching product design URLs:', error);
      }
    };

    fetchProducts();
  }, []);

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
          const purchasePrice = Number(order.purchasePrice) || 0;
          const totalAmount = Number(order.totalAmount) || 0;
          const profit = totalAmount - purchasePrice;

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
                          {totalAmount.toFixed(2)}€
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Coût: {purchasePrice.toFixed(2)}€
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
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const itemPrice = Number(item.price) || 0;
                      const itemQuantity = Number(item.quantity) || 0;
                      
                      return (
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
                                Prix unitaire: {itemPrice.toFixed(2)}€
                              </div>
                              <div className="text-sm text-gray-500">
                                Quantité: {itemQuantity}
                              </div>
                              <div className="text-sm font-medium text-green-600">
                                Total: {(itemPrice * itemQuantity).toFixed(2)}€
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
                              {designUrls[item.sku] && (
                                <div>
                                  <div className="text-sm font-medium text-gray-900 mb-2">
                                    Design
                                  </div>
                                  <a
                                    href={designUrls[item.sku]}
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
                      );
                    })}
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