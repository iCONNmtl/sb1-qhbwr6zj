import React from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { COLORS } from './constants';

interface TimeSeriesChartProps {
  data: any[];
  selectedMetrics: string[];
}

export default function TimeSeriesChart({ data, selectedMetrics }: TimeSeriesChartProps) {
  return (
    <div className="h-[400px] bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {selectedMetrics.includes('revenue') && (
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0}/>
              </linearGradient>
            )}
            {selectedMetrics.includes('cost') && (
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.cost} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={COLORS.cost} stopOpacity={0}/>
              </linearGradient>
            )}
            {selectedMetrics.includes('profit') && (
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.profit} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={COLORS.profit} stopOpacity={0}/>
              </linearGradient>
            )}
            {selectedMetrics.includes('averageOrder') && (
              <linearGradient id="colorAverageOrder" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.averageOrder} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={COLORS.averageOrder} stopOpacity={0}/>
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM')}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            yAxisId="money"
            orientation="left"
            tickFormatter={(value) => `${value.toFixed(0)}€`}
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const formattedValue = `${value.toFixed(2)}€`;
              const displayName = 
                name === 'revenue' ? 'CA Total' :
                name === 'cost' ? 'Dépenses' :
                name === 'profit' ? 'Bénéfices' :
                name === 'averageOrder' ? 'Panier Moyen' : name;
              return [formattedValue, displayName];
            }}
            labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              padding: '10px 14px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => {
              return value === 'revenue' ? 'CA Total' :
                     value === 'cost' ? 'Dépenses' :
                     value === 'profit' ? 'Bénéfices' :
                     value === 'averageOrder' ? 'Panier Moyen' : value;
            }}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          
          {selectedMetrics.includes('revenue') && (
            <Area
              yAxisId="money"
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke={COLORS.revenue}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
          
          {selectedMetrics.includes('cost') && (
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="cost"
              name="cost"
              stroke={COLORS.cost}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCost)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
          
          {selectedMetrics.includes('profit') && (
            <Area
              yAxisId="money"
              type="monotone"
              dataKey="profit"
              name="profit"
              stroke={COLORS.profit}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
          
          {selectedMetrics.includes('averageOrder') && (
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="averageOrder"
              name="averageOrder"
              stroke={COLORS.averageOrder}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAverageOrder)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}