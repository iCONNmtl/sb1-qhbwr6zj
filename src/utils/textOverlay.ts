import type { TextStyle, ImageStyle } from '../types/mockup';
import type { PreviewFormat } from '../components/mockup/PreviewFormatSelector';
import { PREVIEW_DIMENSIONS, GRID_DIMENSIONS, calculateImagePosition } from './scaling';

interface TextOverlayConfig {
  text: string;
  style: TextStyle;
  position: { x: number; y: number };
}

interface ImageOverlayConfig {
  url: string;
  style: ImageStyle;
  position: { x: number; y: number };
}

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

export function generateImageOverlayHtml(config: ImageOverlayConfig): string {
  const { url, style, position } = config;
  const width = parseInt(style.width) || 100;
  const opacity = parseFloat(style.opacity) || 1;

  return `<div style="
    position: absolute;
    left: ${position.x}px;
    top: ${position.y}px;
    width: ${width}px;
    height: auto;
    opacity: ${opacity};
    z-index: 1;
  ">
    <img 
      src="${url}" 
      alt="Logo" 
      style="width: 100%; height: auto; object-fit: contain;"
    />
  </div>`;
}

export function combineTextLayers(
  layers: string[], 
  format: PreviewFormat = 'original',
  cropPosition: { x: number; y: number } = { x: 0, y: 0 },
  previewWidth: number = PREVIEW_DIMENSIONS.width
): string {
  if (format === 'original') {
    return `<div style="
      position: relative;
      width: ${PREVIEW_DIMENSIONS.width}px;
      height: ${PREVIEW_DIMENSIONS.height}px;
      overflow: hidden;
    ">
      ${layers.join('\n')}
    </div>`;
  }

  const imagePosition = calculateImagePosition(cropPosition, format as 'instagram' | 'pinterest', previewWidth);

  const containerHtml = `<div data-platform="${format}" style="
    position: relative;
    width: ${GRID_DIMENSIONS[format as 'instagram' | 'pinterest'].width}px;
    height: ${GRID_DIMENSIONS[format as 'instagram' | 'pinterest'].height}px;
    overflow: hidden;
  ">`;

  const imageContainerHtml = `<div class="mockup" style="
    position: absolute;
    left: ${imagePosition.x}px;
    top: ${imagePosition.y}px;
    width: ${PREVIEW_DIMENSIONS.width}px;
    height: ${PREVIEW_DIMENSIONS.height}px;
  ">`;

  return `${containerHtml}
    ${imageContainerHtml}
      ${layers.join('\n')}
    </div>
  </div>`;
}