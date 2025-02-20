import React, { useState } from 'react';
import { Crown, X, CreditCard, Loader2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { updateUserCredits } from '../../utils/subscription';
import toast from 'react-hot-toast';

interface PurchaseTrainingDialogProps {
  trainingId: string;
  title: string;
  credits: number;
  userId: string;
  availableCredits: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PurchaseTrainingDialog({
  trainingId,
  title,
  credits,
  userId,
  availableCredits,
  onClose,
  onSuccess
}: PurchaseTrainingDialogProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (availableCredits < credits) {
      toast.error('Crédits insuffisants');
      return;
    }

    setLoading(true);
    try {
      // Déduire les crédits
      await updateUserCredits(userId, credits);

      // Ajouter la formation aux formations achetées
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        purchasedTrainings: arrayUnion(trainingId)
      });

      toast.success('Formation achetée avec succès');
      onSuccess();
    } catch (error) {
      console.error('Error purchasing training:', error);
      toast.error('Erreur lors de l\'achat de la formation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Acheter la formation
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-xl p-4">
            <div className="text-center">
              <h4 className="font-medium text-indigo-900 mb-1">
                {title}
              </h4>
              <div className="flex items-center justify-center space-x-1.5 mb-2">
                <span className="text-2xl font-bold text-indigo-600">
                  {credits}
                </span>
                <span className="text-sm text-indigo-600/70">crédits</span>
              </div>
              <div className="text-sm text-indigo-900">
                Crédits disponibles : {availableCredits}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>En achetant cette formation :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>{credits} crédits seront déduits de votre compte</li>
              <li>Vous aurez un accès illimité à la formation</li>
              <li>Vous pourrez suivre la formation à votre rythme</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handlePurchase}
              disabled={loading || availableCredits < credits}
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
                  Acheter avec {credits} crédits
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