export interface ScalingConfig {
    previewWidth: number;
    previewHeight: number;
    exportWidth: number;
    exportHeight: number;
  }
  
  // Convertit une position en pourcentages
  export function positionToPercentage(position: { x: number; y: number }, containerSize: { width: number; height: number }) {
    return {
      x: (position.x / containerSize.width) * 100,
      y: (position.y / containerSize.height) * 100
    };
  }
  
  // Convertit un pourcentage en position absolue
  export function percentageToPosition(percentage: { x: number; y: number }, containerSize: { width: number; height: number }) {
    return {
      x: Math.round((percentage.x * containerSize.width) / 100),
      y: Math.round((percentage.y * containerSize.height) / 100)
    };
  }
  
  // Calcule la taille de police relative en fonction de la largeur du conteneur
  export function calculateRelativeFontSize(fontSize: number, containerWidth: number) {
    return (fontSize / containerWidth) * 100;
  }
  
  // Convertit une taille de police relative en pixels
  export function relativeFontSizeToPixels(relativeFontSize: number, containerWidth: number) {
    return Math.round((relativeFontSize * containerWidth) / 100);
  }