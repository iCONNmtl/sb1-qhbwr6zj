import type { TextTemplate } from '../types/textTemplate';

export const TEXT_TEMPLATES: TextTemplate[] = [
  {
    id: 'promo-modern',
    name: 'Promo Moderne',
    category: 'Promotions',
    layers: [
      {
        text: 'SOLDES',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '64px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#000000',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: '-50%',
        style: {
          fontFamily: 'Roboto',
          fontSize: '96px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FF0000',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          padding: '15px',
          borderRadius: '20px',
          textAlign: 'center'
        },
        position: { x: 50, y: 200 }
      }
    ]
  },
  {
    id: 'product-elegant',
    name: 'Produit Élégant',
    category: 'Produits',
    layers: [
      {
        text: 'COLLECTION',
        style: {
          fontFamily: 'Playfair Display',
          fontSize: '42px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#1a1a1a',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Printemps 2024',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#666666',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '4px',
          textAlign: 'center'
        },
        position: { x: 50, y: 130 }
      }
    ]
  },
  {
    id: 'social-vibrant',
    name: 'Social Vibrant',
    category: 'Social Media',
    layers: [
      {
        text: 'SUIVEZ-NOUS',
        style: {
          fontFamily: 'Roboto',
          fontSize: '48px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#1DA1F2',
          padding: '20px',
          borderRadius: '25px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: '@votremarque',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#1DA1F2',
          backgroundColor: 'rgba(29, 161, 242, 0.1)',
          padding: '12px',
          borderRadius: '20px',
          textAlign: 'center'
        },
        position: { x: 50, y: 150 }
      }
    ]
  },
  {
    id: 'quote-minimal',
    name: 'Citation Minimale',
    category: 'Citations',
    layers: [
      {
        text: '"La simplicité est la sophistication suprême"',
        style: {
          fontFamily: 'Playfair Display',
          fontSize: '36px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: '- Leonardo da Vinci',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '24px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#666666',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '4px',
          textAlign: 'right'
        },
        position: { x: 50, y: 150 }
      }
    ]
  },
  {
    id: 'sale-flash',
    name: 'Flash Sale',
    category: 'Promotions',
    layers: [
      {
        text: 'FLASH',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '72px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#FF4D4D',
          padding: '15px',
          borderRadius: '0px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'SALE',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '72px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FF4D4D',
          backgroundColor: '#FFFFFF',
          padding: '15px',
          borderRadius: '0px',
          textAlign: 'center'
        },
        position: { x: 50, y: 160 }
      },
      {
        text: '24H SEULEMENT',
        style: {
          fontFamily: 'Roboto',
          fontSize: '24px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#000000',
          padding: '10px',
          borderRadius: '4px',
          textAlign: 'center'
        },
        position: { x: 50, y: 270 }
      }
    ]
  }
];

export const TEMPLATE_CATEGORIES = [
  'Tous',
  'Promotions',
  'Produits',
  'Social Media',
  'Citations'
];