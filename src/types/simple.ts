// Simplified types for emergency stabilization
export interface SimpleProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  sellingPrice: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  sku: string;
  images: {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  origin: 'japan' | 'korea' | 'usa' | 'europe';
  status: 'available' | 'preorder' | 'out_of_stock';
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Add missing properties for compatibility
  type: 'ready_stock' | 'pre_order' | 'flash_deal' | 'group_buy';
  sourceSite: string;
  brand?: {
    id: string;
    name: string;
    logo: string;
    country: 'japan' | 'korea' | 'usa' | 'europe';
    verified: boolean;
  };
  variants?: SimpleVariant[];
}

export interface SimpleVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stock: number;
  sku: string;
}

export interface SimpleCartItem {
  id: string;
  product: SimpleProduct;
  quantity: number;
  selectedVariants?: Record<string, string>;
  finalPrice: number;
  addedAt: Date;
}

export interface SimpleCartState {
  items: SimpleCartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}