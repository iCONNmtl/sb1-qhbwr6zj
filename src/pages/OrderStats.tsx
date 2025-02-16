import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Package, Loader2, BarChart2, Globe2, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Order } from '../types/order';

// Composant pour la répartition par tailles
function SizeDistribution({ orders }: { orders: Order[] }) {
  // Calculer les ventes par taille
  const sizeStats = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.size]) {
        acc[item.size] = {
          quantity: 0,
          revenue: 0
        };
      }
      acc[item.size].quantity += item.quantity;
      acc[item.size].revenue += item.price * item.quantity;
    });
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  // Calculer les totaux pour les pourcentages
  const totalQuantity = Object.values(sizeStats).reduce((sum, stat) => sum + stat.quantity, 0);
  const totalRevenue = Object.values(sizeStats).reduce((sum, stat) => sum + stat.revenue, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Ruler className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Répartition par tailles
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(sizeStats)
          .sort(([, a], [, b]) => b.revenue - a.revenue)
          .map(([size, stats]) => {
            const quantityPercentage = (stats.quantity / totalQuantity) * 100;
            const revenuePercentage = (stats.revenue / totalRevenue) * 100;
            
            return (
              <div key={size} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{size}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({stats.quantity} vendu{stats.quantity > 1 ? 's' : ''})
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.revenue.toFixed(2)}€
                  </span>
                </div>

                {/* Double barre de progression */}
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  {/* Barre de quantité */}
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-200 transition-all duration-300"
                    style={{ width: `${quantityPercentage}%` }}
                  />
                  {/* Barre de revenu */}
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-600 transition-all duration-300"
                    style={{ width: `${revenuePercentage}%` }}
                  />
                </div>

                {/* Légende */}
                <div className="flex justify-between text-xs">
                  <span className="text-indigo-600">
                    {quantityPercentage.toFixed(1)}% des ventes
                  </span>
                  <span className="text-indigo-900">
                    {revenuePercentage.toFixed(1)}% du CA
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Légende */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
            <span className="text-gray-600">% du CA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-200 rounded-full" />
            <span className="text-gray-600">% des ventes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour la répartition géographique
function GeographicDistribution({ orders }: { orders: Order[] }) {
  const countryStats = orders.reduce((acc, order) => {
    const country = order.shippingAddress.country;
    if (!acc[country]) {
      acc[country] = {
        orders: 0,
        revenue: 0
      };
    }
    acc[country].orders += 1;
    acc[country].revenue += order.totalAmount;
    return acc;
  }, {} as Record<string, { orders: number; revenue: number }>);

  const totalRevenue = Object.values(countryStats).reduce((sum, stat) => sum + stat.revenue, 0);
  const totalOrders = Object.values(countryStats).reduce((sum, stat) => sum + stat.orders, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Globe2 className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Répartition géographique
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(countryStats)
          .sort(([, a], [, b]) => b.revenue - a.revenue)
          .map(([country, stats]) => {
            const revenuePercentage = (stats.revenue / totalRevenue) * 100;
            const ordersPercentage = (stats.orders / totalOrders) * 100;
            
            return (
              <div key={country}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-medium text-gray-900">{country}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({stats.orders} commande{stats.orders > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {stats.revenue.toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-500">
                      {revenuePercentage.toFixed(1)}% du CA • {ordersPercentage.toFixed(1)}% des commandes
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${revenuePercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function OrderStats() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Fetch orders
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
          <p className="mt-4 text-gray-500">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  // Calculer les statistiques
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length 
      : 0,
    pendingOrders: orders.filter(order => order.status === 'pending').length
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Commandes totales</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Chiffre d'affaires</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalRevenue.toFixed(2)}€</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Panier moyen</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.averageOrderValue.toFixed(2)}€</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Commandes en attente</div>
          <div className="text-3xl font-bold text-white mt-2">{stats.pendingOrders}</div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 gap-6">
        <SizeDistribution orders={orders} />
        <GeographicDistribution orders={orders} />
      </div>
    </div>
  );
}