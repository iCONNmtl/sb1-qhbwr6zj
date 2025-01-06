import React from 'react';
import type { TextStyle } from '../../types/mockup';

interface TextOverlayGeneratorProps {
  text: string;
  style: TextStyle;
  containerSize: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export default function TextOverlayGenerator({ text, style, containerSize, position }: TextOverlayGeneratorProps) {
  // Génère le HTML avec le style exact pour le webhook
  const generateHtml = () => {
    return `
      <div style="
        position: relative;
        width: ${containerSize.width}px;
        height: ${containerSize.height}px;
        background: transparent;
      ">
        <div style="
          position: absolute;
          left: ${position.x}px;
          top: ${position.y}px;
          font-family: '${style.fontFamily}', sans-serif;
          font-size: ${style.fontSize};
          font-weight: ${style.fontWeight};
          font-style: ${style.fontStyle};
          color: ${style.color};
          text-align: ${style.textAlign};
          white-space: pre-wrap;
          transform-origin: top left;
        ">
          ${text}
        </div>
      </div>
    `;
  };

  return generateHtml();
}