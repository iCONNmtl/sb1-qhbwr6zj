import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Layers, User, LayoutDashboard, LogOut, Wand2, CreditCard } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user } = useStore();
  const location = useLocation();
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
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="gradient-bg p-2 rounded-xl">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MockupPro</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/generator"
                  className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                    location.pathname === '/generator'
                      ? 'gradient-bg text-white'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  <span>Générateur</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    location.pathname === '/dashboard'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
                {user.uid === 'Juvh6BgsXhYsi3loKegWfzRIphG2' && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                      location.pathname === '/admin'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/pricing"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-all duration-200"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Tarifs</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-3 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>Connexion</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}