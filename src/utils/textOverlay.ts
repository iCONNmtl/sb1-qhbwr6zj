import type { TextStyle } from '../types/mockup';
import type { PreviewFormat } from '../components/mockup/PreviewFormatSelector';

interface TextOverlayConfig {
  text: string;
  style: TextStyle;
  position: { x: number; y: number };
}

// Configuration de base pour le conteneur
const BASE_CONTAINER = {
  width: 1000,
  height: 1000
};

// Dimensions fixes pour les formats sociaux
const FORMAT_DIMENSIONS = {
  instagram: {
    width: 800,
    height: 1000
  },
  pinterest: {
    width: 667,
    height: 1000
  }
};

export function generateTextOverlayHtml(config: TextOverlayConfig): string {
  const { text, style, position } = config;
  const fontSize = parseInt(style.fontSize) || 24;

  return `<div style="
    position: absolute;
    left: ${position.x}px;
    top: ${position.y}px;
    font-family: '${style.fontFamily}', sans-serif;
    font-size: ${fontSize}px;
    font-weight: ${style.fontWeight};
    font-style: ${style.fontStyle};
    color: ${style.color};
    background-color: ${style.backgroundColor || 'transparent'};
    border-radius: ${style.borderRadius || '0px'};
    padding: ${style.padding || '0'};
    text-align: ${style.textAlign};
    z-index: 1;
  ">${text}</div>`;
}

export function combineTextLayers(textLayers: string[], format: PreviewFormat = 'original'): string {
  // Dimensions selon le format
  const dimensions = format === 'original' ? BASE_CONTAINER : FORMAT_DIMENSIONS[format as keyof typeof FORMAT_DIMENSIONS];
  
  // Calculer le décalage pour centrer l'image
  const offset = format === 'original' ? 0 : -((BASE_CONTAINER.width - dimensions.width) / 2);
  
  // Conteneur principal avec attribut data-platform
  const containerHtml = `<div data-platform="${format}" style="
    position: relative;
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    overflow: hidden;
  ">`;

  // Conteneur de l'image avec décalage
  const imageContainerHtml = `<div class="mockup" style="
    position: absolute;
    left: ${offset}px;
    top: 0px;
    width: ${BASE_CONTAINER.width}px;
    height: ${BASE_CONTAINER.height}px;
  ">`;

  // Assembler tous les éléments
  return `${containerHtml}
    ${imageContainerHtml}
      ${textLayers.join('\n')}
    </div>
  </div>`;
}

export function sanitizeHtml(html: string): string {
  return html.trim();
}