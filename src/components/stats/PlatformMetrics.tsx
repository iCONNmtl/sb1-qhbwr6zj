import React from 'react';
import { COLORS, PLATFORMS } from './constants';
import PieChartWithTooltip from './PieChartWithTooltip';
import { Package, TrendingUp, DollarSign } from 'lucide-react';
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
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
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
              showLegend={false}
            />
          </div>
        </div>

        {/* Profit Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
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
              showLegend={false}
            />
          </div>
        </div>

        {/* Items Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
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
              showLegend={false}
            />
          </div>
        </div>
      </div>

      {/* Centralized Legend */}
      <div className="bg-gray-50 rounded-xl p-4">
        <ul className="flex flex-wrap justify-center gap-6">
          {PLATFORMS.map((platform) => (
            <li key={platform.id} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: platform.color }}
              />
              <span className="text-sm text-gray-600">{platform.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics Details */}
      <div className="bg-white rounded-xl">
        <div className="space-y-6">
          {platformMetrics.map((platform) => {
            const platformConfig = PLATFORMS.find(p => p.id === platform.platform);
            return (
              <div 
                key={platform.platform} 
                className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-200"
                style={{ borderLeft: `4px solid ${platformConfig?.color || COLORS.revenue}` }}
              >
                {/* Platform Info */}
                <div className="flex items-center gap-3 w-48">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${platformConfig?.color}20` }}>
                    <Package className="h-5 w-5" style={{ color: platformConfig?.color }} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {platformConfig?.label || platform.platform}
                  </span>
                </div>

                {/* Revenue */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Chiffre d'affaires</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-gray-900">
                      {platform.revenue.toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-600">
                      ({((platform.revenue / totalRevenue) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Profit */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-green-600">
                      {platform.profit.toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-600">
                      ({((platform.profit / totalProfit) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Affiches vendues</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-gray-900">
                      {platform.items}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({((platform.items / totalItems) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Margin */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Marge moyenne</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-indigo-600">
                      {((platform.profit / platform.revenue) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      ({(platform.profit / platform.items).toFixed(2)}€/unité)
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