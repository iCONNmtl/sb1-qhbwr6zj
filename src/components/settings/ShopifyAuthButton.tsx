import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShopifyAuthButtonProps {
  userId: string;
  onSuccess: () => void;
}

const SHOPIFY_CLIENT_ID = 'e2b20adf1c1b49a62ec2d42c0c119355';
const SCOPES = [
  'read_customers',
  'write_customers',
  'read_orders',
  'write_orders',
  'write_products',
  'read_products'
].join(',');

export default function ShopifyAuthButton({ userId, onSuccess }: ShopifyAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [shopUrl, setShopUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAuth = async () => {
    if (!showInput) {
      setShowInput(true);
      return;
    }

    if (!shopUrl) {
      toast.error('Veuillez entrer l\'URL de votre boutique');
      return;
    }

    setLoading(true);
    try {
      // Remove .myshopify.com if user added it
      const shop = shopUrl.replace('.myshopify.com', '');
      
      // Build the authorization URL
      const redirectUri = `${window.location.origin}/settings`;
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('shopify_state', state);
      
      const authUrl = new URL(`https://${shop}.myshopify.com/admin/oauth/authorize`);
      authUrl.searchParams.append('client_id', SHOPIFY_CLIENT_ID);
      authUrl.searchParams.append('scope', SCOPES);
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('state', state);

      // Redirect to Shopify
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Shopify auth error:', error);
      toast.error('Erreur lors de la connexion à Shopify');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showInput && (
        <div className="relative">
          <input
            type="text"
            value={shopUrl}
            onChange={(e) => setShopUrl(e.target.value)}
            placeholder="votre-boutique"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#96BF47] focus:border-[#96BF47] pr-[120px]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            .myshopify.com
          </span>
        </div>
      )}
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
            {showInput ? 'Continuer' : 'Se connecter avec Shopify'}
          </>
        )}
      </button>
    </div>
  );
}