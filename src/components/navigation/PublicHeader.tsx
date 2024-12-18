import React from 'react';
import { Link } from 'react-router-dom';
import { User, CreditCard, Image } from 'lucide-react';
import Logo from '../common/Logo';

export default function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="sm" />

          <nav className="flex items-center space-x-6">
            <Link
              to="/mockups"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Image className="h-5 w-5 mr-2" />
              <span>Librairie</span>
            </Link>
            
            <Link
              to="/pricing"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              <span>Tarifs</span>
            </Link>

            <Link
              to="/login"
              className="flex items-center px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-200"
            >
              <User className="h-5 w-5 mr-2" />
              <span>Connexion</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}