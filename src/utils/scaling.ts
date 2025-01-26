// Constantes pour les dimensions
export const PREVIEW_DIMENSIONS = {
  width: 1000,  // Largeur de base de la prévisualisation
  height: 1000  // Hauteur de base de la prévisualisation
};

export const GRID_DIMENSIONS = {
  instagram: {
    width: 800,
    height: 1000,
    aspectRatio: 4/5
  },
  pinterest: {
    width: 667,
    height: 1000,
    aspectRatio: 2/3
  }
};

// Calcule le multiplicateur de scaling basé sur la taille actuelle de prévisualisation
export function calculateScalingMultiplier(previewWidth: number): number {
  // Le multiplicateur est le ratio entre la largeur de base et la largeur actuelle
  return PREVIEW_DIMENSIONS.width / previewWidth;
}

// Calcule les limites de déplacement de la grille
export function calculateGridBoundaries(format: 'instagram' | 'pinterest') {
  const gridWidth = GRID_DIMENSIONS[format].width;
  const previewWidth = PREVIEW_DIMENSIONS.width;
  
  return {
    minX: 0,
    maxX: previewWidth - gridWidth,
    minY: 0,
    maxY: 0 // La grille ne se déplace pas verticalement
  };
}

// Calcule la position de l'image par rapport à la grille
export function calculateImagePosition(
  gridPosition: { x: number }, 
  format: 'instagram' | 'pinterest',
  previewWidth: number
) {
  const gridWidth = GRID_DIMENSIONS[format].width;
  const maxGridOffset = previewWidth - gridWidth;
  const maxImageOffset = previewWidth - gridWidth;
  const gridPercent = gridPosition.x / maxGridOffset;
  
  // Utiliser le multiplicateur de scaling pour ajuster le déplacement
  const scalingMultiplier = calculateScalingMultiplier(previewWidth);
  const x = -maxImageOffset * gridPercent * scalingMultiplier;
  
  return {
    x,
    y: 0
  };
}