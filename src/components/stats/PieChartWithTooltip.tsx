import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

interface PieChartWithTooltipProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  colors: string[];
  total: number;
  valuePrefix?: string;
  valueSuffix?: string;
  title: string;
  showLegend?: boolean;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      style={{
        fontSize: '12px',
        fontWeight: 'bold'
      }}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function PieChartWithTooltip({
  data,
  colors,
  total,
  valuePrefix = '',
  valueSuffix = '',
  title,
  showLegend = false
}: PieChartWithTooltipProps) {
  return (
    <div className="relative h-full">
      <h4 className="absolute top-0 left-0 text-sm font-medium text-gray-900 z-10">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload}
                label={label}
                total={total}
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            )}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}