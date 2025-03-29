import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { nanoid } from 'nanoid';
import { Save, Loader2, Check, ChevronRight, AlertCircle, Image, DollarSign, Info } from 'lucide-react';
import DesignSelector from '../components/DesignSelector';
import { checkDesignCompatibility } from '../utils/designCompatibility';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import type { Size } from '../types/product';
import type { UserProfile } from '../types/user';

type ProductType = 'art-poster' | 'premium-mat' | 'premium-semigloss' | 'classic-mat' | 'classic-semigloss';

const SIZE_GROUPS = [
  {
    id: '8x10',
    name: 'Format 8x10',
    description: 'Format photo standard',
    sizes: [
      {
        id: '8x10',
        name: '8x10"',
        dimensions: {
          inches: '8x10"',
          cm: '20x25cm'
        },
        recommendedSize: {
          width: 2400,
          height: 3000
        },
        cost: 5,
        suggestedPrice: 15
      }
    ]
  },
  {
    id: 'rectangular',
    name: 'Formats rectangulaires larges',
    description: 'Idéal pour les affiches et posters',
    sizes: [
      {
        id: '8x12',
        name: '8x12"',
        dimensions: {
          inches: '8x12"',
          cm: '21x29,7cm'
        },
        recommendedSize: {
          width: 2400,
          height: 3600
        },
        cost: 7,
        suggestedPrice: 18
      },
      {
        id: '12x18',
        name: '12x18"',
        dimensions: {
          inches: '12x18"',
          cm: '30x45cm'
        },
        recommendedSize: {
          width: 3600,
          height: 5400
        },
        cost: 12,
        suggestedPrice: 25
      },
      {
        id: '24x36',
        name: '24x36"',
        dimensions: {
          inches: '24x36"',
          cm: '60x90cm'
        },
        recommendedSize: {
          width: 7200,
          height: 10800
        },
        cost: 25,
        suggestedPrice: 45
      }
    ]
  },
  {
    id: '11x14',
    name: 'Format 11x14',
    description: 'Format photo professionnel',
    sizes: [
      {
        id: '11x14',
        name: '11x14"',
        dimensions: {
          inches: '11x14"',
          cm: '27x35cm'
        },
        recommendedSize: {
          width: 3300,
          height: 4200
        },
        cost: 8,
        suggestedPrice: 20
      }
    ]
  },
  {
    id: '11x17',
    name: 'Format 11x17',
    description: 'Format affiche standard',
    sizes: [
      {
        id: '11x17',
        name: '11x17"',
        dimensions: {
          inches: '11x17"',
          cm: '28x43cm'
        },
        recommendedSize: {
          width: 3300,
          height: 5100
        },
        cost: 10,
        suggestedPrice: 22
      }
    ]
  },
  {
    id: '18x24',
    name: 'Format 18x24',
    description: 'Grand format affiche',
    sizes: [
      {
        id: '18x24',
        name: '18x24"',
        dimensions: {
          inches: '18x24"',
          cm: '45x60cm'
        },
        recommendedSize: {
          width: 5400,
          height: 7200
        },
        cost: 18,
        suggestedPrice: 35
      }
    ]
  },
  {
    id: 'a-series',
    name: 'Formats A (ISO 216)',
    description: 'Formats standards internationaux',
    sizes: [
      {
        id: 'A4',
        name: 'A4',
        dimensions: {
          inches: 'A4',
          cm: '21x29,7cm'
        },
        recommendedSize: {
          width: 2480,
          height: 3508
        },
        cost: 7,
        suggestedPrice: 18
      },
      {
        id: 'A3',
        name: 'A3',
        dimensions: {
          inches: 'A3',
          cm: '29,7x42cm'
        },
        recommendedSize: {
          width: 3508,
          height: 4961
        },
        cost: 12,
        suggestedPrice: 25
      },
      {
        id: 'A2',
        name: 'A2',
        dimensions: {
          inches: 'A2',
          cm: '42x59,4cm'
        },
        recommendedSize: {
          width: 4961,
          height: 7016
        },
        cost: 20,
        suggestedPrice: 35
      },
      {
        id: 'A1',
        name: 'A1',
        dimensions: {
          inches: 'A1',
          cm: '59,4x84,1cm'
        },
        recommendedSize: {
          width: 7016,
          height: 9933
        },
        cost: 30,
        suggestedPrice: 50
      },
      {
        id: 'A0',
        name: 'A0',
        dimensions: {
          inches: 'A0',
          cm: '84,1x118,9cm'
        },
        recommendedSize: {
          width: 9933,
          height: 14043
        },
        cost: 45,
        suggestedPrice: 75
      }
    ]
  },
  {
    id: 'standard',
    name: 'Autres formats standards',
    description: 'Formats courants',
    sizes: [
      {
        id: '5x7',
        name: '5x7"',
        dimensions: {
          inches: '5x7"',
          cm: '13x18cm'
        },
        recommendedSize: {
          width: 1500,
          height: 2100
        },
        cost: 3,
        suggestedPrice: 10
      },
      {
        id: '20x28',
        name: '20x28"',
        dimensions: {
          inches: '20x28"',
          cm: '50x70cm'
        },
        recommendedSize: {
          width: 6000,
          height: 8400
        },
        cost: 20,
        suggestedPrice: 40
      },
      {
        id: '28x40',
        name: '28x40"',
        dimensions: {
          inches: '28x40"',
          cm: '70x100cm'
        },
        recommendedSize: {
          width: 8400,
          height: 12000
        },
        cost: 30,
        suggestedPrice: 55
      }
    ]
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

interface SizeConfiguration {
  size: Size;
  selected: boolean;
  designUrl?: string;
  designDimensions?: { width: number; height: number };
  price: number;
  isValid: boolean;
  isLocked: boolean;
}

const getSimilarSizes = (sizeId: string): string[] => {
  const similarGroups = {
    '8x12': ['12x18', '24x36'],
    '12x18': ['8x12', '24x36'],
    '24x36': ['8x12', '12x18'],
    'A4': ['5x7', '20x28', '28x40', 'A3'],
    'A3': ['A4', 'A2'],
    'A2': ['A3', 'A1'],
    'A1': ['A2', 'A0'],
    'A0': ['A1'],
    '5x7': ['A4', '20x28', '28x40'],
    '20x28': ['A4', '5x7', '28x40'],
    '28x40': ['A4', '5x7', '20x28']
  } as const;

  return similarGroups[sizeId as keyof typeof similarGroups] || [];
};

const SIZES = SIZE_GROUPS.flatMap(group => group.sizes);

export default function Product() {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get('type') as ProductType || 'art-poster';
  const product = PRODUCT_TYPES[productType];
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentSizeId, setCurrentSizeId] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState('');
  const [sizeConfigurations, setSizeConfigurations] = useState<SizeConfiguration[]>(
    SIZES.map(size => ({
      size,
      selected: false,
      price: size.suggestedPrice,
      isValid: false,
      isLocked: false
    }))
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleDesignSelect = (url: string) => {
    if (!currentSizeId) return;

    setSizeConfigurations(prev => prev.map(config => 
      config.size.id === currentSizeId ? {
        ...config,
        designUrl: url,
        isValid: false
      } : config
    ));
  };

  const handleDesignDimensionsAvailable = (width: number, height: number) => {
    if (!currentSizeId) return;

    const currentConfig = sizeConfigurations.find(c => c.size.id === currentSizeId);
    if (!currentConfig) return;

    const compatibility = checkDesignCompatibility(width, height, currentConfig.size);
    
    setSizeConfigurations(prev => prev.map(config => 
      config.size.id === currentSizeId ? {
        ...config,
        designDimensions: { width, height },
        isValid: compatibility.isCompatible
      } : config
    ));
  };

  const handleSizeSelect = (sizeId: string) => {
    if (sizeConfigurations.find(c => c.size.id === sizeId)?.isLocked) {
      return;
    }

    const similarSizes = getSimilarSizes(sizeId);
    const configuredSimilarSize = sizeConfigurations.find(
      config => similarSizes.includes(config.size.id) && config.isLocked
    );

    setSizeConfigurations(prev => prev.map(config => {
      if (config.size.id === sizeId) {
        if (configuredSimilarSize) {
          return {
            ...config,
            selected: true,
            designUrl: configuredSimilarSize.designUrl,
            designDimensions: configuredSimilarSize.designDimensions,
            isValid: true
          };
        }
        return {
          ...config,
          selected: true
        };
      }
      return config;
    }));
    setCurrentSizeId(sizeId);
  };

  const handlePriceChange = (sizeId: string, price: number) => {
    const roundedPrice = Math.round(price);
    setSizeConfigurations(prev => prev.map(config => 
      config.size.id === sizeId ? { ...config, price: roundedPrice } : config
    ));
  };

  const handleValidateSize = () => {
    if (!currentSizeId) return;

    const currentConfig = sizeConfigurations.find(c => c.size.id === currentSizeId);
    if (!currentConfig?.isValid || currentConfig.price < currentConfig.size.cost) {
      return;
    }

    setSizeConfigurations(prev => prev.map(config => 
      config.size.id === currentSizeId ? {
        ...config,
        isLocked: true
      } : config
    ));
    setCurrentSizeId(null);
  };

  const handleCreateProduct = async () => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!userProfile?.organizationName?.trim()) {
      toast.error('Veuillez renseigner le nom de votre organisation dans les paramètres');
      navigate('/settings');
      return;
    }

    if (!productTitle.trim()) {
      toast.error('Veuillez saisir un titre pour le produit');
      return;
    }

    const selectedConfigs = sizeConfigurations.filter(config => config.selected && config.isLocked);
    if (selectedConfigs.length === 0) {
      toast.error('Veuillez configurer au moins une taille');
      return;
    }

    setLoading(true);
    try {
      const productId = nanoid();
      const productRef = collection(db, 'products');
      
      const firstDesignUrl = selectedConfigs[0].designUrl;
      
      await addDoc(productRef, {
        id: productId,
        userId: user.uid,
        type: productType,
        title: productTitle.trim(),
        name: product.name,
        designUrl: firstDesignUrl,
        variants: selectedConfigs.map(config => ({
          sizeId: config.size.id,
          name: product.name,
          cost: config.size.cost,
          price: config.price,
          sku: `${user.uid}-${productId}-${config.size.id}`,
          designUrl: config.designUrl,
          dimensions: config.size.dimensions
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

  const currentConfig = currentSizeId ? sizeConfigurations.find(c => c.size.id === currentSizeId) : null;
  const currentSize = currentConfig?.size;

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
          disabled={loading || !sizeConfigurations.some(config => config.isLocked) || !productTitle.trim()}
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Titre du produit
        </h2>
        <input
          type="text"
          value={productTitle}
          onChange={(e) => setProductTitle(e.target.value)}
          placeholder="Ex: Affiche Minimaliste Nature"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-4">
          {SIZE_GROUPS.map(group => (
            <div 
              key={group.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {group.sizes.map((size) => {
                  const config = sizeConfigurations.find(c => c.size.id === size.id)!;
                  return (
                    <button
                      key={size.id}
                      onClick={() => handleSizeSelect(size.id)}
                      className={clsx(
                        'w-full p-4 text-left transition-colors',
                        config.isLocked && 'bg-green-50',
                        currentSizeId === size.id && 'bg-indigo-50',
                        !config.isLocked && currentSizeId !== size.id && 'hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {size.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {size.dimensions.cm}
                          </div>
                        </div>
                        {config.isLocked ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : currentSizeId === size.id ? (
                          <div className="text-sm font-medium text-indigo-600">
                            En cours
                          </div>
                        ) : null}
                      </div>
                      
                      {(config.isLocked || currentSizeId === size.id) && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">Prix d'achat:</div>
                            <div className="text-right font-medium text-gray-900">
                              {size.cost}€
                            </div>
                            <div className="text-gray-500">Prix de vente:</div>
                            <div className="text-right">
                              {config.isLocked ? (
                                <span className="font-medium text-gray-900">{config.price}€</span>
                              ) : (
                                <input
                                  type="number"
                                  value={config.price}
                                  onChange={(e) => handlePriceChange(size.id, Number(e.target.value))}
                                  min={size.cost}
                                  step={1}
                                  className={clsx(
                                    'w-20 px-2 py-1 text-right border rounded',
                                    config.price < size.cost
                                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                  )}
                                />
                              )}
                            </div>
                            <div className="text-gray-500">Bénéfice:</div>
                            <div className="text-right font-medium text-green-600">
                              +{(config.price - size.cost).toFixed(2)}€
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          {currentSize ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Configuration de la taille {currentSize.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentSize.dimensions.cm}
                  </p>
                </div>
                <button
                  onClick={handleValidateSize}
                  disabled={!currentConfig?.isValid || (currentConfig?.price || 0) < currentSize.cost}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Valider
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      1. Sélectionnez votre design
                    </h3>
                    <div className="flex items-center text-sm">
                      <Info className="h-4 w-4 text-gray-400 mr-1" />
                      Taille recommandée: {currentSize.recommendedSize.width}×{currentSize.recommendedSize.height}px
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Droits sur les designs</p>
                        <p>En uploadant un design, vous certifiez :</p>
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                          <li>Être propriétaire des droits d'utilisation et de commercialisation du design</li>
                          <li>Avoir obtenu toutes les autorisations nécessaires pour son exploitation commerciale</li>
                          <li>Que le design ne viole aucun droit de propriété intellectuelle</li>
                        </ul>
                        <p className="mt-2">
                          MockupPro ne pourra être tenu responsable en cas de violation des droits de propriété intellectuelle.
                        </p>
                      </div>
                    </div>
                  </div>

                  <DesignSelector
                    userId={user?.uid || ''}
                    onSelect={handleDesignSelect}
                    selectedUrl={currentConfig?.designUrl}
                    sizes={[currentSize]}
                    onDimensionsAvailable={handleDesignDimensionsAvailable}
                  />
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    2. Prix de vente
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Prix d'achat</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          {currentSize.cost}€
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Prix de vente</div>
                        <input
                          type="number"
                          value={currentConfig?.price || currentSize.suggestedPrice}
                          onChange={(e) => handlePriceChange(currentSize.id, Number(e.target.value))}
                          min={currentSize.cost}
                          step={1}
                          className={clsx(
                            'w-full px-3 py-2 text-2xl font-semibold border rounded-lg',
                            (currentConfig?.price || 0) < currentSize.cost
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          )}
                        />
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Bénéfice</div>
                        <div className={clsx(
                          'text-2xl font-semibold',
                          (currentConfig?.price || 0) < currentSize.cost ? 'text-red-600' : 'text-green-600'
                        )}>
                          +{((currentConfig?.price || 0) - currentSize.cost).toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {(currentConfig?.price || 0) < currentSize.cost && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                        <div className="text-sm text-red-800">
                          Le prix de vente doit être supérieur au prix d'achat
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez une taille à configurer
              </h3>
              <p className="text-gray-600">
                Cliquez sur une taille dans la liste de gauche pour commencer sa configuration
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}