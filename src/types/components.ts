/**
 * 🎯 Component Type Definitions
 * 
 * Centralized type definitions for components, props, and utilities.
 * Reduces implicit `any` usage and improves type safety across the app.
 * 
 * Usage:
 * ```ts
 * import { ProductCardProps, CartItemProps } from '@/types/components';
 * 
 * export const ProductCard: React.FC<ProductCardProps> = (props) => { ... };
 * ```
 */

import React from 'react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRODUCT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Product data structure
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image?: string;
  images?: string[];
  category?: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  quantity?: number;
  sku?: string;
  tags?: string[];
  [key: string]: any; // Allow extra properties for flexibility
}

/**
 * ProductCard component props
 */
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onWishlistToggle?: (product: Product) => void;
  showWishlist?: boolean;
  className?: string;
}

/**
 * ProductImageGallery component props
 */
export interface ProductImageGalleryProps {
  images: string[];
  productName?: string;
  className?: string;
}

/**
 * SimpleProductCard component props
 */
export interface SimpleProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onWishlistToggle?: (product: Product) => void;
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CART TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Cart item (product + quantity)
 */
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

/**
 * SimpleCartSidebar component props
 */
export interface SimpleCartSidebarProps {
  items: CartItem[];
  onUpdateQuantity?: (item: CartItem, newQuantity: number) => void;
  onRemove?: (item: CartItem) => void;
  onCheckout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Cart context value
 */
export interface CartContextValue {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECKOUT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Address information
 */
export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * Payment method
 */
export type PaymentMethod = 'credit-card' | 'paypal' | 'bank-transfer' | 'wallet';

/**
 * Checkout step
 */
export interface CheckoutStep {
  id: number;
  name: string;
  component: React.ComponentType<any>;
}

/**
 * Checkout context value
 */
export interface CheckoutContextValue {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  shippingAddress: Address | null;
  setShippingAddress: (address: Address) => void;
  billingAddress: Address | null;
  setBillingAddress: (address: Address) => void;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
}

/**
 * AdvancedCheckoutProcess component props
 */
export interface AdvancedCheckoutProcessProps {
  items: CartItem[];
  onComplete?: (order: any) => void;
  onCancel?: () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FORM TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Form field value (supports various types)
 */
export type FormFieldValue = string | number | boolean | string[] | null | undefined;

/**
 * Form field error
 */
export interface FormFieldError {
  [fieldName: string]: string;
}

/**
 * Form state
 */
export interface FormState {
  values: Record<string, FormFieldValue>;
  errors: FormFieldError;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

/**
 * EnhancedFormComponents - AddressInput props
 */
export interface AddressInputProps {
  value: Address;
  onChange: (address: Address) => void;
  onAddressSelect?: (address: Address) => void;
  label?: string;
  required?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI COMPONENT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Button component props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Modal/Dialog component props
 */
export interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Card component props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
}

/**
 * Tab item
 */
export interface TabItem {
  id: string | number;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Tabs component props
 */
export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string | number;
  onChange?: (tabId: string | number) => void;
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEARCH TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Search suggestion item
 */
export interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'tag' | 'brand';
  label: string;
  value: string;
  icon?: string;
  metadata?: Record<string, any>;
}

/**
 * Search filter
 */
export interface SearchFilter {
  query?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
}

/**
 * EnhancedSearch component props
 */
export interface EnhancedSearchProps {
  products: Product[];
  onSearch?: (query: string) => void;
  onFiltersChange?: (filters: SearchFilter) => void;
  onProductSelect?: (product: Product) => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FOOTER TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Social link item
 */
export interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Quick link item
 */
export interface QuickLinkItem {
  id: string;
  label: string;
  url: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * SocialLinks component props
 */
export interface SocialLinksProps {
  links: SocialLinkItem[];
  className?: string;
}

/**
 * QuickLinks component props
 */
export interface QuickLinksProps {
  links: QuickLinkItem[];
  title?: string;
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Order status
 */
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Order
 */
export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

/**
 * OrderTrackingComponent props
 */
export interface OrderTrackingComponentProps {
  orderId: string;
  order?: Order;
  isLoading?: boolean;
  onCancel?: () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REVIEW TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Customer review
 */
export interface CustomerReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: Date;
  verified: boolean;
  helpful?: number;
  unhelpful?: number;
}

/**
 * CustomerReviews component props
 */
export interface CustomerReviewsProps {
  productId: string;
  reviews?: CustomerReview[];
  onSubmitReview?: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
  isLoading?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WISHLIST TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Wishlist item
 */
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

/**
 * WishlistButton component props
 */
export interface WishlistButtonProps {
  product: Product;
  onToggle?: (product: Product, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOG TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Blog post
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  author: string;
  date: Date;
  category?: string;
  tags?: string[];
  image?: string;
  readTime?: number;
}

/**
 * BlogPostCard component props
 */
export interface BlogPostCardProps {
  post: BlogPost;
  onClick?: () => void;
  className?: string;
}

/**
 * EnhancedBlogContent component props
 */
export interface EnhancedBlogContentProps {
  content: string;
  data?: Array<Record<string, any>>;
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHART TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Chart data point
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

/**
 * Chart component props (generic)
 */
export interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  className?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAYOUT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * ProjectPageLayout component props
 */
export interface ProjectPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * FeaturedProducts component props
 */
export interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Common HTML element props
 */
export type DivProps = React.HTMLAttributes<HTMLDivElement>;
export type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}
