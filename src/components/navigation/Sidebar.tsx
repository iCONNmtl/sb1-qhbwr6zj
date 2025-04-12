import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, Settings, UserCircle, Bell } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import SidebarNav from './SidebarNav';
import SidebarPlan from './SidebarPlan';
import Logo from '../common/Logo';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function Sidebar() {
  const { user, isSidebarCollapsed, setSidebarCollapsed } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<{id: string; text: string; read: boolean}[]>([]);

  // Effet pour fermer le menu utilisateur quand on change de page
  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  // Simuler des notifications (à remplacer par une vraie logique)
  useEffect(() => {
    setNotifications([
      { id: '1', text: 'Nouvelle fonctionnalité disponible', read: false },
      { id: '2', text: 'Votre génération est terminée', read: true }
    ]);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className={clsx(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50',
        isSidebarCollapsed ? 'w-16' : 'w-64',
        'flex flex-col'
      )}
    >
      {/* Header */}
      <div className={clsx(
        'flex items-center h-16 border-b border-gray-100',
        isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
      )}>
        <Logo showText={!isSidebarCollapsed} size={isSidebarCollapsed ? 'sm' : 'md'} />
        
        {!isSidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Réduire le menu"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Collapse/Expand Button */}
      {isSidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="absolute -right-3 top-20 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          title="Développer le menu"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        <SidebarNav isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Subscription Info */}
      <div className={clsx(
        'border-t border-gray-100 py-3',
        isSidebarCollapsed ? 'px-2' : 'px-4'
      )}>
        <SidebarPlan isCollapsed={isSidebarCollapsed} />
      </div>

      {/* User Menu */}
      <div className="border-t border-gray-100 p-3">
        <div className="relative">
          <div className="flex items-center">

            {/* User Profile Button */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={clsx(
                'flex items-center rounded-lg transition-all duration-200 p-2',
                isSidebarCollapsed ? 'justify-center w-10 h-10' : 'w-full',
                showUserMenu ? 'bg-gray-100' : 'hover:bg-gray-100'
              )}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Only show text when not collapsed */}
              {!isSidebarCollapsed && (
                <div className="flex flex-col items-start min-w-0 ml-3">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                    {user?.email?.split('@')[0] || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[140px]">
                    {user?.email || ''}
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className={clsx(
              "absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-56 z-50",
              isSidebarCollapsed ? "left-0" : "right-0"
            )}>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0] || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3 text-gray-500" />
                  Paramètres
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}