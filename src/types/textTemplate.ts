import type { TextStyle } from './mockup';

export interface TextTemplateLayer {
  text: string;
  style: TextStyle;
  position: {
    x: number;
    y: number;
  };
}

export interface TextTemplate {
  id: string;
  name: string;
  category: string;
  layers: TextTemplateLayer[];
}