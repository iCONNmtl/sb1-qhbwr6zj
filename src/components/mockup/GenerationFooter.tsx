import React from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import type { UserProfile } from '../../types/user';

interface GenerationFooterProps {
  userProfile: UserProfile | null;
  selectedMockups: string[];
  isGenerating: boolean;
  onGenerate: () => void;
  designFile?: File;
  isTextCustomizationEnabled?: boolean;
  customizedMockups?: number[];
}

export default function GenerationFooter({
  userProfile,
  selectedMockups,
  isGenerating,
  onGenerate,
  designFile,
  isTextCustomizationEnabled = false,
  customizedMockups = []
}: GenerationFooterProps) {
  // Calculer le coût total en crédits
  const baseCredits = selectedMockups.length * 5;
  const customizationCredits = isTextCustomizationEnabled ? customizedMockups.length * 5 : 0;
  const totalCredits = baseCredits + customizationCredits;

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 mt-8">
      <div className="flex items-center justify-between gap-8">
        {/* Crédits disponibles */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Crédits disponibles</p>
            <p className="text-xl font-bold text-indigo-600">
              {userProfile?.subscription.credits || 0}
            </p>
          </div>
        </div>

        {/* Coût et bouton de génération */}
        {selectedMockups.length > 0 && (
          <div className="flex items-center gap-8">
            {/* Récapitulatif */}
            <div className="text-sm text-gray-500">
              <div>1 mockup × 5 = {baseCredits} crédits</div>
              {isTextCustomizationEnabled && customizedMockups.length > 0 && (
                <div>2 personnalisations × 5 = {customizationCredits} crédits</div>
              )}
            </div>

            {/* Total et bouton */}
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-indigo-600">
                  {totalCredits} crédits
                </p>
              </div>

              <button
                onClick={onGenerate}
                disabled={
                  isGenerating || 
                  !designFile || 
                  selectedMockups.length === 0 || 
                  (userProfile?.subscription.credits || 0) < totalCredits
                }
                className="gradient-bg text-white px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Génération en cours...
                  </span>
                ) : (
                  <span className="flex flex-col items-center">
                    <span className="font-medium">
                      Générer {selectedMockups.length > 0 ? `${selectedMockups.length} mockup${selectedMockups.length > 1 ? 's' : ''}` : ''}
                    </span>
                    <span className="text-xs text-white/80">
                      La génération prendra quelques secondes
                    </span>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}