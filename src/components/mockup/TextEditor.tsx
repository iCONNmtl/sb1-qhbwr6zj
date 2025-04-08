import React, { useState, useEffect } from 'react';
import { Plus, Type, Save, Image, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import TextPreview from './TextPreview';
import TextLayerEditor from './TextLayerEditor';
import ImageLayerEditor from './ImageLayerEditor';
import TextTemplateSelector from './TextTemplateSelector';
import SaveTemplateDialog from './SaveTemplateDialog';
import MockupCustomizationSelector from './MockupCustomizationSelector';
import { getUserTemplates } from '../../services/templateService';
import { generateTextOverlayHtml, generateImageOverlayHtml, combineTextLayers } from '../../utils/textOverlay';
import type { Mockup, TextLayer, ImageLayer } from '../../types/mockup';
import type { PreviewFormat } from './PreviewFormatSelector';
import type { TextTemplate } from '../../types/textTemplate';

interface TextEditorProps {
  selectedMockups: Mockup[];
  onGenerateHtml: (html: string) => void;
  onCustomizedMockupsChange?: (mockups: number[]) => void;
  userId?: string;
  userLogo?: string;
}

export default function TextEditor({ 
  selectedMockups, 
  onGenerateHtml,
  onCustomizedMockupsChange,
  userId,
  userLogo
}: TextEditorProps) {
  const [layers, setLayers] = useState<(TextLayer | ImageLayer)[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [customizedMockups, setCustomizedMockups] = useState<number[]>([1]);
  const [format, setFormat] = useState<PreviewFormat>('original');
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const [gridConfig, setGridConfig] = useState({ width: 0, marginLeft: 0 });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [userTemplates, setUserTemplates] = useState<TextTemplate[]>([]);
  const [previewWidth, setPreviewWidth] = useState(0);

  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);

  useEffect(() => {
    const loadUserTemplates = async () => {
      if (!userId) return;
      
      try {
        const templates = await getUserTemplates(userId);
        setUserTemplates(templates);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };

    loadUserTemplates();
  }, [userId]);

  useEffect(() => {
    const layersHtml = layers.map(layer => {
      if (layer.type === 'text') {
        return generateTextOverlayHtml({
          text: layer.text,
          style: layer.style,
          position: layer.position
        });
      } else {
        return generateImageOverlayHtml({
          url: layer.url,
          style: layer.style,
          position: layer.position
        });
      }
    });
    
    const combinedHtml = combineTextLayers(
      layersHtml, 
      format,
      cropPosition,
      previewWidth
    );
    onGenerateHtml(combinedHtml);
  }, [layers, format, cropPosition, onGenerateHtml, previewWidth]);

  useEffect(() => {
    onCustomizedMockupsChange?.(customizedMockups);
  }, [customizedMockups, onCustomizedMockupsChange]);

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: nanoid(),
      type: 'text',
      text: 'Nouveau texte',
      style: { ...DEFAULT_TEXT_STYLE },
      position: { x: 50, y: 50 }
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const addImageLayer = () => {
    if (!userLogo) {
      toast.error('Veuillez d\'abord ajouter un logo dans les paramètres');
      return;
    }

    const newLayer: ImageLayer = {
      id: nanoid(),
      type: 'image',
      url: userLogo,
      style: { ...DEFAULT_IMAGE_STYLE },
      position: { x: 50, y: 50 }
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<TextLayer | ImageLayer>) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id 
          ? { ...layer, ...updates }
          : layer
      )
    );
  };

  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleCustomizedMockupsChange = (mockups: number[]) => {
    setCustomizedMockups(mockups);
  };

  const handleSaveTemplate = () => {
    if (!userId) {
      toast.error('Vous devez être connecté pour sauvegarder un template');
      return;
    }
    setShowSaveDialog(true);
  };

  const handleTemplateSelect = (template: TextTemplate) => {
    const newLayers = template.layers.map(layer => {
      const baseLayer = {
        id: nanoid(),
        position: layer.position
      };

      if (layer.type === 'text') {
        return {
          ...baseLayer,
          type: 'text' as const,
          text: layer.text,
          style: layer.style
        };
      } else {
        return {
          ...baseLayer,
          type: 'image' as const,
          url: layer.url,
          style: layer.style
        };
      }
    });
    setLayers(prev => [...prev, ...newLayers]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column: Layer Controls */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={addTextLayer}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Type className="h-5 w-5 mr-2" />
                Ajouter du texte
              </button>

              <button
                onClick={addImageLayer}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Image className="h-5 w-5 mr-2" />
                Ajouter le logo
              </button>
            </div>

            {layers.length > 0 && (
              <button
                onClick={handleSaveTemplate}
                className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 border border-indigo-600 hover:bg-indigo-100 rounded-lg transition"
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Calques
            </h3>

            {layers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Aucun calque
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {layers.map(layer => (
                  <div
                    key={layer.id}
                    className={clsx(
                      'flex items-center justify-between p-3 rounded-lg cursor-pointer transition',
                      selectedLayerId === layer.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div 
                      className="flex items-center space-x-3 flex-1"
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      {layer.type === 'text' ? (
                        <Type className="h-5 w-5" />
                      ) : (
                        <Image className="h-5 w-5" />
                      )}
                      <span className="font-medium truncate max-w-[150px]">
                        {layer.type === 'text' ? layer.text : 'Logo'}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteLayer(layer.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedLayer && (
              <div className="border-t border-gray-200 pt-6">
                {selectedLayer.type === 'text' ? (
                  <TextLayerEditor
                    layer={selectedLayer}
                    onUpdate={(updates) => updateLayer(selectedLayer.id, updates)}
                    onDelete={() => deleteLayer(selectedLayer.id)}
                  />
                ) : (
                  <ImageLayerEditor
                    layer={selectedLayer}
                    onUpdate={(updates) => updateLayer(selectedLayer.id, updates)}
                    onDelete={() => deleteLayer(selectedLayer.id)}
                  />
                )}
              </div>
            )}
          </div>

          <TextTemplateSelector
            onSelect={handleTemplateSelect}
            userTemplates={userTemplates}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-6">
          <TextPreview
            mockups={selectedMockups}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdatePosition={(id, updates) => updateLayer(id, updates)}
            format={format}
            onFormatChange={setFormat}
            cropPosition={cropPosition}
            onCropPositionChange={setCropPosition}
            cropSize={cropSize}
            onCropSizeChange={setCropSize}
            onGridConfigChange={setGridConfig}
            onPreviewWidthChange={setPreviewWidth}
          />

          <MockupCustomizationSelector
            totalMockups={selectedMockups.length}
            selectedMockups={customizedMockups}
            onChange={handleCustomizedMockupsChange}
          />
        </div>
      </div>

      {showSaveDialog && userId && (
        <SaveTemplateDialog
          userId={userId}
          layers={layers}
          onClose={() => setShowSaveDialog(false)}
          onSuccess={() => {
            getUserTemplates(userId).then(setUserTemplates);
          }}
        />
      )}
    </div>
  );
}

const DEFAULT_TEXT_STYLE = {
  fontSize: '24px',
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
  color: '#000000',
  fontFamily: 'Roboto',
  textAlign: 'left' as const
};

const DEFAULT_IMAGE_STYLE = {
  width: '100px',
  opacity: '1'
};