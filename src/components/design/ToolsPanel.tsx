import React, { useRef } from 'react';
import { Type, Square, Circle, ImageIcon, Palette, Layers, ChevronUp, ChevronDown, Eye, EyeOff, Lock, Unlock, Move, Plus, Minus, Triangle, Star, Hexagon, Crown, Grid3X3, Wand2 } from 'lucide-react';
import clsx from 'clsx';
import { DesignState } from '../../types/design';
import { Link } from 'react-router-dom';

interface ToolsPanelProps {
  state: DesignState;
  setState: React.Dispatch<React.SetStateAction<DesignState>>;
  addTextElement: () => void;
  addShapeElement: (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon') => void;
  toggleElementVisibility: (id: string) => void;
  toggleElementLock: (id: string) => void;
  showBackgroundColorPicker: boolean;
  setShowBackgroundColorPicker: (show: boolean) => void;
  showLayersPanel: boolean;
  setShowLayersPanel: (show: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  state,
  setState,
  addTextElement,
  addShapeElement,
  toggleElementVisibility,
  toggleElementLock,
  showBackgroundColorPicker,
  setShowBackgroundColorPicker,
  showLayersPanel,
  setShowLayersPanel,
  fileInputRef,
  handleFileUpload,
  snapToGrid,
  setSnapToGrid,
  gridSize,
  setGridSize
}) => {
  // Check if user is on Expert plan
  const isExpertPlan = false; // This should be determined from user profile

  return (
    <div className="space-y-6">
      {/* Tools Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Wand2 className="h-5 w-5 mr-2 text-indigo-600" />
          Éléments
        </h3>
        
        {/* Text Tool */}
        <button
          onClick={addTextElement}
          className="w-full flex items-center p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-700"
        >
          <Type className="h-5 w-5 mr-3" />
          <span className="font-medium">Ajouter du texte</span>
        </button>
        
        {/* Image Tool */}
        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="w-full flex items-center p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-700"
        >
          <ImageIcon className="h-5 w-5 mr-3" />
          <span className="font-medium">Importer une image</span>
        </button>
        
        {/* Shapes Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Formes</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => addShapeElement('rectangle')}
              className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Square className="h-6 w-6 text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Rectangle</span>
            </button>
            
            <button
              onClick={() => addShapeElement('circle')}
              className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Circle className="h-6 w-6 text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Cercle</span>
            </button>
            
            <button
              onClick={() => addShapeElement('triangle')}
              className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Triangle className="h-6 w-6 text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Triangle</span>
            </button>
          </div>
        </div>
        
        {/* Expert Plan Shapes or Upgrade CTA */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-amber-800 flex items-center">
              <Crown className="h-4 w-4 mr-1 text-amber-600" />
              Formes avancées
            </h4>
            <Link to="/pricing" className="text-xs text-amber-600 hover:text-amber-700">
              Débloquer
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 opacity-60">
            <div className="flex flex-col items-center p-2 bg-amber-100/50 rounded-lg">
              <Star className="h-5 w-5 text-amber-600 mb-1" />
              <span className="text-xs text-amber-800">Étoile</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-amber-100/50 rounded-lg">
              <Hexagon className="h-5 w-5 text-amber-600 mb-1" />
              <span className="text-xs text-amber-800">Hexagone</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid Settings */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Grid3X3 className="h-5 w-5 mr-2 text-indigo-600" />
          Grille
        </h3>
        <div className="bg-gray-50 p-3 rounded-lg space-y-4">
          {/* Grid Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Afficher la grille</span>
            <button 
              onClick={() => setSnapToGrid(!snapToGrid)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
            >
              <span
                className={clsx(
                  "inline-block h-5 w-5 transform rounded-full transition-transform",
                  snapToGrid ? "translate-x-6 bg-white shadow-md" : "translate-x-1 bg-gray-300",
                  "ring-0"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-0 rounded-full",
                  snapToGrid ? "bg-indigo-600" : "bg-gray-200"
                )}
              />
            </button>
          </div>
          
          {/* Grid Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Taille de la grille: {gridSize}px</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setGridSize(Math.max(5, gridSize - 5))}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-l-md transition-colors"
                disabled={gridSize <= 5}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="flex-1 mx-2"
              />
              <button
                onClick={() => setGridSize(Math.min(50, gridSize + 5))}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded-r-md transition-colors"
                disabled={gridSize >= 50}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* Grid Size Presets */}
            <div className="flex justify-between mt-2">
              {[5, 10, 20, 30, 50].map(size => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={clsx(
                    "px-2 py-1 text-xs rounded transition-colors",
                    gridSize === size ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  )}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
          
          {/* Magnetism Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-700">Magnétisme</span>
            <button 
              onClick={() => setSnapToGrid(!snapToGrid)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
            >
              <span
                className={clsx(
                  "inline-block h-5 w-5 transform rounded-full transition-transform",
                  snapToGrid ? "translate-x-6 bg-white shadow-md" : "translate-x-1 bg-gray-300",
                  "ring-0"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-0 rounded-full",
                  snapToGrid ? "bg-indigo-600" : "bg-gray-200"
                )}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Layers Panel Toggle */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowLayersPanel(!showLayersPanel)}
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <Layers className="h-5 w-5 text-gray-700 mr-2" />
            <span className="font-medium">Calques</span>
          </div>
          {showLayersPanel ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      
      {/* Layers Panel */}
      {showLayersPanel && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {state.elements.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun élément
            </p>
          ) : (
            state.elements
              .sort((a, b) => b.zIndex - a.zIndex) // Sort by z-index (highest first)
              .map(element => (
                <div
                  key={element.id}
                  className={clsx(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer",
                    state.selectedElementId === element.id ? "bg-indigo-50" : "hover:bg-gray-50"
                  )}
                  onClick={() => setState(prev => ({ ...prev, selectedElementId: element.id }))}
                >
                  <div className="flex items-center min-w-0">
                    {/* Element type icon */}
                    {element.type === 'text' ? (
                      <Type className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    ) : element.type === 'shape' ? (
                      element.shapeType === 'rectangle' ? (
                        <Square className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      ) : element.shapeType === 'circle' ? (
                        <Circle className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      ) : element.shapeType === 'triangle' ? (
                        <Triangle className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      ) : element.shapeType === 'star' ? (
                        <Star className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Hexagon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      )
                    ) : (
                      <ImageIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    )}
                    
                    {/* Element name */}
                    <span className="text-sm truncate">{element.name}</span>
                  </div>
                  
                  {/* Element actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementVisibility(element.id);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title={element.visible ? "Masquer" : "Afficher"}
                    >
                      {element.visible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementLock(element.id);
                      }}
                      className={clsx(
                        "p-1 rounded transition-colors",
                        element.locked ? "text-indigo-600 hover:bg-indigo-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      )}
                      title={element.locked ? "Déverrouiller" : "Verrouiller"}
                    >
                      {element.locked ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
      
      {/* Background Color */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-indigo-600" />
            Arrière-plan
          </h3>
          <div 
            className="w-6 h-6 rounded-md border border-gray-200 cursor-pointer"
            style={{ backgroundColor: state.backgroundColor }}
            onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
          />
        </div>
        
        {showBackgroundColorPicker && (
          <div className="mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {state.colorPresets.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setState(prev => ({ ...prev, backgroundColor: color }));
                    setShowBackgroundColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={state.backgroundColor}
              onChange={(e) => setState(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPanel;