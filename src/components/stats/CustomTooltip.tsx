import React from 'react';
import { CUSTOM_TOOLTIP_STYLES } from './constants';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  total: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export default function CustomTooltip({ 
  active, 
  payload, 
  label,
  total,
  valuePrefix = '',
  valueSuffix = ''
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const percentage = (value / total) * 100;

  return (
    <div style={CUSTOM_TOOLTIP_STYLES}>
      <p className="font-medium mb-1">{label}</p>
      <div className="space-y-1">
        <p className="text-gray-600">
          {valuePrefix}{value.toFixed(2)}{valueSuffix}
        </p>
        <p className="text-indigo-600 font-medium">
          {percentage.toFixed(1)}% du total
        </p>
      </div>
    </div>
  );
}