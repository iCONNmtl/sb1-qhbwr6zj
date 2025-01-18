import React, { useState, useEffect } from 'react';
import { Plus, Type, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import TextPreview from './TextPreview';
import TextLayerEditor from './TextLayerEditor';
import TextTemplateSelector from './TextTemplateSelector';
import MockupCustomizationSelector from './MockupCustomizationSelector';
import { generateTextOverlayHtml, generateCropHtml, combineTextLayers } from '../../utils/textOverlay';
import type { Mockup } from '../../types/mockup';
import type { TextLayer } from '../../types/textLayer';
import type { PreviewFormat } from './PreviewFormatSelector';

interface TextEditorProps {
  selectedMockups: Mockup[];
  onGenerateHtml: (html: string) => void;
  onCustomizedMockupsChange?: (mockups: number[]) => void;
}

const DEFAULT_STYLE = {
  fontSize: '24px',
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
  color: '#000000',
  fontFamily: 'Roboto',
  textAlign: 'left' as const
};

export default function TextEditor({ 
  selectedMockups, 
  onGenerateHtml,
  onCustomizedMockupsChange 
}: TextEditorProps) {
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [customizedMockups, setCustomizedMockups] = useState<number[]>([1]);
  const [format, setFormat] = useState<PreviewFormat>('original');
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const [gridConfig, setGridConfig] = useState({ width: 0, marginLeft: 0 });

  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId);

  useEffect(() => {
    const layersHtml = textLayers.map(layer => 
      generateTextOverlayHtml({
        text: layer.text,
        style: layer.style,
        position: layer.position
      })
    );
    
    const combinedHtml = combineTextLayers(layersHtml, format, cropPosition);
    onGenerateHtml(combinedHtml);
  }, [textLayers, format, cropPosition, onGenerateHtml]);

  useEffect(() => {
    onCustomizedMockupsChange?.(customizedMockups);
  }, [customizedMockups, onCustomizedMockupsChange]);

  const addLayer = () => {
    const newLayer: TextLayer = {
      id: nanoid(),
      text: 'Nouveau texte',
      style: { ...DEFAULT_STYLE },
      position: { x: 50, y: 50 }
    };
    setTextLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(prev => 
      prev.map(layer => 
        layer.id === id 
          ? { ...layer, ...updates }
          : layer
      )
    );
  };

  const deleteLayer = (id: string) => {
    setTextLayers(prev => prev.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleCustomizedMockupsChange = (mockups: number[]) => {
    setCustomizedMockups(mockups);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column: Text Controls */}
        <div className="space-y-6">
          <button
            onClick={addLayer}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter du texte
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Calques de texte
            </h3>

            {textLayers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Aucun calque de texte
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {textLayers.map(layer => (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={clsx(
                      'flex items-center justify-between p-3 rounded-lg cursor-pointer transition',
                      selectedLayerId === layer.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Type className="h-5 w-5" />
                      <span className="font-medium truncate max-w-[150px]">
                        {layer.text}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedLayer && (
              <div className="border-t border-gray-200 pt-6">
                <TextLayerEditor
                  layer={selectedLayer}
                  onUpdate={(updates) => updateLayer(selectedLayer.id, updates)}
                  onDelete={() => deleteLayer(selectedLayer.id)}
                />
              </div>
            )}
          </div>

          <TextTemplateSelector
            onSelect={(template) => {
              const newLayers = template.layers.map(layer => ({
                ...layer,
                id: nanoid()
              }));
              setTextLayers(prev => [...prev, ...newLayers]);
            }}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-6">
          <TextPreview
            mockups={selectedMockups}
            textLayers={textLayers}
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
          />

          <MockupCustomizationSelector
            totalMockups={selectedMockups.length}
            selectedMockups={customizedMockups}
            onChange={handleCustomizedMockupsChange}
          />
        </div>
      </div>
    </div>
  );
}