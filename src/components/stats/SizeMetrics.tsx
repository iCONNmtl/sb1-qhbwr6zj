import React from 'react';
import { COLORS, SIZES } from './constants';
import PieChartWithTooltip from './PieChartWithTooltip';
import { Package } from 'lucide-react';

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

  // Prepare data for pie charts - show top 5 and group the rest as "Autres"
  const prepareChartData = (data: typeof sizeMetrics, valueKey: 'revenue' | 'profit' | 'quantity', total: number) => {
    // Sort by the value key in descending order
    const sortedData = [...data].sort((a, b) => b[valueKey] - a[valueKey]);
    
    // Take top 5
    const top5 = sortedData.slice(0, 5);
    
    // Group the rest if there are more than 5 items
    if (sortedData.length > 5) {
      const others = sortedData.slice(5);
      const othersValue = others.reduce((sum, item) => sum + item[valueKey], 0);
      const othersPercentage = (othersValue / total) * 100;
      
      return [
        ...top5.map(item => ({
          name: SIZES.find(s => s.id === item.size)?.label || item.size,
          value: item[valueKey],
          percentage: (item[valueKey] / total) * 100
        })),
        {
          name: 'Autres',
          value: othersValue,
          percentage: othersPercentage
        }
      ];
    }
    
    // If 5 or fewer items, return them all
    return top5.map(item => ({
      name: SIZES.find(s => s.id === item.size)?.label || item.size,
      value: item[valueKey],
      percentage: (item[valueKey] / total) * 100
    }));
  };

  const revenueData = prepareChartData(sizeMetrics, 'revenue', totalRevenue);
  const profitData = prepareChartData(sizeMetrics, 'profit', totalProfit);
  const itemsData = prepareChartData(sizeMetrics, 'quantity', totalItems);

  // Get colors for each size
  const getSizeColors = () => {
    const colors = SIZES.map(size => size.color);
    // Add a gray color for "Autres"
    return [...colors.slice(0, 5), '#9CA3AF'];
  };

  const sizeColors = getSizeColors();

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance par taille</h2>
      
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
              colors={sizeColors}
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
              colors={sizeColors}
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
              colors={sizeColors}
              total={totalItems}
              valuePrefix=""
              valueSuffix=" affiches"
              title=""
              showLegend={false}
            />
          </div>
        </div>
      </div>

      {/* Centralized Legend with Percentages */}
      <div className="bg-gray-50 rounded-xl p-4">
        <ul className="flex flex-wrap justify-center gap-6">
          {revenueData.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sizeColors[index] }}
              />
              <span className="text-sm text-gray-600">
                {item.name} <span className="text-gray-400">({item.percentage.toFixed(1)}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {sizeMetrics.map((size) => {
            const sizeConfig = SIZES.find(s => s.id === size.size);
            return (
              <div 
                key={size.size} 
                className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-200"
                style={{ borderLeft: `4px solid ${sizeConfig?.color || COLORS.revenue}` }}
              >
                {/* Size Info */}
                <div className="flex items-center gap-3 w-48">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${sizeConfig?.color}20` }}>
                    <Package className="h-5 w-5" style={{ color: sizeConfig?.color }} />
                  </div>
                  <div>
                    <div 
                      className="font-medium"
                      style={{ color: sizeConfig?.color }}
                    >
                      {sizeConfig?.label || size.size}
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Chiffre d'affaires</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-gray-900">
                      {size.revenue.toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-600">
                      ({((size.revenue / totalRevenue) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Profit */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-green-600">
                      {size.profit.toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-600">
                      ({((size.profit / totalProfit) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Affiches vendues</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-gray-900">
                      {size.quantity}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({((size.quantity / totalItems) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* Margin */}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Marge moyenne</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-lg font-medium text-indigo-600">
                      {((size.profit / size.revenue) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      ({(size.profit / size.quantity).toFixed(2)}€/unité)
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