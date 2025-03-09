import React from 'react';
import { X, CreditCard, Loader2, DollarSign, TrendingUp, Truck, Receipt } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Receipt className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Paiement commande
                </h3>
                <p className="text-sm text-gray-500">
                  #{orderId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Financial Details */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Prix d'achat</div>
                <div className="text-xl font-semibold text-gray-900">
                  {purchasePrice.toFixed(2)}€
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Prix de vente</div>
                <div className="text-xl font-semibold text-green-600">
                  {(purchasePrice * 2).toFixed(2)}€
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Bénéfice estimé</div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">+{purchasePrice.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credits Info */}
          <div className="bg-indigo-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-medium text-gray-900">Paiement en crédits</span>
              </div>
              <div className="text-sm text-indigo-600 font-medium">
                1 crédit = {CREDIT_VALUE.toFixed(3)}€
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crédits nécessaires:</span>
                <span className="font-semibold text-gray-900">{requiredCredits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crédits disponibles:</span>
                <span className="font-semibold text-gray-900">{availableCredits}</span>
              </div>
            </div>
          </div>

          {/* Shipping Promise */}
          <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
            <Truck className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <span className="font-medium">Expédition rapide garantie</span>
              <p className="mt-1">Votre commande sera traitée et expédiée dans les prochaines 24h</p>
            </div>
          </div>

          {availableCredits < requiredCredits && (
            <div className="text-center">
              <p className="text-sm text-red-600 mb-3">
                Crédits insuffisants. Il vous manque {requiredCredits - availableCredits} crédits.
              </p>
              <Link 
                to="/pricing"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Recharger mes crédits
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleConfirm}
              disabled={loading || availableCredits < requiredCredits}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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