import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface ResetPasswordErrorProps {
  error?: string;
}

export default function ResetPasswordError({ error }: ResetPasswordErrorProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lien invalide ou expiré
          </h2>
          <p className="text-gray-600 mb-8">
            {error || 'Le lien de réinitialisation du mot de passe est invalide ou a expiré. Veuillez demander un nouveau lien.'}
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}