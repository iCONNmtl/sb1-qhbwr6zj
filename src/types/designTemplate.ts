export interface DesignTemplate {
    id: string;
    userId: string;
    name: string;
    description?: string;
    thumbnail: string;
    elements: any[];
    backgroundColor: string;
    canvasWidth: number;
    canvasHeight: number;
    sizeId: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    category?: string;
  }