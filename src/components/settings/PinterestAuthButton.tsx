import React, { useState } from 'react';
import { BookmarkIcon, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface PinterestAuthButtonProps {
  userId: string;
  onSuccess: () => void;
}

const PINTEREST_CLIENT_ID = '1511992';
const REDIRECT_URI = `${window.location.origin}/settings`;
const SCOPE = 'pins:read,boards:read,user_accounts:read,ads:read,catalogs:read';

export default function PinterestAuthButton({ userId, onSuccess }: PinterestAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      // Générer un state aléatoire pour la sécurité
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('pinterest_state', state);

      // Construire l'URL d'autorisation Pinterest
      const authUrl = `https://www.pinterest.com/oauth/?client_id=${PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}&state=${state}`;

      // Rediriger vers Pinterest
      window.location.href = authUrl;
    } catch (error) {
      console.error('Pinterest auth error:', error);
      toast.error('Erreur lors de la connexion à Pinterest');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Connexion...
        </>
      ) : (
        <>
          <BookmarkIcon className="h-5 w-5 mr-2" />
          Se connecter avec Pinterest
        </>
      )}
    </button>
  );
}