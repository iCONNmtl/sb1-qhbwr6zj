import React from 'react';
import { COLORS, PLATFORMS } from './constants';
import PieChartWithTooltip from './PieChartWithTooltip';
import { Package, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import type { OrderPlatform } from '../../types/order';

interface PlatformMetricsProps {
  platformMetrics: Array<{
    platform: OrderPlatform;
    revenue: number;
    profit: number;
    items: number;
  }>;
}

export default function PlatformMetrics({ platformMetrics }: PlatformMetricsProps) {
  // Calculate totals
  const totalRevenue = platformMetrics.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = platformMetrics.reduce((sum, p) => sum + p.profit, 0);
  const totalItems = platformMetrics.reduce((sum, p) => sum + p.items, 0);

  // Prepare data for pie charts
  const revenueData = platformMetrics.map(platform => ({
    name: PLATFORMS.find(p => p.id === platform.platform)?.label || platform.platform,
    value: platform.revenue,
    percentage: (platform.revenue / totalRevenue) * 100
  }));

  const profitData = platformMetrics.map(platform => ({
    name: PLATFORMS.find(p => p.id === platform.platform)?.label || platform.platform,
    value: platform.profit,
    percentage: (platform.profit / totalProfit) * 100
  }));

  const itemsData = platformMetrics.map(platform => ({
    name: PLATFORMS.find(p => p.id === platform.platform)?.label || platform.platform,
    value: platform.items,
    percentage: (platform.items / totalItems) * 100
  }));

  const platformColors = PLATFORMS.map(platform => platform.color);

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
              colors={platformColors}
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
              colors={platformColors}
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
              colors={platformColors}
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
          {platformMetrics.map((platform) => {
            const platformConfig = PLATFORMS.find(p => p.id === platform.platform);
            return (
              <div 
                key={platform.platform} 
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                style={{ borderLeft: `4px solid ${platformConfig?.color || COLORS.revenue}` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${platformConfig?.color}20` }}>
                      <ShoppingBag className="h-5 w-5" style={{ color: platformConfig?.color }} />
                    </div>
                    <span className="font-medium text-gray-900">
                      {platformConfig?.label || platform.platform}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {platform.items} affiches
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">CA</div>
                    <div className="font-medium text-gray-900">
                      {((platform.revenue / totalRevenue) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {platform.revenue.toFixed(2)}€
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                    <div className="font-medium text-green-600">
                      {((platform.profit / totalProfit) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {platform.profit.toFixed(2)}€
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Marge</div>
                    <div className="font-medium text-indigo-600">
                      {((platform.profit / platform.revenue) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {(platform.profit / platform.items).toFixed(2)}€/unité
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