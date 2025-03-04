import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, Settings, ChevronDown } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email
      .split('@')[0]
      .split('.')
      .map(part => part[0]?.toUpperCase())
      .join('');
  };

  return (
    <div 
      className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50',
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
          className="absolute -right-3 top-8 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        <div className="flex-1 py-4">
          <SidebarNav isCollapsed={isSidebarCollapsed} />
        </div>

        <div className="mt-auto">
          <SidebarPlan isCollapsed={isSidebarCollapsed} />
          
          <div className="border-t border-gray-100 mt-2 p-3">
            {/* User Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={clsx(
                  'flex items-center w-full px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200',
                  isSidebarCollapsed ? 'justify-center' : ''
                )}
              >
                {isSidebarCollapsed ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                ) : (
                  <>
                    <div className="flex items-center flex-1">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user?.photoURL || undefined} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user?.displayName || user?.email?.split('@')[0]}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={clsx(
                      "h-4 w-4 ml-2 transition-transform",
                      showUserMenu && "transform rotate-180"
                    )} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}