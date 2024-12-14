import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import SidebarNav from './SidebarNav';
import SidebarLegal from './SidebarLegal';
import SidebarPlan from './SidebarPlan';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function Sidebar() {
  const { user, isSidebarCollapsed, setSidebarCollapsed } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div 
      className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={clsx(
          'flex items-center p-4',
          isSidebarCollapsed ? 'justify-center' : 'px-6'
        )}>
          <div className="gradient-bg p-2 rounded-xl">
            <Layers className="h-8 w-8 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <span className="ml-3 text-xl font-bold text-gray-900">
              MockupPro
            </span>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <SidebarNav isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-gray-100">
          {/* Plan info */}
          <div className="border-b border-gray-100">
            <SidebarPlan isCollapsed={isSidebarCollapsed} />
          </div>

          <SidebarLegal isCollapsed={isSidebarCollapsed} />
          
          <div className="p-3">
            <button
              onClick={handleLogout}
              className={clsx(
                'flex items-center w-full px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200',
                isSidebarCollapsed ? 'justify-center' : ''
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">Déconnexion</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}