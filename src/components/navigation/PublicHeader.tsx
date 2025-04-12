import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, CreditCard, Image, Package, Menu, X } from 'lucide-react';
import Logo from '../common/Logo';
import clsx from 'clsx';

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/mockups', label: 'Librairie', icon: Image },
    { to: '/products', label: 'Catalogue', icon: Package },
    { to: '/pricing', label: 'Tarifs', icon: CreditCard },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(
                    "flex items-center py-2 text-sm font-medium transition-colors",
                    isActive(item.to)
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Connexion
            </Link>
            
            <Link
              to="/signup"
              className="flex items-center px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-200"
            >
              <User className="h-4 w-4 mr-2" />
              <span>Inscription</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "md:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <Logo size="sm" />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="flex flex-col space-y-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "flex items-center py-2 text-base font-medium",
                      isActive(item.to)
                        ? "text-indigo-600"
                        : "text-gray-600"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200 space-y-4">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Connexion
            </Link>
            
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white gradient-bg rounded-lg hover:opacity-90 transition-all duration-200"
            >
              <User className="h-5 w-5 mr-2" />
              <span>Inscription</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}