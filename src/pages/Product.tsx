import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';
import { Save, Loader2, Leaf, Sparkles, Droplets, Frame, Link2, Image, ChevronRight, Eye, Plus, Check } from 'lucide-react';
import DesignSelector from '../components/DesignSelector';
import toast from 'react-hot-toast';
import clsx from 'clsx';

type ProductType = 'art-poster' | 'premium-mat' | 'premium-semigloss' | 'classic-mat' | 'classic-semigloss';

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
  {
    id: '8x12',
    name: '8x12"',
    dimensions: {
      inches: '8x12',
      cm: '21x29,7cm'
    },
    cost: 7,
    suggestedPrice: 18
  },
  {
    id: '12x18',
    name: '12x18"',
    dimensions: {
      inches: '12x18',
      cm: '30x45cm'
    },
    cost: 12,
    suggestedPrice: 25
  },
  {
    id: '24x36',
    name: '24x36"',
    dimensions: {
      inches: '24x36',
      cm: '60x90cm'
    },
    cost: 25,
    suggestedPrice: 45
  },
  {
    id: '11x14',
    name: '11x14"',
    dimensions: {
      inches: '11x14',
      cm: '27x35cm'
    },
    cost: 8,
    suggestedPrice: 20
  },
  {
    id: '11x17',
    name: '11x17"',
    dimensions: {
      inches: '11x17',
      cm: '28x43cm'
    },
    cost: 10,
    suggestedPrice: 22
  },
  {
    id: '18x24',
    name: '18x24"',
    dimensions: {
      inches: '18x24',
      cm: '45x60cm'
    },
    cost: 18,
    suggestedPrice: 35
  },
  {
    id: 'A4',
    name: 'A4',
    dimensions: {
      inches: 'A4',
      cm: '21x29,7cm'
    },
    cost: 7,
    suggestedPrice: 18
  },
  {
    id: '5x7',
    name: '5x7"',
    dimensions: {
      inches: '5x7',
      cm: '13x18cm'
    },
    cost: 3,
    suggestedPrice: 10
  },
  {
    id: '20x28',
    name: '20x28"',
    dimensions: {
      inches: '20x28',
      cm: '50x70cm'
    },
    cost: 20,
    suggestedPrice: 40
  },
  {
    id: '28x40',
    name: '28x40"',
    dimensions: {
      inches: '28x40',
      cm: '70x100cm'
    },
    cost: 30,
    suggestedPrice: 55
  }
];

const PRODUCT_TYPES = {
  'art-poster': {
    name: 'Poster d\'Art',
    description: 'Impression artistique sur papier texturé 200g/m²'
  },
  'premium-mat': {
    name: 'Poster Premium Mat',
    description: 'Impression mate professionnelle sur papier 250g/m²'
  },
  'premium-semigloss': {
    name: 'Poster Premium Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 250g/m²'
  },
  'classic-mat': {
    name: 'Poster Classique Mat',
    description: 'Impression mate sur papier 180g/m²'
  },
  'classic-semigloss': {
    name: 'Poster Classique Semi-Brillant',
    description: 'Impression semi-brillante sur papier photo 180g/m²'
  }
} as const;

const SIZE_GROUPS = [
  {
    id: '8x10',
    name: 'Format 8x10',
    description: 'Format photo standard',
    sizes: ['8x10']
  },
  {
    id: 'rectangular',
    name: 'Formats rectangulaires larges',
    description: 'Idéal pour les affiches et posters',
    sizes: ['8x12', '12x18', '24x36']
  },
  {
    id: '11x14',
    name: 'Format 11x14',
    description: 'Format photo professionnel',
    sizes: ['11x14']
  },
  {
    id: '11x17',
    name: 'Format 11x17',
    description: 'Format affiche standard',
    sizes: ['11x17']
  },
  {
    id: '18x24',
    name: 'Format 18x24',
    description: 'Grand format affiche',
    sizes: ['18x24']
  },
  {
    id: 'standard',
    name: 'Formats standards',
    description: 'Formats internationaux courants',
    sizes: ['A4', '5x7', '20x28', '28x40']
  }
];

