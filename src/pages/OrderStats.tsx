import React, { useMemo, useState } from 'react';
import MetricsOverview from '../components/stats/MetricsOverview';
import TimeSeriesChart from '../components/stats/TimeSeriesChart';
import SizeMetrics from '../components/stats/SizeMetrics';
import PlatformMetrics from '../components/stats/PlatformMetrics';
import CountryMetrics from '../components/stats/CountryMetrics';
import Filters from '../components/stats/Filters';
import { PLATFORMS } from '../components/stats/constants';
import type { Order, OrderPlatform } from '../types/order';

interface OrderStatsProps {
  orders: Order[];
}

export default function OrderStats({ orders }: OrderStatsProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<OrderPlatform[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'profit', 'cost']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Évolution dans le temps
        </h3>
        <TimeSeriesChart 
          data={timeSeriesData}
          selectedMetrics={selectedMetrics}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance par taille
        </h3>
        <SizeMetrics sizeMetrics={sizeMetrics} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance par plateforme
        </h3>
        <PlatformMetrics platformMetrics={platformMetrics} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance par pays
        </h3>
        <CountryMetrics countryMetrics={countryMetrics} />
      </div>
    </div>
  );
}