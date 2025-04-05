import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SIZES } from '../data/sizes';
import { PRODUCT_PRICING, getProductPricing } from '../data/shipping';
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

const PRODUCT_TYPES = {
  'art-poster': 'Poster d\'Art',
  'premium-mat': 'Poster Premium Mat',
  'premium-semigloss': 'Poster Premium Semi-Brillant'
} as const;

const SIZE_GROUPS = [
  {
    id: '8x10',
    name: 'Format 8x10',
    description: 'Format photo standard',
    sizes: [SIZES.find(s => s.id === '8x10')!]
  },
  {
    id: 'rectangular',
    name: 'Formats rectangulaires larges',
    description: 'Idéal pour les affiches et posters',
    sizes: [
      SIZES.find(s => s.id === '8x12')!,
      SIZES.find(s => s.id === '12x18')!,
      SIZES.find(s => s.id === '24x36')!
    ]
  },
  {
    id: '11x14',
    name: 'Format 11x14',
    description: 'Format photo professionnel',
    sizes: [SIZES.find(s => s.id === '11x14')!]
  },
  {
    id: '11x17',
    name: 'Format 11x17',
    description: 'Format affiche standard',
    sizes: [SIZES.find(s => s.id === '11x17')!]
  },
  {
    id: '18x24',
    name: 'Format 18x24',
    description: 'Grand format affiche',
    sizes: [SIZES.find(s => s.id === '18x24')!]
  },
  {
    id: 'standard',
    name: 'Formats standards',
    description: 'Formats internationaux courants',
    sizes: [
      SIZES.find(s => s.id === 'A4')!,
      SIZES.find(s => s.id === 'A3')!,
      SIZES.find(s => s.id === 'A2')!,
      SIZES.find(s => s.id === 'A1')!,
      SIZES.find(s => s.id === 'A0')!,
      SIZES.find(s => s.id === '5x7')!,
      SIZES.find(s => s.id === '20x28')!,
      SIZES.find(s => s.id === '28x40')!
    ]
  }
];

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
    'A4': ['5x7', '20x28', '28x40'],
    '5x7': ['A4', '20x28', '28x40'],
    '20x28': ['A4', '5x7', '28x40'],
    '28x40': ['A4', '5x7', '20x28']
  } as const;

  return similarGroups[sizeId as keyof typeof similarGroups] || [];
};

export default function Product() {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get('type') as keyof typeof PRODUCT_TYPES || 'art-poster';
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

  const handleSave = async () => {
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
        name: PRODUCT_TYPES[productType],
        designUrl: firstDesignUrl,
        variants: selectedConfigs.map(config => ({
          sizeId: config.size.id,
          name: PRODUCT_TYPES[productType],
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
    if (!currentConfig?.isValid) return;

    // Get minimum price across all regions
    const minPrice = Object.keys(PRODUCT_PRICING).reduce((min, region) => {
      const pricing = getProductPricing(productType, currentSizeId, region);
      return Math.min(min, pricing?.price || Infinity);
    }, Infinity);

    if (currentConfig.price < minPrice) {
      toast.error(`Le prix doit être supérieur à ${minPrice}€`);
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un nouveau produit
          </h1>
          <p className="text-gray-600 mt-1">
            {PRODUCT_TYPES[productType]}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !sizeConfigurations.some(v => v.selected && v.isLocked) || !productTitle.trim()}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Enregistrer
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
          {currentSizeId ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Configuration de la taille {sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.dimensions.cm}
                  </p>
                </div>
                <button
                  onClick={handleValidateSize}
                  disabled={!sizeConfigurations.find(c => c.size.id === currentSizeId)?.isValid}
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
                      Taille recommandée: {sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.recommendedSize.width}×{sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.recommendedSize.height}px
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
                    selectedUrl={sizeConfigurations.find(c => c.size.id === currentSizeId)?.designUrl}
                    sizes={[sizeConfigurations.find(c => c.size.id === currentSizeId)!.size]}
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
                          {sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.cost}€
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Prix de vente</div>
                        <input
                          type="number"
                          value={sizeConfigurations.find(c => c.size.id === currentSizeId)?.price || 0}
                          onChange={(e) => currentSizeId && handlePriceChange(currentSizeId, Number(e.target.value))}
                          min={sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.cost}
                          step={1}
                          className={clsx(
                            'w-full px-3 py-2 text-2xl font-semibold border rounded-lg',
                            (sizeConfigurations.find(c => c.size.id === currentSizeId)?.price || 0) < (sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.cost || 0)
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          )}
                        />
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-1">Bénéfice</div>
                        <div className={clsx(
                          'text-2xl font-semibold',
                          (sizeConfigurations.find(c => c.size.id === currentSizeId)?.price || 0) < (sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.cost || 0) ? 'text-red-600' : 'text-green-600'
                        )}>
                          +{((sizeConfigurations.find(c => c.size.id === currentSizeId)?.price || 0) - (sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.cost || 0)).toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {(sizeConfigurations.find(c => c.size.id === currentSizeId)?.price || 0) < (sizeConfigurations.find(c => c.size.id === currentSizeId)?.size.cost || 0) && (
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