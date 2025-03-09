import React from 'react';
import { DollarSign, TrendingUp, Package, Wallet, MinusCircle } from 'lucide-react';
import { COLORS } from './constants';

interface MetricsOverviewProps {
  metrics: {
    revenue: number;
    cost: number;
    profit: number;
    items: number;
    averageOrder: number;
  };
}

export default function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.revenue}20` }}>
            <DollarSign className="h-6 w-6" style={{ color: COLORS.revenue }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: COLORS.revenue }}>
              {metrics.revenue.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-500">Chiffre d'affaires</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.cost}20` }}>
            <MinusCircle className="h-6 w-6" style={{ color: COLORS.cost }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: COLORS.cost }}>
              {metrics.cost.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-500">Dépenses</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.profit}20` }}>
            <TrendingUp className="h-6 w-6" style={{ color: COLORS.profit }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: COLORS.profit }}>
              {metrics.profit.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-500">Bénéfices</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.items}20` }}>
            <Package className="h-6 w-6" style={{ color: COLORS.items }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: COLORS.items }}>
              {metrics.items}
            </div>
            <div className="text-sm text-gray-500">Affiches vendues</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.averageOrder}20` }}>
            <Wallet className="h-6 w-6" style={{ color: COLORS.averageOrder }} />
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: COLORS.averageOrder }}>
              {metrics.averageOrder.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-500">Panier moyen</div>
          </div>
        </div>
      </div>
    </div>
  );
}