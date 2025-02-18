import React from 'react';
import { Package, CreditCard, TrendingUp, Wallet, Globe2, Ruler } from 'lucide-react';
import type { Order } from '../types/order';

interface DistributionItem {
  id: string;
  name: string;
  salesCount: number;
  revenue: number;
  salesPercentage: number;
  revenuePercentage: number;
}

interface DistributionProps {
  title: string;
  icon: React.ElementType;
  items: DistributionItem[];
}

function DistributionChart({ title, icon: Icon, items }: DistributionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({item.salesCount} commande{item.salesCount > 1 ? 's' : ''})
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {Number(item.revenue).toFixed(2)}€
              </span>
            </div>

            {/* Progress bars container */}
            <div className="space-y-4">
              {/* Revenue Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-indigo-600">Chiffre d'affaires</span>
                  <span className="font-medium text-indigo-900">{Number(item.revenuePercentage).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${item.revenuePercentage}%` }}
                  />
                </div>
              </div>

              {/* Sales Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Volume des ventes</span>
                  <span className="font-medium text-gray-900">{Number(item.salesPercentage).toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full transition-all duration-300"
                    style={{ width: `${item.salesPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
            <span className="text-gray-600">Chiffre d'affaires</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-gray-600">Volume des ventes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderStatsProps {
  orders: Order[];
}

export default function OrderStats({ orders }: OrderStatsProps) {
  // Calculate global stats
  const stats = orders.reduce((acc, order) => {
    acc.totalRevenue += Number(order.totalAmount);
    acc.totalExpenses += Number(order.purchasePrice);
    acc.totalOrders++;
    if (order.status === 'pending') acc.pendingOrders++;
    return acc;
  }, {
    totalOrders: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    pendingOrders: 0
  });

  const totalProfit = stats.totalRevenue - stats.totalExpenses;

  // Calculate geographic distribution
  const geoDistribution = orders.reduce((acc, order) => {
    const country = order.shippingAddress.country;
    if (!acc[country]) {
      acc[country] = { salesCount: 0, revenue: 0 };
    }
    acc[country].salesCount += 1;
    acc[country].revenue += Number(order.totalAmount);
    return acc;
  }, {} as Record<string, { salesCount: number; revenue: number }>);

  // Calculate size distribution
  const sizeDistribution = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.size]) {
        acc[item.size] = { salesCount: 0, revenue: 0 };
      }
      acc[item.size].salesCount += Number(item.quantity);
      acc[item.size].revenue += Number(item.price) * Number(item.quantity);
    });
    return acc;
  }, {} as Record<string, { salesCount: number; revenue: number }>);

  const totalSales = orders.length;
  const totalRevenue = stats.totalRevenue;

  // Prepare items for geographic distribution
  const geoItems: DistributionItem[] = Object.entries(geoDistribution)
    .map(([country, stats]) => ({
      id: country,
      name: country,
      salesCount: Number(stats.salesCount),
      revenue: Number(stats.revenue),
      salesPercentage: (Number(stats.salesCount) / totalSales) * 100,
      revenuePercentage: (Number(stats.revenue) / totalRevenue) * 100
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Prepare items for size distribution
  const totalSizeQuantity = Object.values(sizeDistribution)
    .reduce((sum, { salesCount }) => sum + Number(salesCount), 0);
  
  const sizeItems: DistributionItem[] = Object.entries(sizeDistribution)
    .map(([size, stats]) => ({
      id: size,
      name: size,
      salesCount: Number(stats.salesCount),
      revenue: Number(stats.revenue),
      salesPercentage: (Number(stats.salesCount) / totalSizeQuantity) * 100,
      revenuePercentage: (Number(stats.revenue) / totalRevenue) * 100
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Chiffre d'affaires */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Chiffre d'affaires</div>
          <div className="text-3xl font-bold text-white mt-2">
            {stats.totalRevenue.toFixed(2)}€
          </div>
          <div className="flex items-center mt-2">
            <CreditCard className="h-4 w-4 text-white/60 mr-1" />
            <span className="text-sm text-white/60">
              {stats.totalOrders} commande{stats.totalOrders > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Dépenses */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Dépenses</div>
          <div className="text-3xl font-bold text-white mt-2">
            {stats.totalExpenses.toFixed(2)}€
          </div>
          <div className="flex items-center mt-2">
            <Wallet className="h-4 w-4 text-white/60 mr-1" />
            <span className="text-sm text-white/60">
              Coût d'achat total
            </span>
          </div>
        </div>

        {/* Bénéfices */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Bénéfices</div>
          <div className="text-3xl font-bold text-white mt-2">
            {totalProfit.toFixed(2)}€
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-white/60 mr-1" />
            <span className="text-sm text-white/60">
              Marge {stats.totalRevenue > 0 ? Math.round((totalProfit / stats.totalRevenue) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Commandes en attente */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6">
          <div className="text-white/80">Commandes en attente</div>
          <div className="text-3xl font-bold text-white mt-2">
            {stats.pendingOrders}
          </div>
          <div className="flex items-center mt-2">
            <Package className="h-4 w-4 text-white/60 mr-1" />
            <span className="text-sm text-white/60">
              À traiter
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <DistributionChart
          title="Répartition géographique"
          icon={Globe2}
          items={geoItems}
        />
        <DistributionChart
          title="Répartition par tailles"
          icon={Ruler}
          items={sizeItems}
        />
      </div>
    </div>
  );
}