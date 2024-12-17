import { TrendingUp, Clock, Star } from 'lucide-react';
import type { Stat } from './types';

export const stats: Stat[] = [
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