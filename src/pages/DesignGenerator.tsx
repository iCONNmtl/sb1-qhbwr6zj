import React, { useState, useRef, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Save, Download, Loader2, Grid, Wand2, Layers, Type, Square, Circle, Image as ImageIcon, Triangle, Star, Hexagon, BookmarkIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';
import Canvas from '../components/design/Canvas';
import PropertiesPanel from '../components/design/PropertiesPanel';
import ToolsPanel from '../components/design/ToolsPanel';
import SaveTemplateDialog from '../components/design/SaveTemplateDialog';
import TemplateGallery from '../components/design/TemplateGallery';
import type { DesignState, DesignElement, TextElement, ShapeElement, ImageElement } from '../types/design';
import type { UserProfile } from '../types/user';
import type { DesignTemplate } from '../types/designTemplate';

// Available sizes - Poster sizes
const AVAILABLE_SIZES = [
  {
    id: '8x10',
    name: '8x10"',
    dimensions: {
      inches: '8x10"',
      cm: '20x25cm'
    },
    width: 720,
    height: 900,
    recommendedSize: {
      width: 2400,
      height: 3000
    }
  },
  {
    id: '8x12',
    name: '8x12"',
    dimensions: {
      inches: '8x12"',
      cm: '21x29,7cm'
    },
    width: 600,
    height: 900,
    recommendedSize: {
      width: 2400,
      height: 3600
    }
  },
  {
    id: '12x18',
    name: '12x18"',
    dimensions: {
      inches: '12x18"',
      cm: '30x45cm'
    },
    width: 600,
    height: 900,
    recommendedSize: {
      width: 3600,
      height: 5400
    }
  },
  {
    id: '24x36',
    name: '24x36"',
    dimensions: {
      inches: '24x36"',
      cm: '60x90cm'
    },
    width: 600,
    height: 900,
    recommendedSize: {
      width: 7200,
      height: 10800
    }
  },
  {
    id: '11x14',
    name: '11x14"',
    dimensions: {
      inches: '11x14"',
      cm: '27x35cm'
    },
    width: 707,
    height: 900,
    recommendedSize: {
      width: 3300,
      height: 4200
    }
  },
  {
    id: '11x17',
    name: '11x17"',
    dimensions: {
      inches: '11x17"',
      cm: '28x43cm'
    },
    width: 582,
    height: 900,
    recommendedSize: {
      width: 3300,
      height: 5100
    }
  },
  {
    id: '18x24',
    name: '18x24"',
    dimensions: {
      inches: '18x24"',
      cm: '45x60cm'
    },
    width: 675,
    height: 900,
    recommendedSize: {
      width: 5400,
      height: 7200
    }
  },
  {
    id: 'A4',
    name: 'A4',
    dimensions: {
      inches: 'A4',
      cm: '21x29,7cm'
    },
    width: 637,
    height: 900,
    recommendedSize: {
      width: 2480,
      height: 3508
    }
  },
  {
    id: '5x7',
    name: '5x7"',
    dimensions: {
      inches: '5x7"',
      cm: '13x18cm'
    },
    width: 643,
    height: 900,
    recommendedSize: {
      width: 1500,
      height: 2100
    }
  },
  {
    id: '20x28',
    name: '20x28"',
    dimensions: {
      inches: '20x28"',
      cm: '50x70cm'
    },
    width: 643,
    height: 900,
    recommendedSize: {
      width: 6000,
      height: 8400
    }
  },
  {
    id: '28x40',
    name: '28x40"',
    dimensions: {
      inches: '28x40"',
      cm: '70x100cm'
    },
    width: 630,
    height: 900,
    recommendedSize: {
      width: 8400,
      height: 12000
    }
  }
];

// Color presets
const COLOR_PRESETS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Dark green
  '#000080', // Navy blue
  '#FF4500', // OrangeRed
  '#4B0082', // Indigo
  '#8B4513', // SaddleBrown
  '#2E8B57'  // SeaGreen
];

// Webhook URL for Make.com
const DESIGN_WEBHOOK_URL = 'https://hook.eu1.make.com/u7aoqjp9k9x8mvhxrfpb5ljsp6njpasj';

