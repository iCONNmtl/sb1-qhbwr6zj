import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Copy, Check, ShoppingBag, Globe2, Tag, FileText, Layers, Image as ImageIcon, DollarSign, Info, Truck, Calendar, Clock, Package, Palette, Ruler, Users, Settings, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface ProductPlatformExportProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    type: string;
    title: string;
    designUrl: string;
    variants: Array<{
      sizeId: string;
      name: string;
      price: number;
      cost: number;
      sku: string;
      dimensions: {
        cm: string;
        inches: string;
      };
    }>;
    // Additional fields for platform exports
    etsy?: {
      title?: string;
      description?: string;
      tags?: string[];
      category?: string;
      materials?: string[];
      who_made?: string;
      when_made?: string;
      is_supply?: boolean;
      is_customizable?: boolean;
      is_digital?: boolean;
      shipping_profile_id?: string;
      processing_time?: string;
      production_partner_ids?: string[];
    };
    shopify?: {
      title?: string;
      body_html?: string;
      vendor?: string;
      product_type?: string;
      tags?: string[];
      status?: string;
      published?: boolean;
      options?: Array<{
        name: string;
        values: string[];
      }>;
      metafields?: Array<{
        key: string;
        value: string;
        type: string;
        namespace: string;
      }>;
      seo_title?: string;
      seo_description?: string;
    };
  };
}

type Platform = 'etsy' | 'shopify';

