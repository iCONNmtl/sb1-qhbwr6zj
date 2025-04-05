import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Instagram, Linkedin, Facebook, Twitter, Pinterest } from 'lucide-react';
import Logo from '../common/Logo';
import clsx from 'clsx';

const FOOTER_LINKS = [
  {
    title: 'Produit',
    links: [
      { to: '/mockups', label: 'Librairie' },
      { to: '/products', label: 'Catalogue' }
    ]
  },
  {
    title: 'Ressources',
    links: [
      { to: '/training', label: 'Cours' },
      { to: '/pricing', label: 'Tarifs' },
      { href: 'https://status.mockuppro.com', label: 'Status' },
      { href: 'https://blog.mockuppro.com', label: 'Blog' }
    ]
  },
  {
    title: 'Légal',
    links: [
      { to: '/legal/mentions-legales', label: 'Mentions légales' },
      { to: '/legal/cgu', label: 'CGU' },
      { to: '/legal/cgv', label: 'CGV' },
      { to: '/legal/confidentialite', label: 'Confidentialité' }
    ]
  }
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/pixmock',
    icon: Instagram
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/pixmock',
    icon: Linkedin
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/pixmock',
    icon: Facebook
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/pixmock',
    icon: Twitter
  }
];

export default function Footer() {
  const { user, isSidebarCollapsed } = useStore();
  
  return (
    <footer className={clsx(
      'bg-white border-t border-gray-200 transition-all duration-300',
      user ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
    )}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-4 lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 text-base text-gray-600 max-w-md">
            La plateforme de print on demand pour créer et gérer votre business d'affiches de A à Z.
            </p>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-8 lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {FOOTER_LINKS.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        {link.to ? (
                          <Link 
                            to={link.to}
                            className="text-base text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-base text-gray-600">
              © {new Date().getFullYear()} Pixmock. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  title={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}