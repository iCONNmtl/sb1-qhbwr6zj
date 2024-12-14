import React from 'react';
import { LayoutDashboard, Wand2, CreditCard, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SidebarLink from './SidebarLink';
import clsx from 'clsx';

interface SidebarNavProps {
  isCollapsed: boolean;
}

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const { user } = useStore();

  return (
    <nav className="space-y-1 px-3">
      {/* Primary action */}
      <SidebarLink
        to="/generator"
        icon={Wand2}
        label="Générateur"
        isCollapsed={isCollapsed}
        className={clsx(
          'gradient-bg text-white hover:opacity-90',
          isCollapsed ? 'justify-center' : ''
        )}
      />

      {/* Other navigation links */}
      <SidebarLink
        to="/dashboard"
        icon={LayoutDashboard}
        label="Tableau de bord"
        isCollapsed={isCollapsed}
        className={isCollapsed ? 'justify-center' : ''}
      />
      <SidebarLink
        to="/pricing"
        icon={CreditCard}
        label="Tarifs"
        isCollapsed={isCollapsed}
        className={isCollapsed ? 'justify-center' : ''}
      />
      {user?.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2' && (
        <SidebarLink
          to="/admin"
          icon={Settings}
          label="Admin"
          isCollapsed={isCollapsed}
          className={isCollapsed ? 'justify-center' : ''}
        />
      )}
    </nav>
  );
}