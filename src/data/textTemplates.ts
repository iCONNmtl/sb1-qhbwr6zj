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
          backgroundColor: '#735751',
          padding: '35px',
          borderRadius: '15px',
          textAlign: 'center'
        },
        position: { x: 54, y: 50 }
      },
      {
        text: 'Découvrez notre dernière collection',
        style: {
          fontFamily: 'Roboto',
          fontSize: '20px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#D5D5D5',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 86, y: 159 }
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
          fontSize: '48px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#ef233c',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 497, y: 45 }
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
          fontSize: '60px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#000000',
          backgroundColor: '#ffc300',
          padding: '15px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 50, y: 50 }
      },
      {
        text: 'Disponible jusqu\'à épuisement',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '25px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#ffc300',
          backgroundColor: '#000000',
          padding: '15px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 112, y: 162 }
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
          color: '#FFFFFF',
          backgroundColor: '#57cc99',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 55, y: 41 }
      },
      {
        text: 'Livraison rapide',
        style: {
          fontFamily: 'Roboto',
          fontSize: '30px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#57cc99',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 55, y: 272 }
      },
      {
        text: 'Fabriqué avec soin au Québec',
        style: {
          fontFamily: 'Roboto',
          fontSize: '30px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#8E44AD',
          backgroundColor: '#57cc99',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 55, y: 178 }
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
          color: '#FFFFFF',
          backgroundColor: '#735751',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 79, y: 37 }
      },
      {
        text: '- Papier de haute qualité',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 85, y: 150 }
      },
      {
        text: '- Couleurs vibrantes et durables',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 85, y: 200 }
      },
      {
        text: '- Disponible avec ou sans cadre',
        style: {
          fontFamily: 'Roboto',
          fontSize: '28px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 85, y: 250 }
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
          fontSize: '50px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#57cc99',
          padding: '10px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 430, y: 655 }
      },
      {
        text: 'Déjà plus de 1000 ventes !',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '30px',
          fontWeight: 'italic',
          fontStyle: 'italic',
          color: '#000000',
          backgroundColor: 'transparent',
          padding: '5px',
          borderRadius: '5px',
          textAlign: 'center'
        },
        position: { x: 430, y: 594 }
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
          fontFamily: 'Montserrat',
          fontSize: '40px',
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: '#000000',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 54, y: 39 }
      },
      {
        text: '1. Choisissez un mur bien éclairé',
        style: {
          fontFamily: 'Roboto',
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '0px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 60, y: 170 }
      },
      {
        text: '2. Utilisez nos cadres ou adhésifs',
        style: {
          fontFamily: 'Roboto',
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '0px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 60, y: 230 }
      },
      {
        text: '3. Admirez votre décor personnalisé !',
        style: {
          fontFamily: 'Roboto',
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '0px',
          borderRadius: '5px',
          textAlign: 'left'
        },
        position: { x: 60, y: 290 }
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
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        },
        position: { x: 569, y: 621 }
      },
      {
        text: '@votremarque',
        style: {
          fontFamily: 'Montserrat',
          fontSize: '30px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          padding: '0px',
          borderRadius: '20px',
          textAlign: 'center'
        },
        position: { x: 605, y: 716 }
      }
    ]
  },
  {
    id: 'quote-minimal',
    name: 'Avis Clients',
    category: 'Produit',
    layers: [
      {
        text: '"Les affiches sont magnifiques !"',
        style: {
          fontFamily: 'Playfair Display',
          fontSize: '35px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center'
        },
        position: { x: 420, y: 40 }
      },
      {
        text: '"Je suis ravie, je reviendrai"',
        style: {
          fontFamily: 'Playfair Display',
          fontSize: '35px',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#333333',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'right'
        },
        position: { x: 40, y: 682 }
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