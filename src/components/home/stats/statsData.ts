import { TrendingUp, Clock, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatData {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

export const statsData: StatData[] = [
  {
    icon: TrendingUp,
    value: 85,
    suffix: '%',
    label: 'Augmentation des ventes',
    color: 'text-green-600'
  },
  {
    icon: Clock,
    value: 95,
    suffix: '%',
    label: 'Temps économisé',
    color: 'text-blue-600'
  },
  {
    icon: Star,
    value: 98,
    suffix: '%',
    label: 'Satisfaction client',
    color: 'text-yellow-600'
  }
];