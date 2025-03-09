import React from 'react';
import { Globe2, Package, TrendingUp, DollarSign } from 'lucide-react';
import PieChartWithTooltip from './PieChartWithTooltip';
import { COUNTRY_FLAGS } from './constants';

interface CountryMetricsProps {
  countryMetrics: Array<{
    country: string;
    revenue: number;
    cost: number;
    orders: number;
    items: number;
    profit: number;
    averageOrder: number;
  }>;
}

export default function CountryMetrics({ countryMetrics }: CountryMetricsProps) {
  // Calculate totals
  const totalRevenue = countryMetrics.reduce((sum, c) => sum + c.revenue, 0);
  const totalProfit = countryMetrics.reduce((sum, c) => sum + c.profit, 0);
  const totalItems = countryMetrics.reduce((sum, c) => sum + c.items, 0);

  // Generate colors for countries
  const countryColors = countryMetrics.map((_, index) => {
    const hue = (index * 360) / countryMetrics.length;
    return `hsl(${hue}, 70%, 50%)`;
  });

  // Prepare data for pie charts
  const revenueData = countryMetrics.map(country => ({
    name: country.country,
    value: country.revenue,
    percentage: (country.revenue / totalRevenue) * 100
  }));

  const profitData = countryMetrics.map(country => ({
    name: country.country,
    value: country.profit,
    percentage: (country.profit / totalProfit) * 100
  }));

  const itemsData = countryMetrics.map(country => ({
    name: country.country,
    value: country.items,
    percentage: (country.items / totalItems) * 100
  }));

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
              colors={countryColors}
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
              colors={countryColors}
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
              colors={countryColors}
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
          {countryMetrics.map((country, index) => (
            <div 
              key={country.country} 
              className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              style={{ borderLeft: `4px solid ${countryColors[index]}` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${countryColors[index]}20` }}>
                    <Globe2 className="h-5 w-5" style={{ color: countryColors[index] }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" role="img" aria-label={`Drapeau ${country.country}`}>
                      {COUNTRY_FLAGS[country.country] || '🌍'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {country.country}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {country.items} affiches
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">CA</div>
                  <div className="font-medium text-gray-900">
                    {((country.revenue / totalRevenue) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {country.revenue.toFixed(2)}€
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                  <div className="font-medium text-green-600">
                    {((country.profit / totalProfit) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {country.profit.toFixed(2)}€
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Marge</div>
                  <div className="font-medium text-indigo-600">
                    {((country.profit / country.revenue) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {(country.profit / country.items).toFixed(2)}€/unité
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