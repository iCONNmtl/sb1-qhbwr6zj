import React from 'react';
import { Crown } from 'lucide-react';

interface UpgradeDialogProps {
  userId: string;
  onClose: () => void;
  isOpen: boolean;
  planId: string;
}

export default function UpgradeDialog({ userId, onClose, isOpen, planId }: UpgradeDialogProps) {
  if (!isOpen) return null;

  const getStripeUrl = () => {
    const baseUrl = planId === 'pro' 
      ? 'https://buy.stripe.com/test_14k7vfbb25j8c929AA'
      : 'https://buy.stripe.com/test_8wMcPz1Ash1Qa0UfYZ';
    return `${baseUrl}?client_reference_id=${userId}`;
  };

  const handleUpgrade = () => {
    // Open payment link in new tab
    window.open(getStripeUrl(), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Passer au plan {planId === 'pro' ? 'Pro' : 'Enterprise'}
          </h3>
          <p className="text-gray-600">
            {planId === 'pro' 
              ? 'Profitez de 100 crédits par mois pour seulement 29€'
              : 'Profitez de 500 crédits par mois pour seulement 99€'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleUpgrade}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Confirmer
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}