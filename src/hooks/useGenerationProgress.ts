import { useState, useEffect, useCallback } from 'react';

type GenerationStep = 'preparation' | 'optimization' | 'generation' | 'finalization' | 'complete';

// Durées en millisecondes
const STEP_DURATIONS = {
  preparation: 2000,     // 2 secondes
  optimization: 3000,    // 3 secondes
  generation: 20000,     // 20 secondes par mockup
  finalization: 2000     // 2 secondes
};

export function useGenerationProgress(totalMockups: number) {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('preparation');
  const [stepProgress, setStepProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  const getTotalDuration = useCallback(() => {
    return STEP_DURATIONS.preparation + 
           STEP_DURATIONS.optimization + 
           (STEP_DURATIONS.generation * totalMockups) + 
           STEP_DURATIONS.finalization;
  }, [totalMockups]);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = getTotalDuration();
    let animationFrame: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      
      // Calcul de la progression totale
      const currentTotalProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setTotalProgress(currentTotalProgress);

      // Détermination de l'étape actuelle et calcul de sa progression
      if (elapsed < STEP_DURATIONS.preparation) {
        setCurrentStep('preparation');
        setStepProgress((elapsed / STEP_DURATIONS.preparation) * 100);
      } 
      else if (elapsed < STEP_DURATIONS.preparation + STEP_DURATIONS.optimization) {
        setCurrentStep('optimization');
        const stepElapsed = elapsed - STEP_DURATIONS.preparation;
        setStepProgress((stepElapsed / STEP_DURATIONS.optimization) * 100);
      }
      else if (elapsed < STEP_DURATIONS.preparation + STEP_DURATIONS.optimization + (STEP_DURATIONS.generation * totalMockups)) {
        setCurrentStep('generation');
        const stepElapsed = elapsed - (STEP_DURATIONS.preparation + STEP_DURATIONS.optimization);
        setStepProgress((stepElapsed / (STEP_DURATIONS.generation * totalMockups)) * 100);
      }
      else if (elapsed < totalDuration) {
        setCurrentStep('finalization');
        const stepElapsed = elapsed - (STEP_DURATIONS.preparation + STEP_DURATIONS.optimization + (STEP_DURATIONS.generation * totalMockups));
        setStepProgress((stepElapsed / STEP_DURATIONS.finalization) * 100);
      }
      else {
        setCurrentStep('complete');
        setStepProgress(100);
        setTotalProgress(100);
        return;
      }

      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [totalMockups, getTotalDuration]);

  return {
    currentStep,
    stepProgress: Math.min(Math.round(stepProgress), 100),
    progress: Math.min(Math.round(totalProgress), 100)
  };
}