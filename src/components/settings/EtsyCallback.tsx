import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface EtsyCallbackProps {
  userId: string;
  onSuccess: () => void;
}

const ETSY_CLIENT_ID = 'mn2036h43ps6hwiyrrg375fo';
const ETSY_CLIENT_SECRET = 'ys7thqzuib';
const REDIRECT_URI = `https://pixmock.com/settings`;

export default function EtsyCallback({ userId, onSuccess }: EtsyCallbackProps) {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('etsy_state');

      if (!code || !state || state !== storedState) {
        toast.error('Erreur de validation Etsy');
        navigate('/settings');
        return;
      }

      setProcessing(true);
      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: ETSY_CLIENT_ID,
            client_secret: ETSY_CLIENT_SECRET,
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
          'etsyAuth.tokens': encryptedTokens,
          'etsyAuth.connectedAt': new Date().toISOString()
        });

        localStorage.removeItem('etsy_state');
        toast.success('Compte Etsy connecté avec succès');
        onSuccess();
      } catch (error) {
        console.error('Etsy token exchange error:', error);
        toast.error('Erreur lors de la connexion du compte Etsy');
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
        <span className="ml-2">Connexion du compte Etsy...</span>
      </div>
    );
  }

  return null;
}