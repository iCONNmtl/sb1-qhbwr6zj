import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Instagram, Linkedin, Facebook, Twitter, Heart, Layers, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../common/Logo';
import clsx from 'clsx';

export default function Footer() {
  const { user, isSidebarCollapsed } = useStore();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={clsx(
      'bg-white border-t border-gray-200 transition-all duration-300',
      user ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 py-12">
          {/* Brand Section */}
          <div className="md:col-span-4 lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 text-gray-600 max-w-md">
            La plateforme de print on demand pour créer et gérer votre business d'affiches de A à Z.
            </p>
            
            <div className="mt-6 flex space-x-4">
              <a 
                href="https://instagram.com/mockuppro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/mockuppro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com/mockuppro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/mockuppro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-8 lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Création
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/design-generator" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                    Créer un design
                    </Link>
                  </li>
                  <li>
                    <Link to="/generator" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Mockups
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Mes visuels
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Business
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/products" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Catalogue
                    </Link>
                  </li>
                  <li>
                  <Link to="/my-products" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Mes produits
                    </Link>
                  </li>
                  <li>
                  <Link to="/orders" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Commandes
                    </Link>
                  </li>
                  <li>
                  <Link to="/training" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Formations
                    </Link>
                  </li>
                  <li>
                  <Link to="/pricing" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Tarifs
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Légal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/legal/mentions-legales" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Mentions légales
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/cgu" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      CGU
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/cgv" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      CGV
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/confidentialite" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Confidentialité
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-base text-gray-600">
              © {currentYear} Pixmock. Tous droits réservés.
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>Fait avec</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>en France</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}