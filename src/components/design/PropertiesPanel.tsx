import React, { useState } from 'react';
import { Type, Square, Circle, ImageIcon, Palette, Plus, Minus, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Upload, Lock, Unlock, Eye, EyeOff, Copy, Trash2, Triangle, Star, Hexagon, Crown, Settings } from 'lucide-react';
import clsx from 'clsx';
import { DesignState, DesignElement, TextElement, ShapeElement, ImageElement } from '../../types/design';
import ColorPicker from './ColorPicker';

interface PropertiesPanelProps {
  state: DesignState;
  selectedElement: DesignElement | null;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteSelectedElement: () => void;
  duplicateSelectedElement: () => void;
  toggleElementLock: (id: string) => void;
  toggleElementVisibility: (id: string) => void;
  addTextElement: () => void;
  addShapeElement: (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon') => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  showBackgroundColorPicker: boolean;
  setShowBackgroundColorPicker: (show: boolean) => void;
  showBorderColorPicker: boolean;
  setShowBorderColorPicker: (show: boolean) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  state,
  selectedElement,
  updateElement,
  deleteSelectedElement,
  duplicateSelectedElement,
  toggleElementLock,
  toggleElementVisibility,
  addTextElement,
  addShapeElement,
  fileInputRef,
  showColorPicker,
  setShowColorPicker,
  showBackgroundColorPicker,
  setShowBackgroundColorPicker,
  showBorderColorPicker,
  setShowBorderColorPicker
}) => {
  // Text alignment options
  const TEXT_ALIGNMENTS = [
    { value: 'left', label: 'Gauche', icon: AlignLeft },
    { value: 'center', label: 'Centre', icon: AlignCenter },
    { value: 'right', label: 'Droite', icon: AlignRight }
  ];

  // Object fit options
  const OBJECT_FIT_OPTIONS = [
    { value: 'cover', label: 'Couvrir' },
    { value: 'contain', label: 'Contenir' }
  ];

  // Font families
  const FONT_FAMILIES = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Tahoma',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Playfair Display'
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-indigo-600" />
        Propriétés
      </h3>
      
      {selectedElement ? (
        <div className="space-y-6">
          {/* Element Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={selectedElement.name}
              onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Position and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position X
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Y
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largeur
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hauteur
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rotation ({selectedElement.rotation}°)
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={selectedElement.rotation}
              onChange={(e) => updateElement(selectedElement.id, { rotation: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          
          {/* Text Properties */}
          {selectedElement.type === 'text' && (
            <TextProperties 
              element={selectedElement as TextElement}
              updateElement={updateElement}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
              showBackgroundColorPicker={showBackgroundColorPicker}
              setShowBackgroundColorPicker={setShowBackgroundColorPicker}
              textAlignments={TEXT_ALIGNMENTS}
              colorPresets={state.colorPresets}
              fontFamilies={FONT_FAMILIES}
            />
          )}
          
          {/* Shape Properties */}
          {selectedElement.type === 'shape' && (
            <ShapeProperties 
              element={selectedElement as ShapeElement}
              updateElement={updateElement}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
              showBorderColorPicker={showBorderColorPicker}
              setShowBorderColorPicker={setShowBorderColorPicker}
              colorPresets={state.colorPresets}
            />
          )}
          
          {/* Image Properties */}
          {selectedElement.type === 'image' && (
            <ImageProperties 
              element={selectedElement as ImageElement}
              updateElement={updateElement}
              fileInputRef={fileInputRef}
              objectFitOptions={OBJECT_FIT_OPTIONS}
            />
          )}
          
          {/* Common Element Controls */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleElementLock(selectedElement.id)}
                className={clsx(
                  "flex items-center px-3 py-1.5 rounded-lg transition-colors",
                  selectedElement.locked 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {selectedElement.locked ? (
                  <>
                    <Unlock className="h-4 w-4 mr-1" />
                    Déverrouiller
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-1" />
                    Verrouiller
                  </>
                )}
              </button>
              
              <button
                onClick={() => toggleElementVisibility(selectedElement.id)}
                className={clsx(
                  "flex items-center px-3 py-1.5 rounded-lg transition-colors",
                  !selectedElement.visible 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {selectedElement.visible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Masquer
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Afficher
                  </>
                )}
              </button>
              
              <button
                onClick={duplicateSelectedElement}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Copy className="h-4 w-4 mr-1" />
                Dupliquer
              </button>
              
              <button
                onClick={deleteSelectedElement}
                className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-600 text-center mb-4">
            Sélectionnez un élément pour modifier ses propriétés
          </p>
        </div>
      )}
    </div>
  );
};

// Text Properties Component
interface TextPropertiesProps {
  element: TextElement;
  updateElement: (id: string, updates: Partial<TextElement>) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  showBackgroundColorPicker: boolean;
  setShowBackgroundColorPicker: (show: boolean) => void;
  textAlignments: { value: string; label: string; icon: React.ElementType }[];
  colorPresets: string[];
  fontFamilies: string[];
}

const TextProperties: React.FC<TextPropertiesProps> = ({
  element,
  updateElement,
  showColorPicker,
  setShowColorPicker,
  showBackgroundColorPicker,
  setShowBackgroundColorPicker,
  textAlignments,
  colorPresets,
  fontFamilies
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-900">Propriétés du texte</h3>
      
      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contenu
        </label>
        <textarea
          value={element.content}
          onChange={(e) => updateElement(element.id, { content: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Police
        </label>
        <select
          value={element.fontFamily}
          onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>
      
      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Taille ({element.fontSize}px)
        </label>
        <div className="flex items-center">
          <button
            onClick={() => updateElement(element.id, { fontSize: Math.max(8, element.fontSize - 1) })}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-l-lg transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="range"
            min="8"
            max="72"
            value={element.fontSize}
            onChange={(e) => updateElement(element.id, { fontSize: Number(e.target.value) })}
            className="flex-1 mx-2"
          />
          <button
            onClick={() => updateElement(element.id, { fontSize: Math.min(72, element.fontSize + 1) })}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => updateElement(element.id, { fontSize: 12 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.fontSize === 12 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            12px
          </button>
          <button 
            onClick={() => updateElement(element.id, { fontSize: 16 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.fontSize === 16 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            16px
          </button>
          <button 
            onClick={() => updateElement(element.id, { fontSize: 24 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.fontSize === 24 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            24px
          </button>
          <button 
            onClick={() => updateElement(element.id, { fontSize: 36 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.fontSize === 36 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            36px
          </button>
          <button 
            onClick={() => updateElement(element.id, { fontSize: 48 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.fontSize === 48 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            48px
          </button>
        </div>
      </div>
      
      {/* Text Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style
        </label>
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => updateElement(element.id, { 
              fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' 
            })}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              element.fontWeight === 'bold' 
                ? "bg-indigo-100 text-indigo-600" 
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="Gras"
          >
            <Bold className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => updateElement(element.id, { 
              fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' 
            })}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              element.fontStyle === 'italic'
                ? "bg-indigo-100 text-indigo-600"
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="Italique"
          >
            <Italic className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => updateElement(element.id, { 
              textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' 
            })}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              element.textDecoration === 'underline'
                ? "bg-indigo-100 text-indigo-600"
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="Souligné"
          >
            <Underline className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alignement
        </label>
        <div className="flex space-x-2">
          {textAlignments.map(alignment => {
            const Icon = alignment.icon;
            return (
              <button
                key={alignment.value}
                onClick={() => updateElement(element.id, { 
                  textAlign: alignment.value as 'left' | 'center' | 'right'
                })}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  element.textAlign === alignment.value 
                    ? "bg-indigo-100 text-indigo-600" 
                    : "hover:bg-gray-100 text-gray-600"
                )}
                title={alignment.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur du texte
        </label>
        <ColorPicker
          color={element.color}
          onChange={(color) => updateElement(element.id, { color })}
          showPicker={showColorPicker}
          setShowPicker={setShowColorPicker}
          colorPresets={colorPresets}
        />
      </div>
      
      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur de fond
        </label>
        <ColorPicker
          color={element.backgroundColor}
          onChange={(color) => updateElement(element.id, { backgroundColor: color })}
          showPicker={showBackgroundColorPicker}
          setShowPicker={setShowBackgroundColorPicker}
          colorPresets={[...colorPresets, 'transparent']}
          allowTransparent
        />
      </div>
      
      {/* Padding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Espacement interne ({element.padding}px)
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={element.padding}
          onChange={(e) => updateElement(element.id, { padding: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => updateElement(element.id, { padding: 0 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.padding === 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            0px
          </button>
          <button 
            onClick={() => updateElement(element.id, { padding: 8 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.padding === 8 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            8px
          </button>
          <button 
            onClick={() => updateElement(element.id, { padding: 16 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.padding === 16 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            16px
          </button>
          <button 
            onClick={() => updateElement(element.id, { padding: 24 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.padding === 24 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            24px
          </button>
          <button 
            onClick={() => updateElement(element.id, { padding: 32 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.padding === 32 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            32px
          </button>
        </div>
      </div>
      
      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Arrondi des coins ({element.borderRadius}px)
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={element.borderRadius}
          onChange={(e) => updateElement(element.id, { borderRadius: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => updateElement(element.id, { borderRadius: 0 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderRadius === 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            0px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderRadius: 4 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderRadius === 4 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            4px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderRadius: 8 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderRadius === 8 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            8px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderRadius: 16 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderRadius === 16 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            16px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderRadius: 24 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderRadius === 24 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            24px
          </button>
        </div>
      </div>
    </div>
  );
};

// Shape Properties Component
interface ShapePropertiesProps {
  element: ShapeElement;
  updateElement: (id: string, updates: Partial<ShapeElement>) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  showBorderColorPicker: boolean;
  setShowBorderColorPicker: (show: boolean) => void;
  colorPresets: string[];
}

const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  element,
  updateElement,
  showColorPicker,
  setShowColorPicker,
  showBorderColorPicker,
  setShowBorderColorPicker,
  colorPresets
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-900">Propriétés de la forme</h3>
      
      {/* Shape Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur de remplissage
        </label>
        <ColorPicker
          color={element.color}
          onChange={(color) => updateElement(element.id, { color })}
          showPicker={showColorPicker}
          setShowPicker={setShowColorPicker}
          colorPresets={colorPresets}
        />
      </div>
      
      {/* Border Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur de bordure
        </label>
        <ColorPicker
          color={element.borderColor}
          onChange={(color) => updateElement(element.id, { borderColor: color })}
          showPicker={showBorderColorPicker}
          setShowPicker={setShowBorderColorPicker}
          colorPresets={[...colorPresets, 'transparent']}
          allowTransparent
        />
      </div>
      
      {/* Border Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Épaisseur de bordure ({element.borderWidth}px)
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={element.borderWidth}
          onChange={(e) => updateElement(element.id, { borderWidth: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => updateElement(element.id, { borderWidth: 0 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderWidth === 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            0px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderWidth: 1 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderWidth === 1 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            1px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderWidth: 2 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderWidth === 2 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            2px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderWidth: 4 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderWidth === 4 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            4px
          </button>
          <button 
            onClick={() => updateElement(element.id, { borderWidth: 8 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.borderWidth === 8 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            8px
          </button>
        </div>
      </div>
      
      {/* Border Radius (for rectangles) */}
      {element.shapeType === 'rectangle' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arrondi des coins ({element.borderRadius || 0}px)
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={element.borderRadius || 0}
            onChange={(e) => updateElement(element.id, { borderRadius: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            <button 
              onClick={() => updateElement(element.id, { borderRadius: 0 })}
              className={clsx(
                "px-2 py-1 text-xs rounded",
                (element.borderRadius || 0) === 0 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              0px
            </button>
            <button 
              onClick={() => updateElement(element.id, { borderRadius: 4 })}
              className={clsx(
                "px-2 py-1 text-xs rounded",
                (element.borderRadius || 0) === 4 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              4px
            </button>
            <button 
              onClick={() => updateElement(element.id, { borderRadius: 8 })}
              className={clsx(
                "px-2 py-1 text-xs rounded",
                (element.borderRadius || 0) === 8 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              8px
            </button>
            <button 
              onClick={() => updateElement(element.id, { borderRadius: 16 })}
              className={clsx(
                "px-2 py-1 text-xs rounded",
                (element.borderRadius || 0) === 16 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              16px
            </button>
            <button 
              onClick={() => updateElement(element.id, { borderRadius: 9999 })}
              className={clsx(
                "px-2 py-1 text-xs rounded",
                (element.borderRadius || 0) === 9999 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              Max
            </button>
          </div>
        </div>
      )}
      
      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opacité ({Math.round(element.opacity * 100)}%)
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={element.opacity}
          onChange={(e) => updateElement(element.id, { opacity: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => updateElement(element.id, { opacity: 0.25 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 0.25 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            25%
          </button>
          <button 
            onClick={() => updateElement(element.id, { opacity: 0.5 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 0.5 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            50%
          </button>
          <button 
            onClick={() => updateElement(element.id, { opacity: 0.75 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 0.75 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            75%
          </button>
          <button 
            onClick={() => updateElement(element.id, { opacity: 1 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 1 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            100%
          </button>
        </div>
      </div>
    </div>
  );
};

// Image Properties Component
interface ImagePropertiesProps {
  element: ImageElement;
  updateElement: (id: string, updates: Partial<ImageElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  objectFitOptions: { value: string; label: string }[];
}

const ImageProperties: React.FC<ImagePropertiesProps> = ({
  element,
  updateElement,
  fileInputRef,
  objectFitOptions
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-900">Propriétés de l'image</h3>
      
      {/* Object Fit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ajustement
        </label>
        <div className="flex space-x-2">
          {objectFitOptions.map(option => (
            <button
              key={option.value}
              onClick={() => updateElement(element.id, { 
                objectFit: option.value as 'cover' | 'contain'
              })}
              className={clsx(
                "flex-1 py-2 px-3 rounded-lg transition-colors",
                element.objectFit === option.value 
                  ? "bg-indigo-100 text-indigo-600 border border-indigo-200" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opacité ({Math.round(element.opacity * 100)}%)
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={element.opacity}
          onChange={(e) => updateElement(element.id, { opacity: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          <button 
            onClick={() => updateElement(element.id, { opacity: 0.25 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 0.25 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            25%
          </button>
          <button 
            onClick={() => updateElement(element.id, { opacity: 0.5 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 0.5 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            50%
          </button>
          <button 
            onClick={() => updateElement(element.id, { opacity: 0.75 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 0.75 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            75%
          </button>
          <button 
            onClick={() => updateElement(element.id, { opacity: 1 })}
            className={clsx(
              "px-2 py-1 text-xs rounded",
              element.opacity === 1 ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            100%
          </button>
        </div>
      </div>
      
      {/* Replace Image */}
      <div>
        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          <Upload className="h-5 w-5 mr-2" />
          Remplacer l'image
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;