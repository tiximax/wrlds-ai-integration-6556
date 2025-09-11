// Product types and interfaces

export type ProductStatus = 'available' | 'preorder' | 'out_of_stock' | 'discontinued';
export type ProductType = 'ready_stock' | 'pre_order' | 'flash_deal' | 'group_buy';
export type ProductOrigin = 'japan' | 'korea' | 'usa' | 'europe';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// Updated variant structure for better flexibility
export interface ProductVariantOption {
  id: string;
  value: string;
  label: string;
  stock: number;
  priceAdjustment: number;
  image?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style' | 'capacity' | 'other';
  required: boolean;
  options: ProductVariantOption[];
}

// Keep legacy variant for backward compatibility
export interface LegacyProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stock: number;
  sku: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
  category?: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  date: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image?: string;
  description?: string;
  children?: ProductCategory[];
  productCount?: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryHierarchy {
  category: ProductCategory;
  parent?: ProductCategory;
  ancestors: ProductCategory[];
  children: ProductCategory[];
  breadcrumbs: Breadcrumb[];
}

export interface Breadcrumb {
  id: string;
  name: string;
  slug: string;
  url: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  logo: string;
  country: ProductOrigin;
  verified: boolean;
}

export interface ProductDeal {
  id: string;
  type: 'flash_sale' | 'daily_deal' | 'group_buy' | 'preorder_special';
  discountPercent?: number;
  discountAmount?: number;
  startDate: Date;
  endDate: Date;
  minQuantity?: number; // For group buy
  currentQuantity?: number; // For group buy
  maxQuantity?: number;
  isActive: boolean;
}

export interface PreorderInfo {
  id: string;
  expectedArrival: Date;
  minPreorderQuantity: number;
  currentPreorderCount: number;
  depositPercent: number;
  estimatedPrice: {
    min: number;
    max: number;
  };
  isGroupBuy: boolean;
  groupBuyThreshold?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Pricing
  originalPrice: number; // Giá gốc ở nước ngoài
  sellingPrice: number; // Giá bán cho khách
  compareAtPrice?: number; // Giá so sánh
  currency: string;
  
  // Product classification
  status: ProductStatus;
  type: ProductType;
  origin: ProductOrigin;
  category: ProductCategory;
  brand?: ProductBrand;
  
  // Media
  images: ProductImage[];
  videos?: string[];
  
  // Inventory
  stock: number;
  sku: string;
  variants?: ProductVariant[];
  
  // Enhanced product info
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
  
  // Metadata
  weight?: number; // kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // Special offers
  deal?: ProductDeal;
  preorderInfo?: PreorderInfo;
  
  // SEO & Marketing
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  featured: boolean;
  trending: boolean;
  
  // Ratings
  rating: {
    average: number;
    count: number;
  };
  
  // Source info
  sourceUrl?: string; // Link gốc từ website nước ngoài
  sourceSite: string; // Amazon, Rakuten, etc.
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ProductFilter {
  category?: string[];
  brand?: string[];
  origin?: ProductOrigin[];
  priceRange?: {
    min: number;
    max: number;
  };
  status?: ProductStatus[];
  type?: ProductType[];
  inStock?: boolean;
  onDeal?: boolean;
  featured?: boolean;
  trending?: boolean;
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variant?: ProductVariant;
  notes?: string;
  addedAt: Date;
}

export interface PreorderRegistration {
  id: string;
  productId: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  depositPaid?: boolean;
  depositAmount?: number;
  status: 'registered' | 'confirmed' | 'cancelled' | 'fulfilled';
  registeredAt: Date;
  notifiedAt?: Date;
}

// ProductReview interface moved above and enhanced
