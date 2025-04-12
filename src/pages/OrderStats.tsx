import React, { useMemo, useState } from 'react';
import MetricsOverview from '../components/stats/MetricsOverview';
import TimeSeriesChart from '../components/stats/TimeSeriesChart';
import SizeMetrics from '../components/stats/SizeMetrics';
import PlatformMetrics from '../components/stats/PlatformMetrics';
import CountryMetrics from '../components/stats/CountryMetrics';
import ProductMetrics from '../components/stats/ProductMetrics';
import Filters from '../components/stats/Filters';
import { PLATFORMS } from '../components/stats/constants';
import { Link } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';
import type { Order, OrderPlatform } from '../types/order';
import type { UserProfile } from '../types/user';

interface OrderStatsProps {
  orders: Order[];
  userProfile?: UserProfile | null;
}

export default function OrderStats({ orders, userProfile }: OrderStatsProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<OrderPlatform[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'profit', 'cost']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'sizes' | 'countries' | 'products'>('overview');

  const isExpertPlan = userProfile?.subscription?.plan === 'Expert';

  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    orders.forEach(order => countries.add(order.shippingAddress.country));
    return Array.from(countries);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const isInDateRange = !dateRange.from || !dateRange.to ? true :
        orderDate >= dateRange.from && orderDate <= dateRange.to;

      const isInPlatform = selectedPlatforms.length === 0 || 
        selectedPlatforms.includes(order.platform);

      const isInCountry = selectedCountries.length === 0 ||
        selectedCountries.includes(order.shippingAddress.country);

      const isInSize = selectedSizes.length === 0 ||
        order.items.some(item => selectedSizes.includes(item.size));

      return isInDateRange && isInPlatform && isInCountry && isInSize;
    });
  }, [orders, dateRange, selectedPlatforms, selectedCountries, selectedSizes]);

  const metrics = useMemo(() => {
    const stats = filteredOrders.reduce((acc, order) => {
      acc.revenue += order.totalAmount;
      acc.cost += order.purchasePrice;
      acc.orders++;
      acc.items += order.items.reduce((sum, item) => sum + item.quantity, 0);
      return acc;
    }, {
      revenue: 0,
      cost: 0,
      orders: 0,
      items: 0
    });

    return {
      ...stats,
      profit: stats.revenue - stats.cost,
      averageOrder: stats.orders > 0 ? stats.revenue / stats.orders : 0
    };
  }, [filteredOrders]);

  const timeSeriesData = useMemo(() => {
    const data: Record<string, any> = {};
    
    filteredOrders.forEach(order => {
      const date = order.createdAt.split('T')[0];
      if (!data[date]) {
        data[date] = {
          date,
          revenue: 0,
          profit: 0,
          cost: 0,
          orders: 0,
          averageOrder: 0
        };
        
        PLATFORMS.forEach(platform => {
          data[date][`revenue_${platform.id}`] = 0;
          data[date][`profit_${platform.id}`] = 0;
        });
      }
      
      data[date].revenue += order.totalAmount;
      data[date].cost += order.purchasePrice;
      data[date].profit += order.totalAmount - order.purchasePrice;
      data[date].orders++;
      
      data[date][`revenue_${order.platform}`] += order.totalAmount;
      data[date][`profit_${order.platform}`] += order.totalAmount - order.purchasePrice;
    });

    return Object.values(data)
      .map(day => ({
        ...day,
        averageOrder: day.orders > 0 ? day.revenue / day.orders : 0
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredOrders]);

  const sizeMetrics = useMemo(() => {
    const metrics = new Map();
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!metrics.has(item.size)) {
          metrics.set(item.size, {
            size: item.size,
            quantity: 0,
            revenue: 0,
            cost: 0,
            profit: 0
          });
        }
        
        const stats = metrics.get(item.size);
        stats.quantity += item.quantity;
        stats.revenue += item.price * item.quantity;
        stats.cost += item.purchasePrice * item.quantity;
        stats.profit += (item.price - item.purchasePrice) * item.quantity;
      });
    });
    
    return Array.from(metrics.values())
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const platformMetrics = useMemo(() => {
    const metrics = new Map();
    
    filteredOrders.forEach(order => {
      if (!metrics.has(order.platform)) {
        metrics.set(order.platform, {
          platform: order.platform,
          revenue: 0,
          cost: 0,
          orders: 0,
          items: 0,
          profit: 0,
          averageOrder: 0
        });
      }
      
      const stats = metrics.get(order.platform);
      stats.revenue += order.totalAmount;
      stats.cost += order.purchasePrice;
      stats.orders++;
      stats.items += order.items.reduce((sum, item) => sum + item.quantity, 0);
      stats.profit = stats.revenue - stats.cost;
      stats.averageOrder = stats.revenue / stats.orders;
    });
    
    return Array.from(metrics.values());
  }, [filteredOrders]);

  const countryMetrics = useMemo(() => {
    const metrics = new Map();
    
    filteredOrders.forEach(order => {
      const country = order.shippingAddress.country;
      if (!metrics.has(country)) {
        metrics.set(country, {
          country,
          revenue: 0,
          cost: 0,
          orders: 0,
          items: 0,
          profit: 0,
          averageOrder: 0
        });
      }
      
      const stats = metrics.get(country);
      stats.revenue += order.totalAmount;
      stats.cost += order.purchasePrice;
      stats.orders++;
      stats.items += order.items.reduce((sum, item) => sum + item.quantity, 0);
      stats.profit = stats.revenue - stats.cost;
      stats.averageOrder = stats.revenue / stats.orders;
    });
    
    return Array.from(metrics.values())
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  const productMetrics = useMemo(() => {
    const metrics = new Map();
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        // Use SKU as unique identifier
        if (!metrics.has(item.sku)) {
          metrics.set(item.sku, {
            sku: item.sku,
            productName: item.size, // Default to size if no product name
            productType: 'Poster', // Default product type
            quantity: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
            designUrl: item.designUrl // Add design URL
          });
        }
        
        const stats = metrics.get(item.sku);
        stats.quantity += item.quantity;
        stats.revenue += item.price * item.quantity;
        stats.cost += item.purchasePrice * item.quantity;
        stats.profit += (item.price - item.purchasePrice) * item.quantity;
        
        // Update product name if available
        if (item.productId) {
          stats.productName = `${item.size} (${item.dimensions.cm})`;
          stats.productType = item.productId.includes('premium') ? 'Poster Premium' : 'Poster Standard';
        }
      });
    });
    
    return Array.from(metrics.values())
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      <Filters
        dateRange={dateRange}
        setDateRange={setDateRange}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
        selectedMetrics={selectedMetrics}
        setSelectedMetrics={setSelectedMetrics}
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
        availableCountries={availableCountries}
      />

      <MetricsOverview metrics={metrics} />

      {/* Tabs Navigation - Only visible for Expert plan */}
      {isExpertPlan ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('platforms')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'platforms'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Par plateforme
              </button>
              <button
                onClick={() => setActiveTab('sizes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sizes'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Par taille
              </button>
              <button
                onClick={() => setActiveTab('countries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'countries'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Par pays
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Par produit
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Évolution dans le temps
                </h3>
                <TimeSeriesChart 
                  data={timeSeriesData}
                  selectedMetrics={selectedMetrics}
                />
              </div>
            )}

            {activeTab === 'platforms' && (
              <PlatformMetrics platformMetrics={platformMetrics} />
            )}

            {activeTab === 'sizes' && (
              <SizeMetrics sizeMetrics={sizeMetrics} />
            )}

            {activeTab === 'countries' && (
              <CountryMetrics countryMetrics={countryMetrics} />
            )}

            {activeTab === 'products' && (
              <ProductMetrics productMetrics={productMetrics} />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Statistiques détaillées réservées au plan Expert
            </h3>
            <p className="text-gray-600 mb-6">
              Passez au plan Expert pour accéder aux statistiques détaillées par plateforme, pays, taille et produit, ainsi qu'à l'évolution dans le temps.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:opacity-90 transition-colors"
            >
              <Lock className="h-5 w-5 mr-2" />
              Passer au plan Expert
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}