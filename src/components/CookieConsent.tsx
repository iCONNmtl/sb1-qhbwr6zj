import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Cookie className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium mb-1">
                Nous utilisons des cookies 🍪
              </p>
              <p className="text-sm text-gray-600">
                Nous utilisons des cookies pour améliorer votre expérience et nos services. En continuant votre navigation, vous acceptez l'utilisation de ces cookies. Pour en savoir plus, consultez notre{' '}
                <Link to="/legal/confidentialite" className="text-indigo-600 hover:text-indigo-500">
                  politique de confidentialité
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}