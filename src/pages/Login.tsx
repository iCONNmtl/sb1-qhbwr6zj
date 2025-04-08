import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { Lock, Mail } from 'lucide-react';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  // Rediriger vers l'accueil si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast.success('Connexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de réinitialisation envoyé');
      setResetMode(false);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur est déjà connecté, ne pas afficher le formulaire
  if (user) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {resetMode ? 'Réinitialiser le mot de passe' : 'Connexion'}
          </h1>

          <form onSubmit={resetMode ? handlePasswordReset : handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            {!resetMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                resetMode ? 'Envoi...' : 'Connexion...'
              ) : (
                resetMode ? 'Envoyer le lien' : 'Se connecter'
              )}
            </button>
          </form>

          {!resetMode && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou</span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleSignInButton />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col space-y-4 text-center text-sm">
            <button
              onClick={() => setResetMode(!resetMode)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              {resetMode ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
            </button>
            
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}