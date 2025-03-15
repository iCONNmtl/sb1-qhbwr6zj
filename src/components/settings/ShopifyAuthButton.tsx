import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShopifyAuthButtonProps {
  userId: string;
  onSuccess: () => void;
}

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

    // Remove .myshopify.com if user added it
    const shop = shopUrl.replace('.myshopify.com', '');

    setLoading(true);
    try {
      // Redirect to Shopify OAuth
      const authUrl = `/shopify-oauth/init?shop=${shop}.myshopify.com&state=${userId}`;
      console.log('Redirecting to:', authUrl);
      window.location.href = authUrl;
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