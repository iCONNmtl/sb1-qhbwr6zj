import React from 'react';
import CountUp from 'react-countup';
import type { Stat } from './types';

interface StatCardProps {
  stat: Stat;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
          <stat.icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-base font-bold text-gray-900">
            <CountUp end={stat.value} suffix={stat.suffix} duration={2} />
          </div>
          <div className="text-xs text-gray-600 whitespace-nowrap">{stat.label}</div>
        </div>
      </div>
    </div>
  );
}