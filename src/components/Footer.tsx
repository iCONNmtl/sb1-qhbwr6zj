import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Twitter, Heart, Layers, ArrowRight } from 'lucide-react';
import Logo from './common/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 py-12">
          {/* Brand Section */}
          <div className="md:col-span-4 lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 text-gray-600 max-w-md">
              Créez des mockups professionnels en quelques secondes. La plateforme tout-en-un pour vos présentations de designs.
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
                  Produit
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/mockups" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Librairie
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <Link to="/training" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Formations
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Catalogue
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Ressources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/training" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Centre d'aide
                    </Link>
                  </li>
                  <li>
                    <a href="https://status.mockuppro.com" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Status
                    </a>
                  </li>
                  <li>
                    <a href="https://blog.mockuppro.com" className="text-base text-gray-600 hover:text-indigo-600 transition-colors">
                      Blog
                    </a>
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
        
        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-8 bg-gray-50 rounded-t-3xl">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Mail className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Email</h3>
              <a href="mailto:contact@mockuppro.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
                contact@mockuppro.com
              </a>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Phone className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
              <a href="tel:+33123456789" className="text-gray-600 hover:text-indigo-600 transition-colors">
                +33 1 23 45 67 89
              </a>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Adresse</h3>
              <p className="text-gray-600">
                123 Avenue des Champs-Élysées<br />
                75008 Paris, France
              </p>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="px-6 py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-b-3xl">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Restez informé des dernières nouveautés
            </h3>
            <p className="text-indigo-100 mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos actualités et offres exclusives
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="px-4 py-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                <span>S'inscrire</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </form>
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