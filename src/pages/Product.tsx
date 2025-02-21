import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';
import { Save, Loader2, Leaf, Sparkles, Droplets, Frame, Link2, Image, ChevronRight, Eye, Plus, Check } from 'lucide-react';
import DesignSelector from '../components/DesignSelector';
import DesignEditor from '../components/product/DesignEditor';
import toast from 'react-hot-toast';
import clsx from 'clsx';

type ProductType = 'poster-mat' | 'poster-glossy' | 'poster-frame';

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
  designUrl?: string;
  customPrice?: number;
  adjustments?: {
    scale: number;
    position: { x: number; y: number };
    rotation: number;
  };
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
  'poster-mat': {
    name: 'Poster Mat Premium',
    description: 'Impression mate professionnelle sur papier 250g/m²'
  },
  'poster-glossy': {
    name: 'Poster Brillant Premium',
    description: 'Impression brillante éclatante sur papier photo 250g/m²'
  },
  'poster-frame': {
    name: 'Poster Encadré',
    description: 'Vos posters encadrés avec élégance dans des cadres en aluminium'
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
  const productType = searchParams.get('type') as ProductType || 'poster-mat';
  const product = PRODUCT_TYPES[productType];
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>(
    SIZES.map(size => ({ size, selected: false }))
  );
  const [configureVariantId, setConfigureVariantId] = useState<string | null>(null);
  const [designAdjustments, setDesignAdjustments] = useState<Record<string, any>>({});
  const [variantDesigns, setVariantDesigns] = useState<Record<string, string>>({});
  const [configuredVariants, setConfiguredVariants] = useState<Set<string>>(new Set());

  const configuringVariant = selectedVariants.find(v => v.size.id === configureVariantId);

  const getDefaultAdjustment = () => ({
    scale: 1,
    position: { x: 0, y: 0 },
    rotation: 0
  });

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

  const updateVariantDesign = (url: string, sizeId: string) => {
    // Update the design for the current size
    setVariantDesigns(prev => ({
      ...prev,
      [sizeId]: url
    }));

    // Get the size group that contains this size
    const sizeGroup = SIZE_GROUPS.find(group => group.sizes.includes(sizeId));
    if (!sizeGroup) return;

    // Get all selected variants from the same group
    const selectedGroupVariants = selectedVariants.filter(v => 
      v.selected && sizeGroup.sizes.includes(v.size.id)
    );

    // Update designs and adjustments for all selected variants in the group
    if (selectedGroupVariants.length > 0) {
      const newDesigns = { ...variantDesigns };
      const newAdjustments = { ...designAdjustments };
      const newConfigured = new Set(configuredVariants);

      selectedGroupVariants.forEach(variant => {
        newDesigns[variant.size.id] = url;
        newAdjustments[variant.size.id] = getDefaultAdjustment();
        newConfigured.add(variant.size.id);
      });

      setVariantDesigns(newDesigns);
      setDesignAdjustments(newAdjustments);
      setConfiguredVariants(newConfigured);

      // Set the first variant as the one being configured
      if (!configureVariantId) {
        setConfigureVariantId(selectedGroupVariants[0].size.id);
      }
    }
  };

  const toggleVariant = (index: number) => {
    setSelectedVariants(prev => {
      const newVariants = [...prev];
      const variant = newVariants[index];
      
      variant.selected = !variant.selected;

      if (!variant.selected && configureVariantId === variant.size.id) {
        const nextSelected = newVariants.find(v => v.selected && v.size.id !== variant.size.id);
        setConfigureVariantId(nextSelected?.size.id || null);
      }
      else if (variant.selected && !configureVariantId) {
        setConfigureVariantId(variant.size.id);
      }

      // If selecting and there's a similar size with a design already configured
      if (variant.selected) {
        const sizeGroup = SIZE_GROUPS.find(group => group.sizes.includes(variant.size.id));
        if (sizeGroup) {
          const configuredSimilarVariant = newVariants.find(v => 
            v.selected && 
            sizeGroup.sizes.includes(v.size.id) && 
            variantDesigns[v.size.id]
          );

          if (configuredSimilarVariant) {
            const designUrl = variantDesigns[configuredSimilarVariant.size.id];
            const adjustment = designAdjustments[configuredSimilarVariant.size.id];

            setVariantDesigns(prev => ({
              ...prev,
              [variant.size.id]: designUrl
            }));
            setDesignAdjustments(prev => ({
              ...prev,
              [variant.size.id]: { ...adjustment }
            }));
            setConfiguredVariants(prev => new Set([...prev, variant.size.id]));
          }
        }
      }

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

      if (!allSelected && !configureVariantId) {
        const firstSelected = newVariants.find(v => v.selected);
        if (firstSelected) {
          setConfigureVariantId(firstSelected.size.id);
        }
      }

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

    if (!configureVariantId) {
      setConfigureVariantId(selectedVariants[0].size.id);
    }
  };

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

    const missingDesigns = selectedSizes.filter(v => !variantDesigns[v.size.id]);
    if (missingDesigns.length > 0) {
      toast.error('Veuillez associer un design à toutes les tailles sélectionnées');
      return;
    }

    setLoading(true);
    try {
      const productId = nanoid();
      const productRef = collection(db, 'products');
      
      // Get the first variant's design URL to use as the main product design
      const firstVariantDesignUrl = variantDesigns[selectedSizes[0].size.id];
      
      // Créer le document produit avec toutes les informations
      await addDoc(productRef, {
        id: productId,
        userId: user.uid,
        type: productType,
        designUrl: firstVariantDesignUrl, // Add main design URL
        variants: selectedSizes.map(variant => ({
          sizeId: variant.size.id,
          cost: variant.size.cost,
          suggestedPrice: variant.size.suggestedPrice,
          price: variant.customPrice || variant.size.suggestedPrice,
          sku: `${user.uid}-${productId}-${variant.size.id}`, // SKU unique avec ID utilisateur
          designUrl: variantDesigns[variant.size.id],
          adjustments: designAdjustments[variant.size.id] || getDefaultAdjustment(),
          dimensions: variant.size.dimensions
        })),
        createdAt: new Date().toISOString(),
        status: 'active',
        metadata: {
          productName: PRODUCT_TYPES[productType].name,
          productDescription: PRODUCT_TYPES[productType].description
        }
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

  const renderSizeGroup = (group: typeof SIZE_GROUPS[0]) => {
    const groupVariants = selectedVariants.filter(v => 
      group.sizes.includes(v.size.id)
    );

    const hasSelectedVariants = groupVariants.some(v => v.selected);
    const allVariantsSelected = groupVariants.every(v => v.selected);
    const hasConfiguredVariants = groupVariants.some(v => variantDesigns[v.size.id]);
    const allVariantsConfigured = groupVariants.every(v => !v.selected || variantDesigns[v.size.id]);

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
            {hasSelectedVariants && (
              <div className={clsx(
                'px-3 py-1 rounded-full text-sm font-medium',
                allVariantsConfigured ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              )}>
                {allVariantsConfigured ? 'Configuré' : 'À configurer'}
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {groupVariants.map((variant, index) => {
            const variantIndex = selectedVariants.findIndex(v => v.size.id === variant.size.id);
            const hasDesign = Boolean(variantDesigns[variant.size.id]);
            const isConfiguring = configureVariantId === variant.size.id;
            const isConfigured = configuredVariants.has(variant.size.id);

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

                  {variant.selected && (
                    <div className="flex items-center gap-2">
                      {hasDesign ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden">
                            <img 
                              src={variantDesigns[variant.size.id]} 
                              alt={`Design ${variant.size.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {!isConfigured && (
                            <button
                              onClick={() => setConfigureVariantId(variant.size.id)}
                              className={clsx(
                                'p-2 rounded-lg transition-colors',
                                isConfiguring
                                  ? 'bg-indigo-600 text-white'
                                  : 'hover:bg-gray-100 text-gray-600'
                              )}
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfigureVariantId(variant.size.id)}
                          className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter un design
                        </button>
                      )}
                    </div>
                  )}
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
          {configureVariantId && configuringVariant ? (
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    2. Configuration du design pour {configuringVariant.size.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {configuringVariant.size.dimensions.cm}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {variantDesigns[configureVariantId] ? (
                  <DesignEditor
                    designUrl={variantDesigns[configureVariantId]}
                    selectedSizes={[configuringVariant.size]}
                    onSave={(adjustments) => {
                      setDesignAdjustments(prev => ({
                        ...prev,
                        [configuringVariant.size.id]: adjustments[configuringVariant.size.id]
                      }));
                    }}
                    initialAdjustments={{
                      [configuringVariant.size.id]: designAdjustments[configuringVariant.size.id] || getDefaultAdjustment()
                    }}
                  />
                ) : (
                  <DesignSelector
                    userId={user?.uid || ''}
                    onSelect={(url) => updateVariantDesign(url, configuringVariant.size.id)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une taille pour configurer son design
              </h3>
              <p className="text-gray-600">
                Cliquez sur l'icône <Eye className="h-4 w-4 inline-block mx-1" /> pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}