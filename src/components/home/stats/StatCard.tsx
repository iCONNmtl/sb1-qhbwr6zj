import React from 'react';
import { LucideIcon } from 'lucide-react';
import CountUp from 'react-countup';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

export default function StatCard({ icon: Icon, value, suffix, label, color }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
      <div className={`w-12 h-12 ${color} bg-white rounded-xl flex items-center justify-center mx-auto mb-6`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        <CountUp end={value} suffix={suffix} duration={2.5} />
      </div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}