import type { Size } from '../types/product';

// Marge d'erreur acceptable pour le ratio (10% pour plus de flexibilité)
export const RATIO_TOLERANCE = 0.1;

interface CompatibilityResult {
  isCompatible: boolean;
  reason?: string;
  status: 'perfect' | 'good' | 'warning' | 'incompatible';
}

export function checkDesignCompatibility(
  designWidth: number,
  designHeight: number,
  size: Size
): CompatibilityResult {
  const designRatio = designWidth / designHeight;
  const recommendedRatio = size.recommendedSize.width / size.recommendedSize.height;
  const ratioDifference = Math.abs(1 - (designRatio / recommendedRatio));

  // Si le ratio est parfait (différence < 1%)
  if (ratioDifference < 0.01) {
    // Vérifier la résolution
    if (designWidth >= size.recommendedSize.width && designHeight >= size.recommendedSize.height) {
      return {
        isCompatible: true,
        status: 'perfect'
      };
    } else {
      return {
        isCompatible: true,
        status: 'warning',
        reason: `Résolution recommandée: ${size.recommendedSize.width}x${size.recommendedSize.height}px`
      };
    }
  }

  // Si le ratio est dans la tolérance (différence ≤ 10%)
  if (ratioDifference <= RATIO_TOLERANCE) {
    if (designWidth >= size.recommendedSize.width && designHeight >= size.recommendedSize.height) {
      return {
        isCompatible: true,
        status: 'good'
      };
    } else {
      return {
        isCompatible: true,
        status: 'warning',
        reason: `Résolution recommandée: ${size.recommendedSize.width}x${size.recommendedSize.height}px`
      };
    }
  }

  // Si le ratio est trop différent
  return {
    isCompatible: false,
    status: 'incompatible',
    reason: `Format incorrect. Le design devrait être au format ${size.dimensions.inches} (${size.dimensions.cm})`
  };
}

export function getCompatibilityColor(status: CompatibilityResult['status']): string {
  switch (status) {
    case 'perfect':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'incompatible':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getCompatibilityIcon(status: CompatibilityResult['status']): string {
  switch (status) {
    case 'perfect':
      return '✓✓';
    case 'good':
      return '✓';
    case 'warning':
      return '⚠️';
    case 'incompatible':
      return '✕';
    default:
      return '?';
  }
}