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
    return `hsl(${hue}, 50%, 75%)`;
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
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
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
              colors={countryColors}
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
              colors={countryColors}
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
          {countryMetrics.map((country, index) => (
            <li key={country.country} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: countryColors[index] }}
              />
              <span className="text-2xl mr-1" role="img" aria-label={`Drapeau ${country.country}`}>
                {COUNTRY_FLAGS[country.country] || '🌍'}
              </span>
              <span className="text-sm text-gray-600">{country.country}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics Details */}
      <div className="bg-white rounded-xl">
        <div className="space-y-6">
          {countryMetrics.map((country, index) => (
            <div 
              key={country.country} 
              className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-200"
              style={{ borderLeft: `4px solid ${countryColors[index]}` }}
            >
              {/* Country Info */}
              <div className="flex items-center gap-3 w-48">
                <span className="text-2xl" role="img" aria-label={`Drapeau ${country.country}`}>
                  {COUNTRY_FLAGS[country.country] || '🌍'}
                </span>
                <span className="font-medium text-gray-900">
                  {country.country}
                </span>
              </div>

              {/* Revenue */}
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Chiffre d'affaires</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-gray-900">
                    {country.revenue.toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-600">
                    ({((country.revenue / totalRevenue) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Profit */}
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Bénéfices</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-green-600">
                    {country.profit.toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-600">
                    ({((country.profit / totalProfit) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Affiches vendues</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-gray-900">
                    {country.items}
                  </div>
                  <div className="text-sm text-gray-600">
                    ({((country.items / totalItems) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Marge moyenne</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-medium text-indigo-600">
                    {((country.profit / country.revenue) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    ({(country.profit / country.items).toFixed(2)}€/unité)
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