import React from 'react';
import { useStore } from '../../store/useStore';
import PublicHeader from '../navigation/PublicHeader';
import Footer from './Footer';
import clsx from 'clsx';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  const { user, isSidebarCollapsed } = useStore();
  
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {!user && <PublicHeader />}
      <main 
        className={clsx(
          'flex-1 transition-all duration-300',
          user ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0',
          'p-8'
        )}
      >
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}