// Re-export main types for consistency  
import type {
  Product,
  ProductImage,
  ProductVariant,
  ProductCategory,
  ProductBrand,
  ProductOrigin,
  ProductStatus,
  ProductType,
  CartItem
} from './product';

export type {
  Product,
  ProductImage,
  ProductVariant,
  ProductCategory,
  ProductBrand,
  ProductOrigin,
  ProductStatus,
  ProductType,
  CartItem
};

// Legacy aliases for backward compatibility
export type SimpleProduct = Product;
export type SimpleVariant = ProductVariant;
export type SimpleCartItem = CartItem;

// Simple cart state interface
export interface SimpleCartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}