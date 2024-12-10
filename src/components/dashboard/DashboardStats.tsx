import React from 'react';
import { BarChart2, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  totalGenerations: number;
  lastGenerationDate?: string;
}

export default function DashboardStats({ totalGenerations, lastGenerationDate }: DashboardStatsProps) {
  const stats = [
    {
      icon: <BarChart2 className="h-5 w-5 text-indigo-600" />,
      label: "Mockups générés",
      value: totalGenerations
    },
    {
      icon: <Calendar className="h-5 w-5 text-indigo-600" />,
      label: "Dernière génération",
      value: lastGenerationDate ? new Date(lastGenerationDate).toLocaleDateString() : 'Aucune'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}