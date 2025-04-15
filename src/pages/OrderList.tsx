import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Loader2 } from 'lucide-react';
import { initializeOrders } from '../utils/initOrders';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../types/order';

export default function OrderList() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Initialize sample orders if needed
        await initializeOrders(user.uid);

        // Fetch orders - exclude service orders (platform === 'internal')
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef, 
          where('userId', '==', user.uid),
          where('platform', 'in', ['shopify', 'etsy'])
        );
        const snapshot = await getDocs(q);
        
        const ordersData = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        })) as Order[];

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

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Aucune commande
        </h2>
        <p className="text-gray-600">
          Vous n'avez pas encore de commande.
        </p>
      </div>
    );
  }

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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.firestoreId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderId}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.platform}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customerEmail}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.totalAmount.toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}