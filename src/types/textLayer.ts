import type { TextStyle } from './mockup';

export interface TextLayer {
  id: string;
  text: string;
  style: TextStyle;
  position: {
    x: number;
    y: number;
  };
}