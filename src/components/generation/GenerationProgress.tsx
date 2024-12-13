import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGenerationProgress } from '../../hooks/useGenerationProgress';
import GenerationStep from './GenerationStep';
import ProgressBar from './ProgressBar';

interface GenerationProgressProps {
  totalMockups: number;
}

export default function GenerationProgress({ totalMockups }: GenerationProgressProps) {
  const { progress, currentStep, stepProgress } = useGenerationProgress(totalMockups);

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin">
                <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
              </div>
              <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-indigo-600 animate-spin" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Génération en cours...
              </h2>
              <p className="text-gray-600">
                {totalMockups} mockup{totalMockups > 1 ? 's' : ''} en cours de création
              </p>
            </div>

            <ProgressBar progress={progress} />

            <div className="space-y-4">
              <GenerationStep
                step="preparation"
                label="Préparation du design"
                isActive={currentStep === 'preparation'}
                isComplete={currentStep !== 'preparation'}
                progress={currentStep === 'preparation' ? stepProgress : undefined}
              />
              <GenerationStep
                step="optimization"
                label="Optimisation de l'image"
                isActive={currentStep === 'optimization'}
                isComplete={currentStep !== 'preparation' && currentStep !== 'optimization'}
                progress={currentStep === 'optimization' ? stepProgress : undefined}
              />
              <GenerationStep
                step="generation"
                label="Génération des mockups"
                isActive={currentStep === 'generation'}
                isComplete={currentStep !== 'preparation' && currentStep !== 'optimization' && currentStep !== 'generation'}
                progress={currentStep === 'generation' ? stepProgress : undefined}
              />
              <GenerationStep
                step="finalization"
                label="Finalisation"
                isActive={currentStep === 'finalization'}
                isComplete={currentStep === 'complete'}
                progress={currentStep === 'finalization' ? stepProgress : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}