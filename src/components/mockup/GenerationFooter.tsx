import React from 'react';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '../../types/user';

interface GenerationFooterProps {
  userProfile: UserProfile | null;
  selectedMockups: string[];
  isGenerating: boolean;
  onGenerate: () => void;
  designFile?: File;
}

export default function GenerationFooter({
  userProfile,
  selectedMockups,
  isGenerating,
  onGenerate,
  designFile
}: GenerationFooterProps) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 w-full sm:w-auto">
          <div>
            <p className="text-gray-600">Crédits disponibles</p>
            <p className="text-2xl font-bold text-indigo-600">
              {userProfile?.subscription.credits || 0}
            </p>
          </div>
          {selectedMockups.length > 0 && (
            <div className="bg-gray-50 px-4 py-2 rounded-xl">
              <p className="text-gray-600">Coût de la génération</p>
              <p className="text-xl font-semibold text-gray-900">
                {selectedMockups.length} crédit{selectedMockups.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-full sm:w-auto">
          <button
            onClick={onGenerate}
            disabled={
              isGenerating || 
              !designFile || 
              selectedMockups.length === 0 || 
              (userProfile?.subscription.credits || 0) < selectedMockups.length
            }
            className="w-full sm:w-auto gradient-bg text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Génération en cours...
              </span>
            ) : (
              <span className="flex flex-col items-center">
                <span className="text-lg font-medium">
                  Générer {selectedMockups.length > 0 ? `${selectedMockups.length} mockup${selectedMockups.length > 1 ? 's' : ''}` : ''}
                </span>
                <span className="text-xs text-white/80 mt-1">
                  La génération prendra quelques secondes
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}