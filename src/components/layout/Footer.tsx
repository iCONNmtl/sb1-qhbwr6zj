import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Twitter, Mail, Phone, MapPin, Globe, Shield, CreditCard, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Logo from '../common/Logo';
import clsx from 'clsx';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/mockuppro',
    icon: Instagram
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/mockuppro',
    icon: Linkedin
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/mockuppro',
    icon: Facebook
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/mockuppro',
    icon: Twitter
  }
];

const FOOTER_LINKS = [
  {
    title: 'Produit',
    links: [
      { to: '/mockups', label: 'Librairie' },
      { to: '/pricing', label: 'Tarifs' },
      { to: '/training', label: 'Formations' },
      { to: '/products', label: 'Catalogue' }
    ]
  },
  {
    title: 'Ressources',
    links: [
      { to: '/training', label: 'Centre d\'aide' },
      { to: '/contact', label: 'Support' },
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

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@pixmock.com',
    href: 'mailto:contact@pixmock.com'
  }
];

const TRUST_ELEMENTS = [
  {
    icon: Globe,
    title: 'Livraison mondiale',
    description: 'Expédition dans plus de 50 pays'
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'Transactions 100% sécurisées'
  },
  {
    icon: CreditCard,
    title: 'Satisfait ou remboursé',
    description: 'Garantie 30 jours'
  },
  {
    icon: Heart,
    title: 'Service client',
    description: 'Support 7j/7 par email'
  }
];

export default function Footer() {
  const { user, isSidebarCollapsed } = useStore();
  
  return (
    <footer className={clsx(
      'bg-white border-t border-gray-200 transition-all duration-300',
      user ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 px-6 py-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="lg" />
            <p className="text-gray-600">
              Créez des mockups professionnels en quelques secondes. La plateforme tout-en-un pour vos présentations de designs.
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

          {/* Links Sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link 
                        to={link.to}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start">
                  <Icon className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{label}</div>
                    {href ? (
                      <a 
                        href={href}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-gray-600">{value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="border-t border-gray-200 py-8 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_ELEMENTS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{title}</div>
                  <div className="text-sm text-gray-600">{description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Pixmock. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-6">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                alt="Stripe"
                className="h-6 opacity-50 hover:opacity-75 transition-opacity"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Visa.svg" 
                alt="Visa"
                className="h-4 opacity-50 hover:opacity-75 transition-opacity"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                alt="Mastercard"
                className="h-6 opacity-50 hover:opacity-75 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}