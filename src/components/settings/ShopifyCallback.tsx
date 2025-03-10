import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface ShopifyCallbackProps {
  userId: string;
  onSuccess: () => void;
}

const SHOPIFY_CLIENT_ID = '122db044cf9755d37812d2fdce612493';
const SHOPIFY_CLIENT_SECRET = 'c322df317ca9f7b525763a743bd9ea6b';
const REDIRECT_URI = `https://pixmock.com/settings`;

export default function ShopifyCallback({ userId, onSuccess }: ShopifyCallbackProps) {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('shopify_state');

      if (!code || !state || state !== storedState) {
        toast.error('Erreur de validation Shopify');
        navigate('/settings');
        return;
      }

      setProcessing(true);
      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://accounts.shopify.com/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            client_id: SHOPIFY_CLIENT_ID,
            client_secret: SHOPIFY_CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI
          })
        });

        if (!tokenResponse.ok) {
          throw new Error('Erreur lors de l\'échange du code');
        }

        const { access_token, refresh_token } = await tokenResponse.json();

        // Encrypt tokens before storing
        const encryptedTokens = btoa(JSON.stringify({
          access_token,
          refresh_token,
          created_at: new Date().toISOString()
        }));

        // Update user document with encrypted tokens
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          'shopifyAuth.tokens': encryptedTokens,
          'shopifyAuth.connectedAt': new Date().toISOString()
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
  }, [searchParams, userId, onSuccess, navigate]);

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