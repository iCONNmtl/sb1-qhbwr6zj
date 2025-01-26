import type { TextStyle, ImageStyle } from './mockup';

interface BaseTemplateLayer {
  position: {
    x: number;
    y: number;
  };
}

interface TextTemplateLayer extends BaseTemplateLayer {
  type: 'text';
  text: string;
  style: TextStyle;
}

interface ImageTemplateLayer extends BaseTemplateLayer {
  type: 'image';
  url: string;
  style: ImageStyle;
}

export type TemplateLayer = TextTemplateLayer | ImageTemplateLayer;

export interface TextTemplate {
  id: string;
  name: string;
  category: string;
  layers: TemplateLayer[];
}