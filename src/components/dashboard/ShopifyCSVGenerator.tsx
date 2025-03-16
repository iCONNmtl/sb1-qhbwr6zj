import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShopifyCSVGeneratorProps {
  selectedMockups: string[];
  mockupData: Array<{
    id: string;
    name: string;
    url: string;
    platform?: string;
  }>;
  selectedProduct?: {
    id: string;
    type: string;
    variants: Array<{
      sizeId: string;
      name: string;
      price: number;
      sku: string;
      dimensions: {
        cm: string;
        inches: string;
      };
    }>;
  } | null;
}

export default function ShopifyCSVGenerator({ selectedMockups, mockupData, selectedProduct }: ShopifyCSVGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const generateCSV = async () => {
    if (!selectedProduct || selectedMockups.length === 0) {
      toast.error('Veuillez sélectionner un produit et des mockups');
      return;
    }

    setLoading(true);
    try {
      // CSV Headers
      const headers = [
        'Handle',
        'Title',
        'Body (HTML)',
        'Vendor',
        'Product Category',
        'Type',
        'Tags',
        'Published',
        'Option1 Name',
        'Option1 Value',
        'Variant SKU',
        'Variant Price',
        'Variant Compare At Price',
        'Variant Requires Shipping',
        'Variant Taxable',
        'Variant Image',
        'Status'
      ].join(',');

      // Get selected mockup URLs
      const selectedMockupUrls = mockupData
        .filter(mockup => selectedMockups.includes(mockup.id))
        .map(mockup => mockup.url);

      // Generate CSV rows
      const rows = selectedProduct.variants.map((variant, index) => {
        const mockupUrl = selectedMockupUrls[index % selectedMockupUrls.length]; // Cycle through mockups if more variants than mockups
        const handle = selectedProduct.type.toLowerCase().replace(/\s+/g, '-');
        
        const row = [
          handle, // Handle
          selectedProduct.type, // Title
          `Impression haute qualité sur papier premium - Format ${variant.dimensions.cm}`, // Body
          'MockupPro', // Vendor
          'Art & Entertainment > Hobbies & Creative Arts > Art', // Product Category
          'Poster', // Type
          'poster,art,print,wall-art', // Tags
          'TRUE', // Published
          'Size', // Option1 Name
          `${variant.dimensions.inches} (${variant.dimensions.cm})`, // Option1 Value
          variant.sku, // Variant SKU
          variant.price, // Variant Price
          '', // Compare At Price
          'TRUE', // Requires Shipping
          'TRUE', // Taxable
          mockupUrl, // Variant Image
          'active' // Status
        ].map(field => `"${field}"`).join(',');
        
        return row;
      });

      // Combine headers and rows
      const csv = [headers, ...rows].join('\n');

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `shopify-product-${selectedProduct.id}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success('CSV généré avec succès');
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast.error('Erreur lors de la génération du CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generateCSV}
      disabled={loading || !selectedProduct || selectedMockups.length === 0}
      className="flex items-center px-4 py-2 bg-[#96BF47] text-white rounded-lg hover:bg-[#7EA83E] transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Génération...
        </>
      ) : (
        <>
          <FileDown className="h-5 w-5 mr-2" />
          Générer CSV Shopify
        </>
      )}
    </button>
  );
}