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
        'group flex items-center px-3 py-2 rounded-lg transition-all duration-200 relative',
        isActive && !className?.includes('gradient-bg')
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-700 hover:bg-gray-100',
        className
      )}
      title={isCollapsed ? label : undefined}
    >
      {/* Icon - always visible */}
      <div className={clsx(
        "flex items-center justify-center",
        isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"
      )}>
        <Icon className="h-full w-full" />
      </div>
      
      {/* Label - only visible when not collapsed */}
      {!isCollapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}
      
      {/* Notification badge */}
      {notificationCount !== undefined && notificationCount > 0 && (
        <div className={clsx(
          "bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center",
          isCollapsed 
            ? "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1" 
            : "ml-auto min-w-[20px] h-5 px-1.5"
        )}>
          {notificationCount}
        </div>
      )}
    </Link>
  );
}