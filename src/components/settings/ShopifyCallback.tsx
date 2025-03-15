import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface ShopifyCallbackProps {
  userId: string;
  onSuccess: () => void;
}

const SHOPIFY_CLIENT_ID = 'e2b20adf1c1b49a62ec2d42c0c119355';
const SHOPIFY_CLIENT_SECRET = 'c31a40911d06210a0fd1ff8ca4aa9715';

export default function ShopifyCallback({ userId, onSuccess }: ShopifyCallbackProps) {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const shop = searchParams.get('shop');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('shopify_state');

      if (!code || !shop || !state || state !== storedState) {
        toast.error('Paramètres d\'authentification invalides');
        navigate('/settings');
        return;
      }

      // Validate shop domain
      const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
      if (!shopRegex.test(shop)) {
        toast.error('Domaine de boutique invalide');
        navigate('/settings');
        return;
      }

      setProcessing(true);
      try {
        // Exchange code for access token
        const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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

        const { access_token, scope } = await tokenResponse.json();

        // Store encrypted token in Firebase
        const userRef = doc(db, 'users', user?.uid || userId);
        const encryptedTokens = btoa(JSON.stringify({
          access_token,
          scope,
          shop,
          created_at: new Date().toISOString()
        }));

        await updateDoc(userRef, {
          'shopifyAuth.tokens': encryptedTokens,
          'shopifyAuth.connectedAt': new Date().toISOString(),
          'shopifyAuth.shop': shop
        });

        localStorage.removeItem('shopify_state');
        toast.success('Compte Shopify connecté avec succès');
        onSuccess();
      } catch (error) {
        console.error('Shopify token exchange error:', error);
        toast.error('Erreur lors de la connexion du compte Shopify');
        navigate('/settings');
      } finally {
        setProcessing(false);
      }
    };

    if (searchParams.has('code')) {
      processAuth();
    }
  }, [searchParams, userId, onSuccess, navigate, user]);

  if (processing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Connexion du compte Shopify...</span>
      </div>
    );
  }

  return null;
}