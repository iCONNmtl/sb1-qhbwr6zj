export type AspectRatio = '16:9' | '3:2' | '4:3' | '1:1' | '9:16' | '2:3' | '3:4';

export interface Mockup {
  id: string;
  name: string;
  category: string;
  aspectRatio: AspectRatio;
  previewUrl?: string;
  active: boolean;
  mockupUuid: string;
  smartObjectUuid: string;
  firestoreId?: string;
}