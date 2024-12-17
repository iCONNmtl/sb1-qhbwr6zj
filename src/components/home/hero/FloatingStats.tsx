import React from 'react';
import { TrendingUp, Clock, Star } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    icon: TrendingUp,
    value: 85,
    suffix: '%',
    label: 'Augmentation des ventes',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Star,
    value: 98,
    suffix: '%',
    label: 'Satisfaction client',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    icon: Clock,
    value: 95,
    suffix: '%',
    label: 'Temps économisé',
    color: 'from-blue-500 to-indigo-600'
  }
];

function StatCard({ stat }: { stat: any }) {
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

export default function FloatingStats() {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}