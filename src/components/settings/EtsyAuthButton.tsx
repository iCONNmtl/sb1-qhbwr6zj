import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface EtsyAuthButtonProps {
  userId: string;
  onSuccess: () => void;
}

const ETSY_CLIENT_ID = 'mn2036h43ps6hwiyrrg375fo';
const REDIRECT_URI = `https://pixmock.com/settings`;
const SCOPES = [
  'listings_r',
  'listings_w',
  'transactions_r',
  'transactions_w'
].join(' ');

export default function EtsyAuthButton({ userId, onSuccess }: EtsyAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      // Generate a random state for security
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('etsy_state', state);

      // Build the authorization URL
      const etsyUrl = new URL('https://www.etsy.com/oauth/connect');
      etsyUrl.searchParams.append('client_id', ETSY_CLIENT_ID);
      etsyUrl.searchParams.append('redirect_uri', REDIRECT_URI);
      etsyUrl.searchParams.append('scope', SCOPES);
      etsyUrl.searchParams.append('state', state);
      etsyUrl.searchParams.append('response_type', 'code');

      // Redirect to Etsy
      window.location.href = etsyUrl.toString();
    } catch (error) {
      console.error('Etsy auth error:', error);
      toast.error('Erreur lors de la connexion à Etsy');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-[#F56400] text-white rounded-lg hover:bg-[#D55A00] transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Connexion...
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5 mr-2" />
          Se connecter avec Etsy
        </>
      )}
    </button>
  );
}