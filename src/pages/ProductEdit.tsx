import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Save, Loader2, Package, Info } from 'lucide-react';
import DesignSelector from '../components/DesignSelector';
import DesignEditor from '../components/product/DesignEditor';
import toast from 'react-hot-toast';
import clsx from 'clsx';

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
      inches: '8.3x11.7',
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
  'poster-mat': 'Poster Mat Premium',
  'poster-glossy': 'Poster Brillant Premium',
  'poster-frame': 'Poster Encadré'
} as const;

interface Product {
  id: string;
  type: keyof typeof PRODUCT_TYPES;
  designUrl: string;
  variants: {
    sizeId: string;
    cost: number;
    suggestedPrice: number;
    sku: string;
    adjustments?: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  }[];
  createdAt: string;
}

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [designUrl, setDesignUrl] = useState<string>();
  const [selectedVariants, setSelectedVariants] = useState<{
    size: Size;
    selected: boolean;
  }[]>([]);
  const [designAdjustments, setDesignAdjustments] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (!productDoc.exists()) {
          toast.error('Produit non trouvé');
          navigate('/my-products');
          return;
        }

        const productData = productDoc.data() as Product;
        setProduct(productData);
        setDesignUrl(productData.designUrl);

        // Initialize variants
        setSelectedVariants(
          SIZES.map(size => ({
            size,
            selected: productData.variants.some(v => v.sizeId === size.id)
          }))
        );

        // Initialize adjustments
        const adjustments: Record<string, any> = {};
        productData.variants.forEach(variant => {
          if (variant.adjustments) {
            adjustments[variant.sizeId] = variant.adjustments;
          }
        });
        setDesignAdjustments(adjustments);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!product || !id) return;

    setSaving(true);
    try {
      const selectedSizes = selectedVariants.filter(v => v.selected);
      if (selectedSizes.length === 0) {
        throw new Error('Veuillez sélectionner au moins une taille');
      }

      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        designUrl: designUrl || product.designUrl,
        variants: selectedSizes.map(variant => ({
          sizeId: variant.size.id,
          cost: variant.size.cost,
          suggestedPrice: variant.size.suggestedPrice,
          sku: `${product.id}-${variant.size.id}`,
          adjustments: designAdjustments[variant.size.id] || {
            scale: 1,
            position: { x: 0, y: 0 },
            rotation: 0
          }
        }))
      });

      toast.success('Produit mis à jour avec succès');
      navigate('/my-products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du produit');
    } finally {
      setSaving(false);
    }
  };

  const toggleVariant = (index: number) => {
    setSelectedVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, selected: !variant.selected } : variant
    ));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-500">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Produit non trouvé</p>
        </div>
      </div>
    );
  }

  const selectedSizes = selectedVariants
    .filter(v => v.selected)
    .map(v => v.size);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier le produit
          </h1>
          <p className="text-gray-600 mt-1">
            {PRODUCT_TYPES[product.type]}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !selectedVariants.some(v => v.selected)}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? (
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

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <DesignSelector 
            userId={product.id}
            onSelect={setDesignUrl}
            selectedUrl={designUrl}
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
                initialAdjustments={designAdjustments}
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
                            <div className="space-y-1">
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