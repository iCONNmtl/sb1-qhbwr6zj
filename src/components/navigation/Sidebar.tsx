import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, Settings, UserCircle } from 'lucide-react';
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
  const [showUserMenu, setShowUserMenu] = useState(false);

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
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className={clsx(
          'flex items-center p-4',
          isSidebarCollapsed ? 'justify-center' : 'px-6'
        )}>
          <Logo showText={!isSidebarCollapsed} size={isSidebarCollapsed ? 'sm' : 'md'} />
        </div>

        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-4 top-8 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          <div className={clsx(
            "transition-transform duration-300",
            isSidebarCollapsed ? "rotate-0" : "rotate-180"
          )}>
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </div>
        </button>

        <SidebarNav isCollapsed={isSidebarCollapsed} />

        <div className="mt-auto">
          <SidebarPlan isCollapsed={isSidebarCollapsed} />
          
          <div className="border-t border-gray-100 mt-2 p-3">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={clsx(
                  'flex items-center w-full px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200',
                  isSidebarCollapsed ? 'justify-center' : '',
                  showUserMenu && !isSidebarCollapsed && 'bg-gray-100'
                )}
              >
                {isSidebarCollapsed ? (
                  <UserCircle className="h-6 w-6 text-gray-600" />
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-6 w-6 text-gray-600" />
                      <div className="flex flex-col items-start min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-0.5">
                          Bienvenue
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[160px]">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className={clsx(
                      "transition-transform duration-300 ml-auto",
                      showUserMenu ? "rotate-90" : "rotate-0"
                    )}>
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    </div>
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && !isSidebarCollapsed && (
                <div className="absolute bottom-full left-0 w-full mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}

              {/* Collapsed Menu Tooltip */}
              {isSidebarCollapsed && showUserMenu && (
                <div className="absolute left-full ml-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}