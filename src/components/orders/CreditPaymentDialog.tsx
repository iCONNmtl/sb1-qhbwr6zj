import React from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface CreditPaymentDialogProps {
  orderId: string;
  userId: string;
  purchasePrice: number;
  availableCredits: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CREDIT_VALUE = 0.025; // 1 crédit = 0.025$

export default function CreditPaymentDialog({
  orderId,
  userId,
  purchasePrice,
  availableCredits,
  onClose,
  onSuccess
}: CreditPaymentDialogProps) {
  const [loading, setLoading] = React.useState(false);
  
  // Calculate required credits
  const requiredCredits = Math.ceil(purchasePrice / CREDIT_VALUE);

  const handleConfirm = async () => {
    if (availableCredits < requiredCredits) {
      toast.error('Crédits insuffisants');
      return;
    }

    setLoading(true);
    try {
      // Use a transaction to ensure both operations succeed or fail together
      await runTransaction(db, async (transaction) => {
        // Get fresh user data
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        const userData = userDoc.data();
        const currentCredits = userData.subscription.credits;

        if (currentCredits < requiredCredits) {
          throw new Error('Insufficient credits');
        }

        // Update order status
        const orderRef = doc(db, 'orders', orderId);
        transaction.update(orderRef, {
          status: 'paid',
          isPaid: true,
          paidAt: new Date().toISOString(),
          paidWithCredits: true,
          creditsUsed: requiredCredits
        });

        // Update user credits
        transaction.update(userRef, {
          'subscription.credits': currentCredits - requiredCredits
        });
      });

      toast.success('Commande payée avec succès');
      onSuccess();
    } catch (error: any) {
      console.error('Error processing credit payment:', error);
      if (error.message === 'Insufficient credits') {
        toast.error('Crédits insuffisants. Veuillez recharger votre compte.');
      } else {
        toast.error('Erreur lors du paiement');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Payer avec des crédits
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-900">Crédits nécessaires:</span>
              <span className="font-semibold text-indigo-900">{requiredCredits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-indigo-900">Crédits disponibles:</span>
              <span className="font-semibold text-indigo-900">{availableCredits}</span>
            </div>
            {availableCredits < requiredCredits && (
              <div className="mt-4 text-center">
                <p className="text-sm text-red-600 mb-3">
                  Crédits insuffisants. Il vous manque {requiredCredits - availableCredits} crédits.
                </p>
                <Link 
                  to="/pricing"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Recharger mes crédits
                </Link>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>En confirmant le paiement :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>{requiredCredits} crédits seront déduits de votre compte</li>
              <li>La commande passera au statut "payée"</li>
              <li>Cette action est irréversible</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading || availableCredits < requiredCredits}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payer avec {requiredCredits} crédits
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}