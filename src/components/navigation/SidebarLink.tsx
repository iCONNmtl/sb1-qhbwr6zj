import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  className?: string;
}

export default function SidebarLink({ 
  to, 
  icon: Icon, 
  label, 
  isCollapsed,
  className 
}: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center px-3 py-2 rounded-lg transition-all duration-200',
        isActive && !className?.includes('gradient-bg')
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-100',
        className
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}