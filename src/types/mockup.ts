export type AspectRatio = '16:9' | '3:2' | '4:3' | '1:1' | '9:16' | '2:3' | '3:4';
export type ExportFormat = 'webp' | 'png';
export type GenerationPlatform = 'instagram' | 'pinterest' | null;

export interface TextStyle {
  fontSize: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
}

export interface Mockup {
  id: string;
  name: string;
  url: string;
  platform?: GenerationPlatform;
}