export default function ProductPlatformExport({ isOpen, onClose, product }: ProductPlatformExportProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>('etsy');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copié !`);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Generate product description based on the platform
  const getDescription = (platform: Platform) => {
    if (platform === 'etsy') {
      return product.etsy?.description || `Impression haute qualité sur papier premium ${product.type}.

Caractéristiques :
• Papier premium de haute qualité
• Impression haute définition
• Couleurs éclatantes et détails nets
• Disponible en plusieurs tailles

Tailles disponibles :
${product.variants.map(v => `• ${v.dimensions.inches} (${v.dimensions.cm})`).join('\n')}

Livraison :
• Expédition mondiale depuis nos centres d'impression locaux
• Emballage sécurisé dans un tube rigide pour protéger votre affiche
• Numéro de suivi fourni pour toutes les commandes
• Délai de traitement : 1-3 jours ouvrables
• Délai de livraison : 3-7 jours ouvrables (selon la destination)

Informations importantes :
• Les couleurs peuvent légèrement varier selon les paramètres de votre écran
• Cadre non inclus
• Imprimé à la demande spécialement pour vous

Politique de retour :
Si vous n'êtes pas satisfait de votre achat, contactez-nous dans les 14 jours suivant la réception pour un remboursement ou un échange.`;
    } else {
      return product.shopify?.body_html || `<h2>Impression haute qualité sur papier premium ${product.type}</h2>

<h3>Caractéristiques :</h3>
<ul>
  <li>Papier premium de haute qualité</li>
  <li>Impression haute définition</li>
  <li>Couleurs éclatantes et détails nets</li>
  <li>Disponible en plusieurs tailles</li>
</ul>

<h3>Tailles disponibles :</h3>
<ul>
  ${product.variants.map(v => `<li>${v.dimensions.inches} (${v.dimensions.cm})</li>`).join('\n  ')}
</ul>

<h3>Livraison :</h3>
<ul>
  <li>Expédition mondiale depuis nos centres d'impression locaux</li>
  <li>Emballage sécurisé dans un tube rigide pour protéger votre affiche</li>
  <li>Numéro de suivi fourni pour toutes les commandes</li>
  <li>Délai de traitement : 1-3 jours ouvrables</li>
  <li>Délai de livraison : 3-7 jours ouvrables (selon la destination)</li>
</ul>

<h3>Informations importantes :</h3>
<ul>
  <li>Les couleurs peuvent légèrement varier selon les paramètres de votre écran</li>
  <li>Cadre non inclus</li>
  <li>Imprimé à la demande spécialement pour vous</li>
</ul>

<h3>Politique de retour :</h3>
<p>Si vous n'êtes pas satisfait de votre achat, contactez-nous dans les 14 jours suivant la réception pour un remboursement ou un échange.</p>`;
    }
  };

  // Generate tags based on the platform
  const getTags = (platform: Platform) => {
    const defaultTags = ['poster', 'print', 'wall art', 'home decor', 'art print', 'decoration', 'wall decor', 'minimalist', 'modern art', 'gift idea', 'interior design'];
    
    if (platform === 'etsy') {
      return product.etsy?.tags?.join(', ') || defaultTags.join(', ');
    } else {
      return product.shopify?.tags?.join(', ') || defaultTags.join(', ');
    }
  };

  // Get Etsy category
  const getEtsyCategory = () => {
    return product.etsy?.category || 'Art & Collectibles > Prints > Digital Prints';
  };

  // Get Etsy materials
  const getEtsyMaterials = () => {
    return product.etsy?.materials?.join(', ') || 'paper, ink, art print, poster';
  };

  // Get Etsy who made
  const getEtsyWhoMade = () => {
    return product.etsy?.who_made || 'i_did';
  };

  // Get Etsy when made
  const getEtsyWhenMade = () => {
    return product.etsy?.when_made || 'made_to_order';
  };

  // Get Etsy processing time
  const getEtsyProcessingTime = () => {
    return product.etsy?.processing_time || '1_3_business_days';
  };

  // Get Shopify product type
  const getShopifyProductType = () => {
    return product.shopify?.product_type || 'Poster';
  };

  // Get Shopify vendor
  const getShopifyVendor = () => {
    return product.shopify?.vendor || 'Your Brand';
  };

  // Get Shopify SEO title
  const getShopifySeoTitle = () => {
    return product.shopify?.seo_title || product.title || product.type;
  };

  // Get Shopify SEO description
  const getShopifySeoDescription = () => {
    return product.shopify?.seo_description || `Découvrez notre ${product.title || product.type} de haute qualité. Impression premium disponible en plusieurs tailles.`;
  };

  const CopyButton = ({ text, fieldName }: { text: string; fieldName: string }) => (
    <button
      onClick={() => handleCopy(text, fieldName)}
      className={clsx(
        'p-2 rounded-lg transition-colors',
        copiedField === fieldName
          ? 'bg-green-100 text-green-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      )}
      title={copiedField === fieldName ? 'Copié !' : 'Copier'}
    >
      {copiedField === fieldName ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );

  const FieldSection = ({ 
    icon, 
    title, 
    content, 
    fieldName,
    isCode = false,
    isMultiline = false
  }: { 
    icon: React.ElementType; 
    title: string; 
    content: string; 
    fieldName: string;
    isCode?: boolean;
    isMultiline?: boolean;
  }) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          <CopyButton text={content} fieldName={fieldName} />
        </div>
        <div className={clsx("p-4 bg-gray-50", isMultiline && "max-h-60 overflow-y-auto")}>
          {isCode ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {content}
            </pre>
          ) : isMultiline ? (
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {content}
            </div>
          ) : (
            <p className="text-gray-700">{content}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Globe2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Exporter vers les plateformes
                </h2>
                <p className="text-sm text-gray-500">
                  {product.title || product.type}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActivePlatform('etsy')}
              className={clsx(
                'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activePlatform === 'etsy'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Etsy
            </button>
            <button
              onClick={() => setActivePlatform('shopify')}
              className={clsx(
                'flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activePlatform === 'shopify'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shopify
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Product Preview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.designUrl}
                    alt={product.title || product.type}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.title || product.type}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>{' '}
                      <span className="font-medium text-gray-900">{product.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Variantes:</span>{' '}
                      <span className="font-medium text-gray-900">{product.variants.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prix:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {Math.min(...product.variants.map(v => v.price))}€ - {Math.max(...product.variants.map(v => v.price))}€
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Bénéfice moyen:</span>{' '}
                      <span className="font-medium text-green-600">
                        +{(product.variants.reduce((sum, v) => sum + (v.price - v.cost), 0) / product.variants.length).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform-specific fields */}
            <div className="space-y-6">
              {activePlatform === 'etsy' ? (
                // Etsy Fields
                <>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-orange-800 mb-1">Informations importantes pour Etsy</h3>
                        <p className="text-sm text-orange-700">
                          Tous les champs ci-dessous sont nécessaires pour créer une fiche produit complète sur Etsy. 
                          Assurez-vous de copier tous les champs et de les remplir dans votre boutique Etsy.
                        </p>
                      </div>
                    </div>
                  </div>

                  <FieldSection 
                    icon={FileText} 
                    title="Titre" 
                    content={product.title || product.type} 
                    fieldName="etsy-title" 
                  />
                  
                  <FieldSection 
                    icon={FileText} 
                    title="Description" 
                    content={getDescription('etsy')} 
                    fieldName="etsy-description" 
                    isMultiline={true}
                  />
                  
                  <FieldSection 
                    icon={Tag} 
                    title="Tags" 
                    content={getTags('etsy')} 
                    fieldName="etsy-tags" 
                  />
                  
                  <FieldSection 
                    icon={Layers} 
                    title="Catégorie" 
                    content={getEtsyCategory()} 
                    fieldName="etsy-category" 
                  />
                  
                  <FieldSection 
                    icon={Palette} 
                    title="Matériaux" 
                    content={getEtsyMaterials()} 
                    fieldName="etsy-materials" 
                  />
                  
                  <FieldSection 
                    icon={Users} 
                    title="Qui l'a fabriqué" 
                    content={getEtsyWhoMade()} 
                    fieldName="etsy-who-made" 
                  />
                  
                  <FieldSection 
                    icon={Calendar} 
                    title="Quand c'est fabriqué" 
                    content={getEtsyWhenMade()} 
                    fieldName="etsy-when-made" 
                  />
                  
                  <FieldSection 
                    icon={Clock} 
                    title="Délai de traitement" 
                    content={getEtsyProcessingTime()} 
                    fieldName="etsy-processing-time" 
                  />

                  {/* Variants Table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Layers className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">Variantes</span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Taille
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dimensions
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SKU
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prix
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {product.variants.map((variant, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {variant.dimensions.inches}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {variant.dimensions.cm}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-mono text-gray-500">
                                  {variant.sku}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {variant.price}€
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <CopyButton 
                                    text={`${variant.dimensions.inches} (${variant.dimensions.cm})`} 
                                    fieldName={`etsy-size-${index}`} 
                                  />
                                  <CopyButton 
                                    text={variant.sku} 
                                    fieldName={`etsy-sku-${index}`} 
                                  />
                                  <CopyButton 
                                    text={variant.price.toString()} 
                                    fieldName={`etsy-price-${index}`} 
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Truck className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">Informations d'expédition</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Profil d'expédition recommandé</h4>
                          <p className="text-sm text-gray-700">
                            Créez un profil d'expédition avec les paramètres suivants :
                          </p>
                          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-700">
                            <li>Origine : Votre pays</li>
                            <li>Destinations : Mondiale</li>
                            <li>Délai de traitement : 1-3 jours ouvrables</li>
                            <li>Frais d'expédition : Basés sur le pays de destination</li>
                            <li>Poids du colis : 200-500g selon la taille</li>
                            <li>Dimensions du colis : Tube d'expédition (60-100cm de long, 8cm de diamètre)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Tarifs d'expédition recommandés</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Europe</p>
                              <p className="text-gray-600">5,90€ - 9,90€</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Amérique du Nord</p>
                              <p className="text-gray-600">12,90€ - 19,90€</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Reste du monde</p>
                              <p className="text-gray-600">15,90€ - 24,90€</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Shopify Fields
                <>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-800 mb-1">Informations importantes pour Shopify</h3>
                        <p className="text-sm text-green-700">
                          Tous les champs ci-dessous sont nécessaires pour créer une fiche produit complète sur Shopify. 
                          Vous pouvez également utiliser notre export CSV pour importer tous vos produits en une seule fois.
                        </p>
                      </div>
                    </div>
                  </div>

                  <FieldSection 
                    icon={FileText} 
                    title="Titre" 
                    content={product.title || product.type} 
                    fieldName="shopify-title" 
                  />
                  
                  <FieldSection 
                    icon={FileText} 
                    title="Description (HTML)" 
                    content={getDescription('shopify')} 
                    fieldName="shopify-description" 
                    isCode={true}
                    isMultiline={true}
                  />
                  
                  <FieldSection 
                    icon={Tag} 
                    title="Tags" 
                    content={getTags('shopify')} 
                    fieldName="shopify-tags" 
                  />
                  
                  <FieldSection 
                    icon={ShoppingBag} 
                    title="Type de produit" 
                    content={getShopifyProductType()} 
                    fieldName="shopify-product-type" 
                  />
                  
                  <FieldSection 
                    icon={Users} 
                    title="Vendeur" 
                    content={getShopifyVendor()} 
                    fieldName="shopify-vendor" 
                  />
                  
                  <FieldSection 
                    icon={Settings} 
                    title="Titre SEO" 
                    content={getShopifySeoTitle()} 
                    fieldName="shopify-seo-title" 
                  />
                  
                  <FieldSection 
                    icon={Settings} 
                    title="Description SEO" 
                    content={getShopifySeoDescription()} 
                    fieldName="shopify-seo-description" 
                  />

                  {/* Variants Table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Layers className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">Variantes</span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Taille
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dimensions
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              SKU
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prix
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Poids (g)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {product.variants.map((variant, index) => {
                            // Calculate approximate weight based on size
                            const getWeight = (sizeId: string) => {
                              const weights: Record<string, number> = {
                                '5x7': 50,
                                '8x10': 100,
                                '8x12': 120,
                                '11x14': 150,
                                '11x17': 180,
                                '12x18': 200,
                                'A4': 120,
                                '18x24': 300,
                                '20x28': 350,
                                '24x36': 450,
                                '28x40': 550
                              };
                              return weights[sizeId] || 200;
                            };
                            
                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {variant.dimensions.inches}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {variant.dimensions.cm}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-mono text-gray-500">
                                    {variant.sku}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {variant.price}€
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {getWeight(variant.sizeId)}g
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <CopyButton 
                                      text={`${variant.dimensions.inches} (${variant.dimensions.cm})`} 
                                      fieldName={`shopify-size-${index}`} 
                                    />
                                    <CopyButton 
                                      text={variant.sku} 
                                      fieldName={`shopify-sku-${index}`} 
                                    />
                                    <CopyButton 
                                      text={variant.price.toString()} 
                                      fieldName={`shopify-price-${index}`} 
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Truck className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">Informations d'expédition</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Configuration recommandée</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li>Créez une zone d'expédition pour chaque continent</li>
                            <li>Définissez des tarifs basés sur le poids</li>
                            <li>Poids des produits : 50g à 550g selon la taille</li>
                            <li>Dimensions du colis : Tube d'expédition (60-100cm de long, 8cm de diamètre)</li>
                            <li>Délai de traitement : 1-3 jours ouvrables</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Tarifs d'expédition recommandés</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Europe</p>
                              <p className="text-gray-600">5,90€ - 9,90€</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Amérique du Nord</p>
                              <p className="text-gray-600">12,90€ - 19,90€</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Reste du monde</p>
                              <p className="text-gray-600">15,90€ - 24,90€</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CSV Export Info */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <h3 className="font-medium text-green-800 mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Export CSV pour Shopify
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                      Pour importer facilement tous vos produits dans Shopify, vous pouvez utiliser notre fonctionnalité d'export CSV depuis la page "Paramètres &gt; Plateformes".
                    </p>
                    <div className="flex justify-end">
                      <Link to="/settings" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        <FileText className="h-4 w-4 mr-2" />
                        Aller à l'export CSV
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {/* Platform-specific instructions */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h3 className="flex items-center text-lg font-semibold text-indigo-900 mb-4">
                  <Info className="h-5 w-5 mr-2" />
                  Instructions pour {activePlatform === 'etsy' ? 'Etsy' : 'Shopify'}
                </h3>
                
                {activePlatform === 'etsy' ? (
                  <div className="space-y-4">
                    <p className="text-indigo-800">
                      Pour créer une fiche produit sur Etsy, suivez ces étapes :
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-indigo-800">
                      <li>Connectez-vous à votre compte Etsy et accédez à votre tableau de bord vendeur</li>
                      <li>Cliquez sur "Ajouter un article" dans le menu principal</li>
                      <li>Copiez et collez le titre, la description et les tags dans les champs correspondants</li>
                      <li>Sélectionnez la catégorie exacte indiquée ci-dessus</li>
                      <li>Ajoutez votre image de design comme première photo (ajoutez également des mockups comme photos supplémentaires)</li>
                      <li>Dans la section "Inventaire et prix", sélectionnez "Cet article a des variantes"</li>
                      <li>Créez une option "Taille" et ajoutez toutes les tailles disponibles</li>
                      <li>Définissez les prix pour chaque variante</li>
                      <li>Ajoutez les SKU pour chaque variante</li>
                      <li>Dans la section "À propos de cet article", remplissez les champs "Qui l'a fabriqué", "Quand a-t-il été fabriqué" et "Matériaux"</li>
                      <li>Configurez les options d'expédition selon les recommandations ci-dessus</li>
                      <li>Définissez le délai de traitement à 1-3 jours ouvrables</li>
                      <li>Vérifiez toutes les informations et publiez votre annonce</li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-indigo-800">
                      Pour créer une fiche produit sur Shopify, suivez ces étapes :
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-indigo-800">
                      <li>Connectez-vous à votre boutique Shopify et accédez à "Produits"</li>
                      <li>Cliquez sur "Ajouter un produit"</li>
                      <li>Copiez et collez le titre dans le champ "Titre"</li>
                      <li>Copiez et collez la description HTML dans l'éditeur de description (assurez-vous d'être en mode HTML)</li>
                      <li>Ajoutez les tags séparés par des virgules</li>
                      <li>Remplissez les champs "Type de produit" et "Vendeur"</li>
                      <li>Ajoutez votre image de design et vos mockups</li>
                      <li>Sous "Options", créez une option "Taille" avec les différentes dimensions</li>
                      <li>Pour chaque variante, définissez le prix, le SKU et le poids</li>
                      <li>Configurez l'inventaire (généralement "Suivre la quantité" désactivé pour l'impression à la demande)</li>
                      <li>Dans "Expédition", cochez "Ce produit nécessite une expédition" et définissez le poids pour chaque variante</li>
                      <li>Dans "SEO", ajoutez le titre SEO et la description SEO</li>
                      <li>Cliquez sur "Enregistrer"</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}