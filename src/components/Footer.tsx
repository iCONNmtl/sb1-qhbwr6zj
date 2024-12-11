import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-32">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="gradient-bg p-2 rounded-xl">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Pixmock</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Créez des mockups professionnels en quelques secondes
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Légal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/legal/mentions-legales" className="text-gray-600 hover:text-indigo-600">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/legal/cgu" className="text-gray-600 hover:text-indigo-600">
                  CGU
                </Link>
              </li>
              <li>
                <Link to="/legal/cgv" className="text-gray-600 hover:text-indigo-600">
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/legal/confidentialite" className="text-gray-600 hover:text-indigo-600">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Ressources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-indigo-600">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:contact@pixmock.com" className="text-gray-600 hover:text-indigo-600">
                  contact@pixmock.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Pixmock. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}