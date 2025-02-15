import React from 'react';
import { Loader2, CreditCard, HelpCircle } from 'lucide-react';
import type { UserProfile } from '../../types/user';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';

interface GenerationFooterProps {
  userProfile: UserProfile | null;
  selectedMockups: string[];
  isGenerating: boolean;
  onGenerate: () => void;
  designFile?: File;
  designUrl?: string;
  isTextCustomizationEnabled?: boolean;
  customizedMockups?: number[];
}

export default function GenerationFooter({
  userProfile,
  selectedMockups,
  isGenerating,
  onGenerate,
  designFile,
  designUrl,
  isTextCustomizationEnabled = false,
  customizedMockups = []
}: GenerationFooterProps) {
  // Calculate total credits needed
  const baseCredits = selectedMockups.length * 5;
  const customizationCredits = isTextCustomizationEnabled ? customizedMockups.length * 5 : 0;
  const totalCredits = baseCredits + customizationCredits;

  const hasDesign = Boolean(designFile || designUrl);

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 mt-8">
      <div className="flex items-center justify-between gap-8">
        {/* Credits */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-xl font-bold text-indigo-600">
                {userProfile?.subscription.credits || 0}
              </div>
              <div className="text-sm text-gray-500">crédits disponibles</div>
            </div>
          </div>

          {selectedMockups.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-indigo-600">
                {totalCredits}
              </div>
              <div className="text-sm text-gray-500">coût total</div>
              <Popover>
                <PopoverTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Détails des crédits</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>• {selectedMockups.length} mockup{selectedMockups.length > 1 ? 's' : ''} × 5 = {baseCredits} crédits</p>
                      {isTextCustomizationEnabled && customizedMockups.length > 0 && (
                        <p>• {customizedMockups.length} personnalisation{customizedMockups.length > 1 ? 's' : ''} × 5 = {customizationCredits} crédits</p>
                      )}
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <p className="font-medium">Total : {totalCredits} crédits</p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Generation Button */}
        {selectedMockups.length > 0 && (
          <button
            onClick={onGenerate}
            disabled={
              isGenerating || 
              !hasDesign || 
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
        )}
      </div>
    </section>
  );
}