import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShopifyAuthButtonProps {
  userId: string;
  onSuccess: () => void;
}

const SHOPIFY_CLIENT_ID = "122db044cf9755d37812d2fdce612493";
const REDIRECT_URI = `${window.location.origin}/settings`;

export default function ShopifyAuthButton({ userId, onSuccess }: ShopifyAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [shopDomain, setShopDomain] = useState('');
  const [showDomainInput, setShowDomainInput] = useState(false);

  const handleAuth = () => {
    if (!shopDomain) {
      setShowDomainInput(true);
      return;
    }

    setLoading(true);
    try {
      // Validate shop domain
      const domain = shopDomain.includes('.myshopify.com') 
        ? shopDomain 
        : `${shopDomain}.myshopify.com`;

      // Store state for security
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('shopify_state', state);
      localStorage.setItem('shopify_shop', domain);

      // Build auth URL
      const authUrl = `https://${domain}/admin/oauth/authorize?` + new URLSearchParams({
        client_id: SHOPIFY_CLIENT_ID,
        scope: 'read_products,write_products',
        redirect_uri: REDIRECT_URI,
        state: state
      });

      // Redirect to Shopify
      window.location.href = authUrl;
    } catch (error) {
      console.error('Shopify auth error:', error);
      toast.error('Erreur lors de la connexion à Shopify');
      setLoading(false);
    }
  };

  if (showDomainInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={shopDomain}
          onChange={(e) => setShopDomain(e.target.value)}
          placeholder="votre-shop"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={handleAuth}
          disabled={loading || !shopDomain}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Connexion...
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Connecter
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={loading}
      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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