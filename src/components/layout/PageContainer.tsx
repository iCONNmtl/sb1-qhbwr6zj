import React from 'react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  const { user, isSidebarCollapsed } = useStore();
  
  return (
    <div 
      className={clsx(
        'transition-all duration-300',
        user && (isSidebarCollapsed ? 'ml-16' : 'ml-64'),
        'p-8'
      )}
    >
      {children}
    </div>
  );
}