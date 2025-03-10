import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface ShopifyCallbackProps {
  userId: string;
  onSuccess: () => void;
}

const SHOPIFY_CLIENT_ID = "122db044cf9755d37812d2fdce612493";
const SHOPIFY_CLIENT_SECRET = "c322df317ca9f7b525763a743bd9ea6b";

export default function ShopifyCallback({ userId, onSuccess }: ShopifyCallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      // Get URL params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const shop = localStorage.getItem('shopify_shop');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('shopify_state');

      // Validate state and params
      if (!code || !shop || !state || state !== storedState) {
        toast.error('Erreur de validation Shopify');
        navigate('/settings');
        return;
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: SHOPIFY_CLIENT_ID,
            client_secret: SHOPIFY_CLIENT_SECRET,
            code
          })
        });

        if (!tokenResponse.ok) {
          throw new Error('Erreur lors de l\'échange du code');
        }

        const { access_token } = await tokenResponse.json();

        // Store encrypted token in Firestore
        const encryptedToken = btoa(JSON.stringify({
          access_token,
          shop,
          created_at: new Date().toISOString()
        }));

        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          'shopifyAuth.tokens': encryptedToken,
          'shopifyAuth.connectedAt': new Date().toISOString(),
          'shopifyAuth.shop': shop
        });

        // Cleanup
        localStorage.removeItem('shopify_state');
        localStorage.removeItem('shopify_shop');

        toast.success('Boutique Shopify connectée avec succès');
        onSuccess();
      } catch (error) {
        console.error('Shopify token exchange error:', error);
        toast.error('Erreur lors de la connexion de la boutique');
        navigate('/settings');
      }
    };

    processAuth();
  }, [userId, navigate, onSuccess]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <span className="ml-2">Connexion de la boutique Shopify...</span>
    </div>
  );
}