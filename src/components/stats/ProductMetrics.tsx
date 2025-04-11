import React from 'react';
import { Package, TrendingUp, DollarSign } from 'lucide-react';
import PieChartWithTooltip from './PieChartWithTooltip';
import { COLORS } from './constants';

interface ProductMetrics {
  productName: string;
  productType: string;
  sku: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  designUrl?: string;
}

interface ProductMetricsProps {
  productMetrics: ProductMetrics[];
}

export default function ProductMetrics({ productMetrics }: ProductMetricsProps) {
  // Calculate totals
  const totalRevenue = productMetrics.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = productMetrics.reduce((sum, p) => sum + p.profit, 0);
  const totalItems = productMetrics.reduce((sum, p) => sum + p.quantity, 0);

  // Generate colors for products
  const productColors = productMetrics.map((_, index) => {
    const hue = (index * 360) / productMetrics.length;
    return `hsl(${hue}, 70%, 50%)`;
  });

  // Prepare data for pie charts - show top 5 and group the rest as "Autres"
  const prepareChartData = (data: ProductMetrics[], valueKey: 'revenue' | 'profit' | 'quantity', total: number) => {
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
          name: item.productName,
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
      name: item.productName,
      value: item[valueKey],
      percentage: (item[valueKey] / total) * 100
    }));
  };

  const revenueData = prepareChartData(productMetrics, 'revenue', totalRevenue);
  const profitData = prepareChartData(productMetrics, 'profit', totalProfit);
  const itemsData = prepareChartData(productMetrics, 'quantity', totalItems);

  // Colors for the charts - add a gray color for "Autres"
  const chartColors = [...productColors.slice(0, 5), '#9CA3AF'];

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
            <h4 className="font-medium text-gray-900">Chiffre d'affaires par produit</h4>
          </div>
          <div className="h-[200px]">
            <PieChartWithTooltip
              data={revenueData}
              colors={chartColors}
              total={totalRevenue}
              valuePrefix=""
              valueSuffix="€"
              title=""
              showLegend={false}
            />
          </div>
        </div>

        {/* Profit Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Bénéfices par produit</h4>
          </div>
          <div className="h-[200px]">
            <PieChartWithTooltip
              data={profitData}
              colors={chartColors}
              total={totalProfit}
              valuePrefix=""
              valueSuffix="€"
              title=""
              showLegend={false}
            />
          </div>
        </div>

        {/* Items Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900">Affiches vendues par produit</h4>
          </div>
          <div className="h-[200px]">
            <PieChartWithTooltip
              data={itemsData}
              colors={chartColors}
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
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <ul className="flex flex-wrap justify-center gap-6">
          {revenueData.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: chartColors[index] }}
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
          {productMetrics.map((product, index) => (
            <div 
              key={product.sku} 
              className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-200"
              style={{ borderLeft: `4px solid ${index < 5 ? productColors[index] : '#9CA3AF'}` }}
            >
              {/* Product Image */}
              {product.designUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img 
                    src={product.designUrl} 
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {product.productName}
                </div>
                <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                  <span>{product.productType}</span>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                    SKU: {product.sku}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="w-32">
                <div className="text-sm text-gray-500 mb-1">Quantité</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-gray-900">
                    {product.quantity}
                  </div>
                  <div className="text-sm text-gray-600">
                    ({((product.quantity / totalItems) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="w-32">
                <div className="text-sm text-gray-500 mb-1">Chiffre d'affaires</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-gray-900">
                    {product.revenue.toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-600">
                    ({((product.revenue / totalRevenue) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div className="w-32">
                <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-green-600">
                    {product.profit.toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-600">
                    ({((product.profit / totalProfit) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div className="w-32">
                <div className="text-sm text-gray-500 mb-1">Marge</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-indigo-600">
                    {((product.profit / product.revenue) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    ({(product.profit / product.quantity).toFixed(2)}€/unité)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}