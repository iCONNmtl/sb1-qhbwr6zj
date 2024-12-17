import { LucideIcon } from 'lucide-react';

export interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
}