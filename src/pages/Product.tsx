import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';
import { Printer, Save, Loader2, Info, Leaf, Sparkles, Droplets, Scale, Frame } from 'lucide-react';
import DesignSelector from '../components/DesignSelector';
import DesignEditor from '../components/product/DesignEditor';
import toast from 'react-hot-toast';
import clsx from 'clsx';

// Types and constants from the previous file...
interface Size {
  id: string;
  name: string;
  dimensions: {
    inches: string;
    cm: string;
  };
  cost: number;
  suggestedPrice: number;
}

interface Variant {
  size: Size;
  selected: boolean;
}

const SIZES: Size[] = [
  {
    id: '8x10',
    name: '8x10"',
    dimensions: {
      inches: '8x10',
      cm: '20x25cm'
    },
    cost: 5,
    suggestedPrice: 15
  },
  // ... other sizes
];

const PRODUCT_TYPES = {
  'poster-mat': {
    name: 'Poster Mat Premium',
    description: 'Impression mate professionnelle sur papier 250g/m²',
    icon: Droplets,
    features: [
      {
        icon: Sparkles,
        title: 'Finition mate',
        description: 'Surface mate anti-reflets pour un rendu artistique'
      },
      {
        icon: Scale,
        title: '250 g/m²',
        description: 'Grammage professionnel pour une qualité optimale'
      },
      {
        icon: Droplets,
        title: 'Texture fine',
        description: 'Surface légèrement texturée pour un rendu premium'
      },
      {
        icon: Leaf,
        title: 'Certifié FSC',
        description: 'Papier issu de forêts gérées durablement'
      }
    ]
  },
  'poster-glossy': {
    name: 'Poster Brillant Premium',
    description: 'Impression brillante éclatante sur papier photo 250g/m²',
    icon: Sparkles,
    features: [
      {
        icon: Sparkles,
        title: 'Finition brillante',
        description: 'Surface ultra-brillante pour des couleurs éclatantes'
      },
      {
        icon: Scale,
        title: '250 g/m²',
        description: 'Grammage professionnel pour une qualité optimale'
      },
      {
        icon: Droplets,
        title: 'Séchage instantané',
        description: 'Encre qui sèche instantanément, sans bavures'
      },
      {
        icon: Leaf,
        title: 'Certifié FSC',
        description: 'Papier issu de forêts gérées durablement'
      }
    ]
  },
  'poster-frame': {
    name: 'Poster Encadré',
    description: 'Vos posters encadrés avec élégance dans des cadres en aluminium',
    icon: Frame,
    features: [
      {
        icon: Frame,
        title: 'Cadre aluminium',
        description: 'Cadre premium en aluminium brossé'
      },
      {
        icon: Sparkles,
        title: 'Verre anti-reflets',
        description: 'Protection optimale contre les reflets'
      },
      {
        icon: Scale,
        title: 'Montage pro',
        description: 'Montage professionnel inclus'
      },
      {
        icon: Leaf,
        title: 'Protection UV',
        description: 'Protection contre les rayons UV'
      }
    ]
  }
} as const;

type ProductType = keyof typeof PRODUCT_TYPES;

export default function Product() {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get('type') as ProductType || 'poster-mat';
  const product = PRODUCT_TYPES[productType];

  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [designUrl, setDesignUrl] = useState<string>();
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>(
    SIZES.map(size => ({ size, selected: false }))
  );
  const [designAdjustments, setDesignAdjustments] = useState<Record<string, any>>({});

  const handleCreateProduct = async () => {
    if (!user || !designUrl) {
      toast.error('Veuillez sélectionner un design');
      return;
    }

    const selectedSizes = selectedVariants.filter(v => v.selected);
    if (selectedSizes.length === 0) {
      toast.error('Veuillez sélectionner au moins une taille');
      return;
    }

    setLoading(true);
    try {
      const productId = nanoid();
      const productRef = collection(db, 'products');
      
      await addDoc(productRef, {
        id: productId,
        userId: user.uid,
        type: productType,
        designUrl,
        variants: selectedSizes.map(variant => ({
          sizeId: variant.size.id,
          cost: variant.size.cost,
          suggestedPrice: variant.size.suggestedPrice,
          sku: `${productId}-${variant.size.id}`,
          adjustments: designAdjustments[variant.size.id] || {
            scale: 1,
            position: { x: 0, y: 0 },
            rotation: 0
          }
        })),
        createdAt: new Date().toISOString()
      });

      toast.success('Produit créé avec succès');
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  const toggleVariant = (index: number) => {
    setSelectedVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, selected: !variant.selected } : variant
    ));
  };

  const selectedSizes = selectedVariants
    .filter(v => v.selected)
    .map(v => v.size);

  const Icon = product.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {product.features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="p-2 bg-white w-fit rounded-lg mb-3">
                  <FeatureIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-600">
                  {feature.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Configuration du produit
          </h2>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
            {selectedVariants.filter(v => v.selected).length} taille{selectedVariants.filter(v => v.selected).length > 1 ? 's' : ''} sélectionnée{selectedVariants.filter(v => v.selected).length > 1 ? 's' : ''}
          </div>
        </div>
        <button
          onClick={handleCreateProduct}
          disabled={loading || !designUrl || !selectedVariants.some(v => v.selected)}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Création...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Créer le produit
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <DesignSelector 
            userId={user?.uid || ''}
            onSelect={setDesignUrl}
          />

          {designUrl && selectedSizes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ajuster le design
              </h2>
              <DesignEditor
                designUrl={designUrl}
                selectedSizes={selectedSizes}
                onSave={setDesignAdjustments}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tailles disponibles
            </h2>
            <div className="space-y-4">
              {selectedVariants.map((variant, index) => (
                <button
                  key={variant.size.id}
                  onClick={() => toggleVariant(index)}
                  className={clsx(
                    'w-full p-4 rounded-xl border-2 transition-all duration-200',
                    variant.selected
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {variant.size.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {variant.size.dimensions.cm}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {variant.size.cost}€
                        </div>
                        <div className="relative group">
                          <Info className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                          <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="font-medium mb-2">Détails du prix</div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Prix de vente suggéré:</span>
                                <span className="font-medium">{variant.size.suggestedPrice}€</span>
                              </div>
                              <div className="flex justify-between text-green-400">
                                <span>Bénéfice potentiel:</span>
                                <span className="font-medium">+{variant.size.suggestedPrice - variant.size.cost}€</span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/20 text-xs text-white/70">
                                Prix HT • TVA non incluse
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}