export default function DesignGenerator() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Design state
  const [designState, setDesignState] = useState<DesignState>(() => {
    const initialState: DesignState = {
      elements: [],
      selectedElementId: null,
      backgroundColor: '#FFFFFF',
      backgroundImage: null,
      canvasWidth: AVAILABLE_SIZES[0].width,
      canvasHeight: AVAILABLE_SIZES[0].height,
      currentSize: AVAILABLE_SIZES[0].id,
      designName: 'Untitled Design',
      availableSizes: AVAILABLE_SIZES,
      colorPresets: COLOR_PRESETS,
      setState: (newState: DesignState | ((prev: DesignState) => DesignState)) => {
        if (typeof newState === 'function') {
          setDesignState(prev => {
            const updatedState = newState(prev);
            return { ...updatedState, setState: prev.setState };
          });
        } else {
          setDesignState(prev => ({ ...newState, setState: prev.setState }));
        }
      }
    };
    return initialState;
  });

  // Fetch user profile
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

  // Selected element
  const selectedElement = designState.selectedElementId
    ? designState.elements.find(el => el.id === designState.selectedElementId) || null
    : null;

  // Element dragging state
  const [dragInfo, setDragInfo] = useState<{
    isDragging: boolean;
    startX: number;
    startY: number;
    elementId: string;
    initialX: number;
    initialY: number;
  } | null>(null);

  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    const element = designState.elements.find(el => el.id === id);
    if (!element) return;
    
    setDragInfo({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      elementId: id,
      initialX: element.x,
      initialY: element.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragInfo?.isDragging) return;
    
    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    
    let newX = dragInfo.initialX + dx;
    let newY = dragInfo.initialY + dy;
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }
    
    // Update element position
    updateElement(dragInfo.elementId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDragInfo(null);
  };

  // Update element
  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setDesignState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  };

  // Add text element
  const addTextElement = () => {
    const newElement: TextElement = {
      id: nanoid(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: designState.elements.length + 1,
      visible: true,
      locked: false,
      name: 'Text',
      content: 'New text',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      textDecoration: 'none',
      backgroundColor: 'transparent',
      padding: 0,
      borderRadius: 0
    };
    
    setDesignState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedElementId: newElement.id
    }));
  };

  // Add shape element
  const addShapeElement = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon') => {
    const newElement: ShapeElement = {
      id: nanoid(),
      type: 'shape',
      shapeType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: designState.elements.length + 1,
      visible: true,
      locked: false,
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      color: '#4F46E5',
      borderColor: '#000000',
      borderWidth: 0,
      opacity: 1
    };
    
    if (shapeType === 'rectangle') {
      newElement.borderRadius = 0;
    }
    
    setDesignState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedElementId: newElement.id
    }));
  };

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio within canvas
        const maxWidth = designState.canvasWidth * 0.8;
        const maxHeight = designState.canvasHeight * 0.8;
        
        let width = img.width;
        let height = img.height;
        
        // Scale down if image is too large
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Center the image on canvas
        const x = (designState.canvasWidth - width) / 2;
        const y = (designState.canvasHeight - height) / 2;
        
        const newElement: ImageElement = {
          id: nanoid(),
          type: 'image',
          x,
          y,
          width,
          height,
          rotation: 0,
          zIndex: designState.elements.length + 1,
          visible: true,
          locked: false,
          name: 'Image',
          src: event.target?.result as string,
          opacity: 1,
          objectFit: 'contain'
        };
        
        setDesignState(prev => ({
          ...prev,
          elements: [...prev.elements, newElement],
          selectedElementId: newElement.id
        }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Duplicate element
  const duplicateSelectedElement = () => {
    if (!designState.selectedElementId) return;
    
    const selectedElement = designState.elements.find(el => el.id === designState.selectedElementId);
    if (!selectedElement) return;
    
    const newElement = {
      ...selectedElement,
      id: nanoid(),
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      zIndex: designState.elements.length + 1
    };
    
    setDesignState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedElementId: newElement.id
    }));
  };

  // Delete element
  const deleteSelectedElement = () => {
    if (!designState.selectedElementId) return;
    
    setDesignState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== prev.selectedElementId),
      selectedElementId: null
    }));
  };

  // Move element up
  const moveElementUp = () => {
    if (!designState.selectedElementId) return;
    
    setDesignState(prev => {
      const elements = [...prev.elements];
      const index = elements.findIndex(el => el.id === prev.selectedElementId);
      if (index === elements.length - 1) return prev;
      
      const element = elements[index];
      const nextElement = elements[index + 1];
      
      elements[index] = { ...nextElement, zIndex: element.zIndex };
      elements[index + 1] = { ...element, zIndex: nextElement.zIndex };
      
      return { ...prev, elements };
    });
  };

  // Move element down
  const moveElementDown = () => {
    if (!designState.selectedElementId) return;
    
    setDesignState(prev => {
      const elements = [...prev.elements];
      const index = elements.findIndex(el => el.id === prev.selectedElementId);
      if (index === 0) return prev;
      
      const element = elements[index];
      const prevElement = elements[index - 1];
      
      elements[index] = { ...prevElement, zIndex: element.zIndex };
      elements[index - 1] = { ...element, zIndex: prevElement.zIndex };
      
      return { ...prev, elements };
    });
  };

  // Toggle element lock
  const toggleElementLock = (id: string) => {
    setDesignState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, locked: !el.locked } : el
      )
    }));
  };

  // Toggle element visibility
  const toggleElementVisibility = (id: string) => {
    setDesignState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, visible: !el.visible } : el
      )
    }));
  };

  // Change size
  const handleSizeChange = (sizeId: string) => {
    const size = AVAILABLE_SIZES.find(s => s.id === sizeId);
    if (!size) return;
    
    setDesignState(prev => ({
      ...prev,
      canvasWidth: size.width,
      canvasHeight: size.height,
      currentSize: sizeId
    }));
  };

  // Generate HTML representation of the design
  const generateDesignHtml = () => {
    if (!canvasRef.current) return '';
    
    const canvas = canvasRef.current;
    const { backgroundColor, elements, canvasWidth, canvasHeight } = designState;
    
    // Create a container with the same dimensions and background
    const containerStyle = `
      position: relative;
      width: ${canvasWidth}px;
      height: ${canvasHeight}px;
      background-color: ${backgroundColor};
      overflow: hidden;
    `;
    
    // Generate HTML for each element
    const elementsHtml = elements.map(element => {
      if (!element.visible) return '';
      
      const baseStyle = `
        position: absolute;
        left: ${element.x}px;
        top: ${element.y}px;
        width: ${element.width}px;
        height: ${element.height}px;
        transform: rotate(${element.rotation}deg);
        z-index: ${element.zIndex};
      `;
      
      if (element.type === 'text') {
        const textElement = element as TextElement;
        const textStyle = `
          font-family: ${textElement.fontFamily};
          font-size: ${textElement.fontSize}px;
          font-weight: ${textElement.fontWeight};
          font-style: ${textElement.fontStyle};
          color: ${textElement.color};
          text-align: ${textElement.textAlign};
          text-decoration: ${textElement.textDecoration};
          background-color: ${textElement.backgroundColor};
          padding: ${textElement.padding}px;
          border-radius: ${textElement.borderRadius}px;
          display: flex;
          align-items: center;
          justify-content: ${
            textElement.textAlign === 'center' ? 'center' : 
            textElement.textAlign === 'right' ? 'flex-end' : 'flex-start'
          };
          overflow: hidden;
          word-break: break-word;
        `;
        
        return `<div style="${baseStyle}${textStyle}">${textElement.content}</div>`;
      }
      
      if (element.type === 'shape') {
        const shapeElement = element as ShapeElement;
        
        if (shapeElement.shapeType === 'rectangle') {
          return `
            <div style="${baseStyle}
              background-color: ${shapeElement.color};
              border: ${shapeElement.borderWidth}px solid ${shapeElement.borderColor};
              border-radius: ${shapeElement.borderRadius || 0}px;
              opacity: ${shapeElement.opacity};
            "></div>
          `;
        }
        
        if (shapeElement.shapeType === 'circle') {
          return `
            <div style="${baseStyle}
              background-color: ${shapeElement.color};
              border: ${shapeElement.borderWidth}px solid ${shapeElement.borderColor};
              border-radius: 50%;
              opacity: ${shapeElement.opacity};
            "></div>
          `;
        }
        
        if (shapeElement.shapeType === 'triangle') {
          return `
            <div style="${baseStyle} background-color: transparent; opacity: ${shapeElement.opacity};">
              <div style="
                width: 0;
                height: 0;
                border-left: ${element.width / 2}px solid transparent;
                border-right: ${element.width / 2}px solid transparent;
                border-bottom: ${element.height}px solid ${shapeElement.color};
                position: absolute;
                top: 0;
                left: 0;
              "></div>
            </div>
          `;
        }
        
        if (shapeElement.shapeType === 'star' || shapeElement.shapeType === 'hexagon') {
          // For complex shapes, we'll use SVG
          const svgShape = shapeElement.shapeType === 'star' 
            ? '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />'
            : '<path d="M21 16.5v-9l-9-6-9 6v9l9 6 9-6z" />';
          
          return `
            <div style="${baseStyle}">
              <svg 
                viewBox="0 0 24 24" 
                fill="${shapeElement.color}" 
                stroke="${shapeElement.borderWidth > 0 ? shapeElement.borderColor : 'none'}" 
                stroke-width="${shapeElement.borderWidth}"
                width="100%" 
                height="100%" 
                style="opacity: ${shapeElement.opacity};"
              >
                ${svgShape}
              </svg>
            </div>
          `;
        }
      }
      
      if (element.type === 'image') {
        const imageElement = element as ImageElement;
        return `
          <div style="${baseStyle}">
            <img 
              src="${imageElement.src}" 
              alt="Element" 
              style="
                width: 100%;
                height: 100%;
                object-fit: ${imageElement.objectFit};
                opacity: ${imageElement.opacity};
              "
            />
          </div>
        `;
      }
      
      return '';
    }).join('');
    
    return `
      <div style="${containerStyle}">
        ${elementsHtml}
      </div>
    `;
  };

  // Generate thumbnail for template
  const generateThumbnail = async (): Promise<string> => {
    if (!canvasRef.current) return '';
    
    try {
      const dataUrl = await toPng(canvasRef.current, { 
        cacheBust: true,
        pixelRatio: 1,
        quality: 0.8,
        width: designState.canvasWidth,
        height: designState.canvasHeight
      });
      
      return dataUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '';
    }
  };

  // Download design
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    
    try {
      setLoading(true);
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
      
      const link = document.createElement('a');
      link.download = `${designState.designName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Error during download');
    } finally {
      setLoading(false);
    }
  };

  // Save design
  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save');
      return;
    }
    
    try {
      setSaving(true);
      
      // Generate HTML representation of the design
      const designHtml = generateDesignHtml();
      
      // Send design HTML to webhook
      try {
        await fetch(DESIGN_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            html: designHtml,
            designName: designState.designName,
            size: {
              id: designState.currentSize,
              width: designState.canvasWidth,
              height: designState.canvasHeight
            },
            userId: user.uid
          })
        });
      } catch (webhookError) {
        console.error('Error sending to webhook:', webhookError);
        // Continue with saving even if webhook fails
      }
      
      // Convert canvas to image
      const dataUrl = await toPng(canvasRef.current!, { cacheBust: true });
      
      // Create a product with the design
      await addDoc(collection(db, 'products'), {
        userId: user.uid,
        type: 'custom-design',
        title: designState.designName,
        designUrl: dataUrl,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      
      toast.success('Design saved successfully');
      navigate('/my-products');
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Error saving design');
    } finally {
      setSaving(false);
    }
  };

  // Save as template
  const handleSaveAsTemplate = async () => {
    if (!user) {
      toast.error('You must be logged in to save templates');
      return;
    }
    
    try {
      const thumbnail = await generateThumbnail();
      setThumbnailUrl(thumbnail);
      setShowSaveTemplateDialog(true);
    } catch (error) {
      console.error('Error preparing template:', error);
      toast.error('Error preparing template');
    }
  };

  // Load template
  const handleLoadTemplate = (template: DesignTemplate) => {
    // Find the size in available sizes
    const size = AVAILABLE_SIZES.find(s => s.id === template.sizeId);
    if (!size) {
      toast.error('Size not found in template');
      return;
    }
    
    // Update design state with template data
    setDesignState(prev => ({
      ...prev,
      elements: template.elements,
      backgroundColor: template.backgroundColor,
      canvasWidth: template.canvasWidth,
      canvasHeight: template.canvasHeight,
      currentSize: template.sizeId,
      designName: `${template.name} - Copy`,
      selectedElementId: null
    }));
    
    setShowTemplateGallery(false);
    toast.success('Template chargé avec succès');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Design Generator
          </h1>
          <input
            type="text"
            value={designState.designName}
            onChange={(e) => setDesignState(prev => ({ ...prev, designName: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Design name"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={designState.currentSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {AVAILABLE_SIZES.map(size => (
              <option key={size.id} value={size.id}>
                {size.name} ({size.dimensions.cm})
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowTemplateGallery(true)}
            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            Templates
          </button>
          <button
            onClick={handleSaveAsTemplate}
            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            <BookmarkIcon className="h-5 w-5 mr-2" />
            Sauvegarder comme template
          </button>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Download
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left sidebar with all controls */}
        <div className="w-80 space-y-6">
          {/* Tools panel */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ToolsPanel
              state={designState}
              setState={setDesignState}
              addTextElement={addTextElement}
              addShapeElement={addShapeElement}
              toggleElementVisibility={toggleElementVisibility}
              toggleElementLock={toggleElementLock}
              showBackgroundColorPicker={showBackgroundColorPicker}
              setShowBackgroundColorPicker={setShowBackgroundColorPicker}
              showLayersPanel={showLayersPanel}
              setShowLayersPanel={setShowLayersPanel}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              snapToGrid={snapToGrid}
              setSnapToGrid={setSnapToGrid}
              gridSize={gridSize}
              setGridSize={setGridSize}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          {/* Properties panel */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <PropertiesPanel
              state={designState}
              selectedElement={selectedElement}
              updateElement={updateElement}
              deleteSelectedElement={deleteSelectedElement}
              duplicateSelectedElement={duplicateSelectedElement}
              toggleElementLock={toggleElementLock}
              toggleElementVisibility={toggleElementVisibility}
              addTextElement={addTextElement}
              addShapeElement={addShapeElement}
              fileInputRef={fileInputRef}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
              showBackgroundColorPicker={showBackgroundColorPicker}
              setShowBackgroundColorPicker={setShowBackgroundColorPicker}
              showBorderColorPicker={showBorderColorPicker}
              setShowBorderColorPicker={setShowBorderColorPicker}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1" ref={canvasRef}>
          <Canvas
            state={designState}
            setState={setDesignState}
            handleElementMouseDown={handleElementMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            duplicateSelectedElement={duplicateSelectedElement}
            deleteSelectedElement={deleteSelectedElement}
            moveElementUp={moveElementUp}
            moveElementDown={moveElementDown}
            updateElement={updateElement}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
          />
        </div>
      </div>

      {/* Save Template Dialog */}
      {showSaveTemplateDialog && user && (
        <SaveTemplateDialog
          isOpen={showSaveTemplateDialog}
          onClose={() => setShowSaveTemplateDialog(false)}
          onSuccess={() => {
            setShowSaveTemplateDialog(false);
            toast.success('Template sauvegardé avec succès');
          }}
          designState={designState}
          thumbnailUrl={thumbnailUrl}
          userId={user.uid}
        />
      )}

      {/* Template Gallery */}
      {showTemplateGallery && user && (
        <TemplateGallery
          userId={user.uid}
          onSelectTemplate={handleLoadTemplate}
          onClose={() => setShowTemplateGallery(false)}
        />
      )}
    </div>
  );
}