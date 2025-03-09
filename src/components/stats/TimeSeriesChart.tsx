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
  ResponsiveContainer
} from 'recharts';
import { COLORS } from './constants';

interface TimeSeriesChartProps {
  data: any[];
  selectedMetrics: string[];
}

export default function TimeSeriesChart({ data, selectedMetrics }: TimeSeriesChartProps) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM')}
          />
          <YAxis 
            yAxisId="money"
            orientation="left"
            tickFormatter={(value) => `${value.toFixed(2)}€`}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              return [`${value.toFixed(2)}€`, name];
            }}
            labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
          />
          <Legend />
          
          {selectedMetrics.includes('revenue') && (
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="revenue"
              name="CA Total"
              stroke={COLORS.revenue}
              strokeWidth={2}
              dot={false}
            />
          )}
          {selectedMetrics.includes('cost') && (
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="cost"
              name="Dépenses"
              stroke={COLORS.cost}
              strokeWidth={2}
              dot={false}
            />
          )}
          {selectedMetrics.includes('profit') && (
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="profit"
              name="Bénéfices"
              stroke={COLORS.profit}
              strokeWidth={2}
              dot={false}
            />
          )}
          {selectedMetrics.includes('averageOrder') && (
            <Line
              yAxisId="money"
              type="monotone"
              dataKey="averageOrder"
              name="Panier Moyen"
              stroke={COLORS.averageOrder}
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}