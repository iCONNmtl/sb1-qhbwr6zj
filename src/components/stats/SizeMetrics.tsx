import React from 'react';
import { COLORS, SIZES } from './constants';
import PieChartWithTooltip from './PieChartWithTooltip';
import { Package, TrendingUp, DollarSign } from 'lucide-react';

interface SizeMetricsProps {
  sizeMetrics: Array<{
    size: string;
    quantity: number;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

export default function SizeMetrics({ sizeMetrics }: SizeMetricsProps) {
  // Calculate totals
  const totalRevenue = sizeMetrics.reduce((sum, s) => sum + s.revenue, 0);
  const totalProfit = sizeMetrics.reduce((sum, s) => sum + s.profit, 0);
  const totalItems = sizeMetrics.reduce((sum, s) => sum + s.quantity, 0);

  // Prepare data for pie charts
  const revenueData = sizeMetrics.map(size => ({
    name: SIZES.find(s => s.id === size.size)?.label || size.size,
    value: size.revenue,
    percentage: (size.revenue / totalRevenue) * 100
  }));

  const profitData = sizeMetrics.map(size => ({
    name: SIZES.find(s => s.id === size.size)?.label || size.size,
    value: size.profit,
    percentage: (size.profit / totalProfit) * 100
  }));

  const itemsData = sizeMetrics.map(size => ({
    name: SIZES.find(s => s.id === size.size)?.label || size.size,
    value: size.quantity,
    percentage: (size.quantity / totalItems) * 100
  }));

  const sizeColors = SIZES.map(size => size.color);

  return (
    <div className="space-y-8">
      {/* Charts Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-indigo-600" />
            </div>
            <h4 className="font-medium text-gray-900">Chiffre d'affaires</h4>
          </div>
          <div className="h-[200px]">
            <PieChartWithTooltip
              data={revenueData}
              colors={sizeColors}
              total={totalRevenue}
              valuePrefix=""
              valueSuffix="€"
              title=""
            />
          </div>
        </div>

        {/* Profit Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Bénéfices</h4>
          </div>
          <div className="h-[200px]">
            <PieChartWithTooltip
              data={profitData}
              colors={sizeColors}
              total={totalProfit}
              valuePrefix=""
              valueSuffix="€"
              title=""
            />
          </div>
        </div>

        {/* Items Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900">Affiches vendues</h4>
          </div>
          <div className="h-[200px]">
            <PieChartWithTooltip
              data={itemsData}
              colors={sizeColors}
              total={totalItems}
              valuePrefix=""
              valueSuffix=" affiches"
              title=""
            />
          </div>
        </div>
      </div>

      {/* Metrics Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          {sizeMetrics.map((size) => {
            const sizeConfig = SIZES.find(s => s.id === size.size);
            return (
              <div 
                key={size.size} 
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                style={{ borderLeft: `4px solid ${sizeConfig?.color || COLORS.revenue}` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${sizeConfig?.color}20` }}>
                      <Package className="h-5 w-5" style={{ color: sizeConfig?.color }} />
                    </div>
                    <span className="font-medium text-gray-900">
                      {sizeConfig?.label || size.size}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {size.quantity} affiches
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">CA</div>
                    <div className="font-medium text-gray-900">
                      {((size.revenue / totalRevenue) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {size.revenue.toFixed(2)}€
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                    <div className="font-medium text-green-600">
                      {((size.profit / totalProfit) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {size.profit.toFixed(2)}€
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Marge</div>
                    <div className="font-medium text-indigo-600">
                      {((size.profit / size.revenue) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {(size.profit / size.quantity).toFixed(2)}€/unité
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}