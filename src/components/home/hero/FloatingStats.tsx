import React from 'react';
import StatCard from './StatCard';
import { stats } from './statsData';

export default function FloatingStats() {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}