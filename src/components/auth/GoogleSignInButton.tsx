import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface GoogleSignInButtonProps {
  className?: string;
}

export default function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error('Erreur lors de la connexion avec Google');
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      <span>Continuer avec Google</span>
    </button>
  );
}