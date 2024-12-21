import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Wand2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import Logo from '../components/common/Logo';

export default function ThankYou() {
  const { user } = useStore();
  const navigate = useNavigate();

  // Redirect to home if no user
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" className="inline-block" />
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Merci pour votre achat !
            </h1>
            <p className="text-gray-600">
              Vos crédits ont été ajoutés à votre compte et sont disponibles immédiatement.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Prochaines étapes
            </h2>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  Accédez au générateur pour créer vos premiers mockups
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  Sélectionnez les mockups qui vous intéressent
                </span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  Uploadez votre design et générez vos mockups en un clic
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/generator"
              className="w-full inline-flex items-center justify-center px-6 py-3 gradient-bg text-white rounded-xl hover:opacity-90 transition-all duration-200"
            >
              <Wand2 className="h-5 w-5 mr-2" />
              Commencer à générer
            </Link>
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Voir mon tableau de bord
            </Link>
          </div>
        </div>

        {/* Support */}
        <p className="text-sm text-gray-600">
          Une question ? Contactez notre support à{' '}
          <a href="mailto:contact@pixmock.com" className="text-indigo-600 hover:text-indigo-500">
            contact@pixmock.com
          </a>
        </p>
      </div>
    </div>
  );
}