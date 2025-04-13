// Define element types
export interface BaseElement {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    visible: boolean;
    locked: boolean;
    name: string;
  }
  
  export interface TextElement extends BaseElement {
    type: 'text';
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: string;
    fontStyle: string;
    textAlign: 'left' | 'center' | 'right';
    textDecoration: string;
    backgroundColor: string;
    padding: number;
    borderRadius: number;
  }
  
  export interface ShapeElement extends BaseElement {
    type: 'shape';
    shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon';
    color: string;
    borderColor: string;
    borderWidth: number;
    borderRadius?: number;
    opacity: number;
  }
  
  export interface ImageElement extends BaseElement {
    type: 'image';
    src: string;
    opacity: number;
    objectFit: 'cover' | 'contain';
  }
  
  export type DesignElement = TextElement | ShapeElement | ImageElement;
  
  // Size interface
  export interface DesignSize {
    id: string;
    name: string;
    dimensions: {
      inches: string;
      cm: string;
    };
    width: number;
    height: number;
    recommendedSize: {
      width: number;
      height: number;
    };
  }
  
  // Define design state
  export interface DesignState {
    elements: DesignElement[];
    selectedElementId: string | null;
    backgroundColor: string;
    backgroundImage: string | null;
    canvasWidth: number;
    canvasHeight: number;
    currentSize: string;
    designName: string;
    designUrl?: string;
    availableSizes: DesignSize[];
    colorPresets: string[];
    setState: React.Dispatch<React.SetStateAction<DesignState>>;
  }