export default function Product() {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get('type') as ProductType || 'art-poster';
  const product = PRODUCT_TYPES[productType];
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<{
    size: Size;
    selected: boolean;
    customPrice?: number;
  }[]>(
    SIZES.map(size => ({ size, selected: false }))
  );
  const [designUrl, setDesignUrl] = useState<string>();

  const handleCreateProduct = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter');
      return;
    }

    const selectedSizes = selectedVariants.filter(v => v.selected);
    if (selectedSizes.length === 0) {
      toast.error('Veuillez sélectionner au moins une taille');
      return;
    }

    if (!designUrl) {
      toast.error('Veuillez sélectionner un design');
      return;
    }

    setLoading(true);
    try {
      const productId = nanoid();
      const productRef = collection(db, 'products');
      
      // Create product document with all variants
      await addDoc(productRef, {
        id: productId,
        userId: user.uid,
        type: productType,
        name: product.name, // Add product name at root level
        designUrl: designUrl,
        variants: selectedSizes.map(variant => ({
          sizeId: variant.size.id,
          name: product.name, // Add product name to each variant
          cost: variant.size.cost,
          suggestedPrice: variant.size.suggestedPrice,
          price: variant.customPrice || variant.size.suggestedPrice,
          sku: `${user.uid}-${productId}-${variant.size.id}`,
          designUrl: designUrl,
          dimensions: variant.size.dimensions
        })),
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      toast.success('Produit créé avec succès');
      navigate('/my-products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  const toggleVariant = (index: number) => {
    setSelectedVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        selected: !newVariants[index].selected
      };
      return newVariants;
    });
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedVariants(prev => {
      const newVariants = [...prev];
      const group = SIZE_GROUPS.find(g => g.id === groupId);
      if (!group) return prev;

      const groupVariants = newVariants.filter(v => group.sizes.includes(v.size.id));
      const allSelected = groupVariants.every(v => v.selected);

      groupVariants.forEach(variant => {
        const index = newVariants.findIndex(v => v.size.id === variant.size.id);
        newVariants[index] = {
          ...newVariants[index],
          selected: !allSelected
        };
      });

      return newVariants;
    });
  };

  const selectAllSizes = () => {
    setSelectedVariants(prev => 
      prev.map(variant => ({
        ...variant,
        selected: true
      }))
    );
  };

  const updateVariantPrice = (index: number, price: number) => {
    setSelectedVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        customPrice: price
      };
      return newVariants;
    });
  };

  const renderSizeGroup = (group: typeof SIZE_GROUPS[0]) => {
    const groupVariants = selectedVariants.filter(v => 
      group.sizes.includes(v.size.id)
    );

    const hasSelectedVariants = groupVariants.some(v => v.selected);
    const allVariantsSelected = groupVariants.every(v => v.selected);

    return (
      <div 
        key={group.id}
        className={clsx(
          'bg-white rounded-xl border-2 transition-all duration-200',
          hasSelectedVariants ? 'border-indigo-600' : 'border-gray-200'
        )}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                onClick={() => toggleGroupSelection(group.id)}
                className={clsx(
                  'w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors',
                  allVariantsSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : hasSelectedVariants
                    ? 'bg-indigo-100 border-indigo-600'
                    : 'border-gray-300 hover:border-indigo-500'
                )}
              >
                {allVariantsSelected && <Check className="h-4 w-4" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {groupVariants.map((variant) => {
            const variantIndex = selectedVariants.findIndex(v => v.size.id === variant.size.id);

            return (
              <div
                key={variant.size.id}
                className={clsx(
                  'p-4 transition-colors',
                  variant.selected && 'bg-indigo-50/50',
                  !variant.selected && 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => toggleVariant(variantIndex)}
                    className={clsx(
                      'w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors',
                      variant.selected 
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 hover:border-indigo-500'
                    )}
                  >
                    {variant.selected && <Check className="h-4 w-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-gray-900">
                        {variant.size.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {variant.size.dimensions.cm}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm">
                      <span className="text-gray-500">
                        Prix d'achat: {variant.size.cost}€
                      </span>
                      <span className="text-gray-500">
                        Prix suggéré: {variant.size.suggestedPrice}€
                      </span>
                    </div>
                    {variant.selected && (
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Prix de vente
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={variant.customPrice || variant.size.suggestedPrice}
                              onChange={(e) => updateVariantPrice(variantIndex, Number(e.target.value))}
                              onClick={(e) => e.stopPropagation()}
                              className={clsx(
                                'w-24 px-2 py-1 text-sm border rounded-lg',
                                (variant.customPrice || variant.size.suggestedPrice) < variant.size.cost
                                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                              )}
                            />
                            <span className={clsx(
                              'text-sm font-medium',
                              (variant.customPrice || variant.size.suggestedPrice) < variant.size.cost
                                ? 'text-red-600'
                                : 'text-green-600'
                            )}>
                              Marge: {((variant.customPrice || variant.size.suggestedPrice) - variant.size.cost).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un nouveau produit
          </h1>
          <p className="text-gray-600 mt-1">
            {product.name}
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          disabled={loading || !selectedVariants.some(v => v.selected)}
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              1. Sélectionnez vos formats
            </h2>
            <button
              onClick={selectAllSizes}
              className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
            >
              <Check className="h-5 w-5 mr-2" />
              Tout sélectionner
            </button>
          </div>
          
          <div className="space-y-6">
            {SIZE_GROUPS.map(group => renderSizeGroup(group))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  2. Sélectionnez votre design
                </h2>
              </div>
            </div>

            <DesignSelector
              userId={user?.uid || ''}
              onSelect={setDesignUrl}
              selectedUrl={designUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}