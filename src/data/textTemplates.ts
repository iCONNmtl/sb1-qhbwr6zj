import type { TextTemplate } from '../types/textTemplate';

export const TEXT_TEMPLATES: TextTemplate[] = [
  {
    id: 'promo-modern',
    name: 'Réduction',
    category: 'Promotions',
    layers: [
      {
        text: 'SOLDES',
        style: {
          fontFamily: 'Roboto',
          fontSize: '64px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#000000',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 539, y: 38 }
      },
      {
        text: '-50%',
        style: {
          fontFamily: 'Roboto',
          fontSize: '60px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#000000',
          backgroundColor: '#ffc300',
          padding: '10px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 727, y: 147 }
      },
      {
        text: 'ACHETEZ MAINTENANT',
        style: {
          fontFamily: 'Roboto',
          fontSize: '30px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#000000',
          backgroundColor: '#ffc300',
          padding: '10px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 316, y: 685 }
      }
    ]
  },
  {
    id: 'exclusive-launch',
    name: 'Lancement Exclusif',
    category: 'Promotions',
    layers: [
      {
        text: 'NOUVEAUTÉ',
        style: {
          fontFamily: 'Poppins',
          fontSize: '60px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#2C3E50',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Découvrez notre dernière collection',
        style: {
          fontFamily: 'Roboto',
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#D5D5D5',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 150 }
      }
    ]
  },
  {
    id: 'customer-favorite',
    name: 'Coup de Coeur',
    category: 'Produit',
    layers: [
      {
        text: 'COUP DE COEUR',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '72px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.1)',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Nos clients adorent',
        style: {
          fontFamily: 'Roboto',
          fontSize: '36px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#FF5722',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 150 }
      }
    ]
  },
  {
    id: 'limited-edition',
    name: 'Édition Limitée',
    category: 'Promotions',
    layers: [
      {
        text: 'ÉDITION LIMITÉE',
        style: {
          fontFamily: 'Playfair Display',
          fontSize: '64px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#8E44AD',
          padding: '20px',
          borderRadius: '20px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Disponible jusqu\'à épuisement',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#8E44AD',
          padding: '12px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 50, y: 150 }
      }
    ]
  },
  {
    id: 'product-guarantee',
    name: 'Garantie et Satisfaction',
    category: 'Produit',
    layers: [
      {
        text: '100% Satisfaction',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '48px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#27AE60',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Livraison rapide',
        style: {
          fontFamily: 'Roboto',
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#555555',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 150 }
      },
      {
        text: 'Fabriqué avec soin au Québec',
        style: {
          fontFamily: 'Playfair Display',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#8E44AD',
          backgroundColor: 'transparent',
          padding: '5px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 230 }
      }
    ]
  },
  {
    id: 'product-benefits',
    name: 'Arguments',
    category: 'Produit',
    layers: [
      {
        text: 'Pourquoi choisir nos affiches ?',
        style: {
          fontFamily: 'Poppins',
          fontSize: '42px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#000000',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: '- Papier de haute qualité',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 20, y: 150 }
      },
      {
        text: '- Couleurs vibrantes et durables',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 20, y: 200 }
      },
      {
        text: '- Disponible avec ou sans cadre',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 20, y: 250 }
      }
    ]
  },
  {
    id: 'best-seller',
    name: 'Meilleure Vente',
    category: 'Promotions',
    layers: [
      {
        text: 'MEILLEURE VENTE',
        style: {
          fontFamily: 'Lora',
          fontSize: '56px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#E74C3C',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Affiches de voyage',
        style: {
          fontFamily: 'Roboto',
          fontSize: '36px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 150 }
      },
      {
        text: 'Déjà plus de 1000 ventes !',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '28px',
          fontWeight: 'italic',
          fontStyle: 'italic',
          color: '#555555',
          backgroundColor: 'transparent',
          padding: '5px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 230 }
      }
    ]
  },
  {
    id: 'faq-guide',
    name: 'Guide et FAQ',
    category: 'Produit',
    layers: [
      {
        text: 'Comment accrocher votre affiche ?',
        style: {
          fontFamily: 'Poppins',
          fontSize: '40px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#2C3E50',
          backgroundColor: 'rgba(44, 62, 80, 0.1)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: '1. Choisissez un mur bien éclairé',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 20, y: 150 }
      },
      {
        text: '2. Utilisez nos cadres ou adhésifs',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#333333',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 20, y: 200 }
      },
      {
        text: '3. Admirez votre décor personnalisé !',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#27AE60',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 20, y: 250 }
      }
    ]
  },              
  {
    id: 'social-vibrant',
    name: 'Suivez Nous',
    category: 'Réseaux Sociaux',
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
    name: 'Avis Clients',
    category: 'Produit',
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
  }
];

export const TEMPLATE_CATEGORIES = [
  'Tous',
  'Promotions',
  'Produit',
  'Réseaux Sociaux'
];