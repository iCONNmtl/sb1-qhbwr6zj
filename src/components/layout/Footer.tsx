import React from 'react';
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

export default function Footer() {
  const { user, isSidebarCollapsed } = useStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={clsx(
      'bg-white border-t border-gray-200 transition-all duration-300',
      user ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
    )}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Logo size="sm" />
            <span className="text-sm text-gray-500">
              © {currentYear} MockupPro. Tous droits réservés.
            </span>
          </div>

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
    </footer>
  );
}