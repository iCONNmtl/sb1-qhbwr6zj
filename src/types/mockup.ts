export type LegacyAspectRatio = '16:9' | '3:2' | '4:3' | '1:1' | '9:16' | '2:3' | '3:4';

export type StandardAspectRatio = 
  | '8x10' // 20x25cm
  | '8x12' // 21x29,7cm
  | '12x18' // 30x45cm
  | '24x36' // 60x90cm
  | '11x14' // 27x35cm
  | '11x17' // 28x43cm
  | '18x24' // 45x60cm
  | 'A4' // 21x29,7cm
  | '5x7' // 13x18cm
  | '20x28' // 50x70cm
  | '28x40'; // 70x100cm

export type AspectRatio = LegacyAspectRatio | StandardAspectRatio;
export type ExportFormat = 'webp' | 'png';
export type GenerationPlatform = 'instagram' | 'pinterest' | null;

export interface Mockup {
  id: string;
  firestoreId: string;
  name: string;
  category: string;
  aspectRatio: AspectRatio;
  previewUrl?: string;
  previewUrlAfter?: string;
  mockupUuid: string;
  smartObjectUuid: string;
  active: boolean;
  createdAt: string;
}

export interface TextStyle {
  fontSize: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
}

export interface ImageStyle {
  width: string;
  opacity: string;
}

export interface TextLayer {
  id: string;
  type: 'text';
  text: string;
  style: TextStyle;
  position: { x: number; y: number };
}

export interface ImageLayer {
  id: string;
  type: 'image';
  url: string;
  style: ImageStyle;
  position: { x: number; y: number };
}

export interface Generation {
  id: string;
  userId: string;
  designName: string;
  mockups: {
    id: string;
    name: string;
    url: string;
    platform?: GenerationPlatform;
  }[];
  exportFormat: ExportFormat;
  customHtml?: string | null;
  customizedMockups?: number[];
  creditsUsed: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'processing';
}