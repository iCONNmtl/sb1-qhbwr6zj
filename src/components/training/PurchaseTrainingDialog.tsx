import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, X, CreditCard, Loader2, Book, TrendingUp, Zap, Star } from 'lucide-react';
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Crown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Accès Premium
                </h3>
                <p className="text-sm text-gray-500">
                  Formation {title}
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
          {/* Training Benefits */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6">
            <h4 className="font-medium text-gray-900 mb-4">
              Ce que vous obtenez :
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Book className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-sm text-gray-600">
                  Accès illimité à la formation complète
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-sm text-gray-600">
                  Stratégies testées et approuvées
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Zap className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-sm text-gray-600">
                  Accès instantané au contenu
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Star className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-sm text-gray-600">
                  Support prioritaire inclus
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
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crédits nécessaires:</span>
                <span className="font-semibold text-gray-900">{credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crédits disponibles:</span>
                <span className="font-semibold text-gray-900">{availableCredits}</span>
              </div>
            </div>
          </div>

          {availableCredits < credits && (
            <div className="text-center">
              <p className="text-sm text-red-600 mb-3">
                Crédits insuffisants. Il vous manque {credits - availableCredits} crédits.
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

          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handlePurchase}
              disabled={loading || availableCredits < credits}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Débloquer avec {credits} crédits
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