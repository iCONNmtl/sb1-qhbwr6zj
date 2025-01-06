import type { TextStyle } from '../types/mockup';

interface TextOverlayConfig {
  text: string;
  style: TextStyle;
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
      border-radius: ${style.borderRadius || '0'};
      padding: ${style.padding || '0'};
      white-space: pre-wrap;
      transform-origin: top left;
      z-index: 1;
      text-align: ${style.textAlign};
    ">${text}</div>`;
}

export function combineTextLayers(textLayers: string[]): string {
  if (textLayers.length === 0) return '';
  return textLayers.join('\n\n');
}

export function sanitizeHtml(html: string): string {
  return html.trim();
}