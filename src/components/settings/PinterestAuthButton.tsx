import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface ShopifyAuthButtonProps {
  userId: string;
  onSuccess: () => void;
}

const SHOPIFY_CLIENT_ID = '122db044cf9755d37812d2fdce612493';
const REDIRECT_URI = `${window.location.origin}/settings`;
const SCOPES = [
  'read_products',
  'write_products',
  'read_orders',
  'write_orders'
].join(' ');

export default function ShopifyAuthButton({ userId, onSuccess }: ShopifyAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      // Generate a random state for security
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('shopify_state', state);

      // Build the authorization URL
      const shopifyUrl = new URL('https://accounts.shopify.com/oauth/authorize');
      shopifyUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID);
      shopifyUrl.searchParams.append('redirect_uri', REDIRECT_URI);
      shopifyUrl.searchParams.append('scope', SCOPES);
      shopifyUrl.searchParams.append('state', state);
      shopifyUrl.searchParams.append('grant_options[]', 'per-user');

      // Redirect to Shopify
      window.location.href = shopifyUrl.toString();
    } catch (error) {
      console.error('Shopify auth error:', error);
      toast.error('Erreur lors de la connexion à Shopify');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-[#96BF47] text-white rounded-lg hover:bg-[#7EA83E] transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Connexion...
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5 mr-2" />
          Se connecter avec Shopify
        </>
      )}
    </button>
  );
}