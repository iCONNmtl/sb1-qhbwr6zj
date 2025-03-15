import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const SHOPIFY_CLIENT_ID = 'e2b20adf1c1b49a62ec2d42c0c119355';
const SHOPIFY_CLIENT_SECRET = 'c31a40911d06210a0fd1ff8ca4aa9715';

export default function ShopifyCallback({ userId, onSuccess }) {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    console.log("🔍 ShopifyCallback lancé !");
    console.log("📌 Paramètres URL:", Object.fromEntries(searchParams.entries()));
    console.log("👤 Utilisateur actuel:", user);
    
    const processAuth = async () => {
      const code = searchParams.get('code');
      const shop = searchParams.get('shop');
      const hmac = searchParams.get('hmac');

      if (!code || !shop || !hmac) {
        console.error("❌ Paramètres Shopify manquants:", { code, shop, hmac });
        toast.error('Paramètres d\'authentification manquants');
        navigate('/settings');
        return;
      }

      if (!user || !user.uid) {
        console.error("❌ Utilisateur introuvable ou non connecté !", user);
        toast.error("Erreur : utilisateur non authentifié");
        navigate('/login');
        return;
      }

      setProcessing(true);
      console.log("✅ Début de l'échange de token avec Shopify...");

      try {
        const response = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
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

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('❌ Erreur Shopify:', response.status, errorMessage);
          throw new Error(`Erreur Shopify: ${response.status} - ${errorMessage}`);
        }

        const { access_token, scope } = await response.json();
        console.log("✅ Token reçu:", { access_token, scope });

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

        console.log("✅ Shopify connecté avec succès pour l'utilisateur", user.uid);
        toast.success('Compte Shopify connecté avec succès');
        onSuccess();
      } catch (error) {
        console.error('❌ Erreur lors de l\'échange de token Shopify:', error);
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
