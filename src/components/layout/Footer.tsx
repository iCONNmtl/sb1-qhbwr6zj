import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Logo from '../common/Logo';
import clsx from 'clsx';

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/mockuppro',
    icon: Linkedin
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/mockuppro',
    icon: Instagram
  }
];

const LEGAL_LINKS = [
  { to: '/legal/mentions-legales', label: 'Mentions légales' },
  { to: '/legal/cgu', label: 'CGU' },
  { to: '/legal/cgv', label: 'CGV' },
  { to: '/legal/confidentialite', label: 'Politique de confidentialité' }
];

export default function Footer() {
  const { user, isSidebarCollapsed } = useStore();

  return (
    <footer className={clsx(
      'bg-white border-t border-gray-200 transition-all duration-300',
      user ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
    )}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="col-span-1">
            <Logo size="sm" />
            <p className="mt-4 text-gray-600">
              Créez des mockups professionnels en quelques secondes
            </p>
          </div>

          {/* Pages légales */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Légal
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Ressources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@pixmock.com" className="text-gray-600 hover:text-indigo-600">
                  contact@pixmock.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Pixmock. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4">
              {SOCIAL_LINKS.map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  title={name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}