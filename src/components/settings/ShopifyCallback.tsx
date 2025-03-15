import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import crypto from 'crypto';

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

  const verifyHmac = (queryParams: URLSearchParams, hmac: string): boolean => {
    // Remove hmac from params and sort remaining params
    const params = Array.from(queryParams.entries())
      .filter(([key]) => key !== 'hmac')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Calculate HMAC
    const calculatedHmac = crypto
      .createHmac('sha256', SHOPIFY_CLIENT_SECRET)
      .update(params)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(calculatedHmac)
    );
  };

  const validateShopDomain = (shop: string): boolean => {
    const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
    return shopRegex.test(shop);
  };

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const shop = searchParams.get('shop');
      const hmac = searchParams.get('hmac');

      if (!code || !shop || !hmac || !user) {
        toast.error('Paramètres d\'authentification manquants');
        navigate('/settings');
        return;
      }

      // Validate shop domain
      if (!validateShopDomain(shop)) {
        toast.error('Domaine de boutique invalide');
        navigate('/settings');
        return;
      }

      // Verify HMAC
      if (!verifyHmac(searchParams, hmac)) {
        toast.error('Signature HMAC invalide');
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
        const userRef = doc(db, 'users', user.uid);
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