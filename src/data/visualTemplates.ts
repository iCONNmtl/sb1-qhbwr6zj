import type { ImageLayer } from '../types/mockup';

export const VISUAL_TEMPLATES = [
  {
    id: 'logo-top-left',
    name: 'Logo en haut à gauche',
    category: 'Logos',
    layer: {
      type: 'image' as const,
      style: {
        width: '100px',
        opacity: '1'
      },
      position: { x: 20, y: 20 }
    }
  },
  {
    id: 'logo-top-right',
    name: 'Logo en haut à droite',
    category: 'Logos',
    layer: {
      type: 'image' as const,
      style: {
        width: '100px',
        opacity: '1'
      },
      position: { x: 880, y: 20 }
    }
  },
  {
    id: 'logo-bottom-left',
    name: 'Logo en bas à gauche',
    category: 'Logos',
    layer: {
      type: 'image' as const,
      style: {
        width: '100px',
        opacity: '1'
      },
      position: { x: 20, y: 880 }
    }
  },
  {
    id: 'logo-bottom-right',
    name: 'Logo en bas à droite',
    category: 'Logos',
    layer: {
      type: 'image' as const,
      style: {
        width: '100px',
        opacity: '1'
      },
      position: { x: 880, y: 880 }
    }
  },
  {
    id: 'watermark-center',
    name: 'Filigrane centré',
    category: 'Filigranes',
    layer: {
      type: 'image' as const,
      style: {
        width: '200px',
        opacity: '0.3'
      },
      position: { x: 400, y: 400 }
    }
  },
  {
    id: 'watermark-bottom',
    name: 'Filigrane en bas',
    category: 'Filigranes',
    layer: {
      type: 'image' as const,
      style: {
        width: '150px',
        opacity: '0.3'
      },
      position: { x: 425, y: 900 }
    }
  }
];

export const VISUAL_CATEGORIES = ['Tous', 'Logos', 'Filigranes'] as const;