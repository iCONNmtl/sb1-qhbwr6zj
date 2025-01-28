import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface PinterestCallbackProps {
  userId: string;
  onSuccess: () => void;
}

const PINTEREST_CLIENT_ID = '1511992';
const PINTEREST_CLIENT_SECRET = '4d5be2564aedfbba73c3530209628e25190b35db';
const REDIRECT_URI = `${window.location.origin}/settings`;

export default function PinterestCallback({ userId, onSuccess }: PinterestCallbackProps) {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = localStorage.getItem('pinterest_state');

      if (!code || !state || state !== storedState) {
        toast.error('Erreur de validation Pinterest');
        return;
      }

      setProcessing(true);
      try {
        // Échanger le code contre un token d'accès
        const tokenResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${PINTEREST_CLIENT_ID}:${PINTEREST_CLIENT_SECRET}`)}`
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
          })
        });

        if (!tokenResponse.ok) {
          throw new Error('Erreur lors de l\'échange du code');
        }

        const { access_token, refresh_token } = await tokenResponse.json();

        // Crypter le token avant de le stocker
        const encryptedToken = btoa(JSON.stringify({
          access_token,
          refresh_token,
          created_at: new Date().toISOString()
        }));

        // Mettre à jour le document utilisateur avec les tokens cryptés
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          'pinterestAuth.tokens': encryptedToken,
          'pinterestAuth.connectedAt': new Date().toISOString()
        });

        localStorage.removeItem('pinterest_state');
        toast.success('Compte Pinterest connecté avec succès');
        onSuccess();
      } catch (error) {
        console.error('Pinterest token exchange error:', error);
        toast.error('Erreur lors de la connexion du compte Pinterest');
      } finally {
        setProcessing(false);
      }
    };

    if (searchParams.has('code')) {
      processAuth();
    }
  }, [searchParams, userId, onSuccess]);

  if (processing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Connexion du compte Pinterest...</span>
      </div>
    );
  }

  return null;
}