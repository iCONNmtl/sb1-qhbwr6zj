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
  notificationCount?: number;
}

export default function SidebarLink({ 
  to, 
  icon: Icon, 
  label, 
  isCollapsed,
  className,
  notificationCount
}: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center px-3 py-2 rounded-lg transition-all duration-200 relative',
        isActive && !className?.includes('gradient-bg')
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-100',
        className
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && (
        <div className="ml-3 flex items-center">
          <span>{label}</span>
          {notificationCount !== undefined && notificationCount > 0 && (
            <div className="ml-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
              {notificationCount}
            </div>
          )}
        </div>
      )}
      
      {isCollapsed && notificationCount !== undefined && notificationCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
          {notificationCount}
        </div>
      )}
    </Link>
  );
}