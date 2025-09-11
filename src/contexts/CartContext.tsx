import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Product, CartItem, CartState } from '@/types/product';
import {
  saveCart as persistSaveCart,
  loadCart as persistLoadCart,
  clearCart as persistClearCart,
  CartSyncManager,
  initCartPersistence,
  getAbandonedCarts,
  showCartRecoveryNotification,
  CART_CONFIG,
  AbandonedCart
} from '@/utils/cartPersistence';
import toast from 'react-hot-toast';

// Cart Metadata Interface
export interface CartMetadata {
  userId?: string;
  sessionId: string;
  deviceId: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

// Cart Item Interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
  variant?: ProductVariant;
  notes?: string;
  addedAt: Date;
  finalPrice: number; // Price after variants adjustment
}

// Cart State Interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  lastUpdated: Date | null;
}

// Cart Actions
type CartAction = 
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; selectedVariants?: Record<string, string>; finalPrice: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_VARIANTS'; payload: { itemId: string; selectedVariants: Record<string, string>; finalPrice: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  lastUpdated: null,
};

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, selectedVariants, finalPrice } = action.payload;
      
      // Generate unique ID for cart item (product + variants combination)
      const variantKey = selectedVariants ? Object.entries(selectedVariants).map(([k, v]) => `${k}:${v}`).join('|') : '';
      const itemId = `${product.id}-${variantKey}`;
      
      // Check if item with same product and variants already exists
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          finalPrice,
          addedAt: new Date()
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity,
          selectedVariants,
          finalPrice,
          addedAt: new Date()
        };
        newItems = [...state.items, newItem];
      }
      
      const newState = {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
        lastUpdated: new Date()
      };
      
      return newState;
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.itemId);
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
        lastUpdated: new Date()
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { itemId } });
      }
      
      const newItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity, addedAt: new Date() } : item
      );
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
        lastUpdated: new Date()
      };
    }
    
    case 'UPDATE_VARIANTS': {
      const { itemId, selectedVariants, finalPrice } = action.payload;
      const newItems = state.items.map(item =>
        item.id === itemId 
          ? { ...item, selectedVariants, finalPrice, addedAt: new Date() }
          : item
      );
      
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
        lastUpdated: new Date()
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...initialState,
        lastUpdated: new Date()
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'LOAD_CART': {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
        lastUpdated: new Date()
      };
    }
    
    default:
      return state;
  }
};

// Cart Context
interface CartContextType extends CartState {
  addToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>, finalPrice?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateVariants: (itemId: string, selectedVariants: Record<string, string>, finalPrice: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, selectedVariants?: Record<string, string>) => number;
  isInCart: (productId: string, selectedVariants?: Record<string, string>) => boolean;
  // Advanced persistence features
  restoreAbandonedCart: (cartId: string) => void;
  getAbandonedCartsList: () => AbandonedCart[];
  exportCart: () => string;
  importCart: (cartData: string) => boolean;
  cartMetadata: CartMetadata | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const syncManager = useRef<CartSyncManager | null>(null);
  const [cartMetadata, setCartMetadata] = React.useState<CartMetadata | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize persistence system
  useEffect(() => {
    initCartPersistence();
    setIsInitialized(true);
  }, []);

  // Load cart with advanced persistence on mount
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      const cartData = persistLoadCart();
      if (cartData) {
        dispatch({ type: 'LOAD_CART', payload: cartData.items });
        setCartMetadata(cartData.metadata);
      } else {
        // Check for abandoned carts and show recovery notification
        const abandonedCarts = getAbandonedCarts();
        if (abandonedCarts.length > 0) {
          const latestAbandoned = abandonedCarts[0];
          const timeSinceAbandoned = Date.now() - new Date(latestAbandoned.abandonedAt).getTime();
          
          // Show recovery notification if cart was abandoned within reasonable time
          if (timeSinceAbandoned < CART_CONFIG.ABANDONED_THRESHOLD) {
            setTimeout(() => {
              showCartRecoveryNotification(latestAbandoned.items);
            }, 2000); // Show after 2 seconds
          }
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Không thể tải giỏ hàng');
    }
  }, [isInitialized]);

  // Enhanced cart saving with metadata
  useEffect(() => {
    if (!isInitialized || !state.lastUpdated) return;
    
    try {
      const success = persistSaveCart(state.items);
      if (!success) {
        toast.error('Lỗi khi lưu giỏ hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [state.items, state.lastUpdated, isInitialized]);

  // Cross-tab synchronization
  useEffect(() => {
    if (!isInitialized) return;
    
    syncManager.current = new CartSyncManager();
    
    syncManager.current.startSync((syncedItems: CartItem[]) => {
      // Only update if items are different
      const currentItemsHash = JSON.stringify(state.items.sort((a, b) => a.id.localeCompare(b.id)));
      const syncedItemsHash = JSON.stringify(syncedItems.sort((a, b) => a.id.localeCompare(b.id)));
      
      if (currentItemsHash !== syncedItemsHash) {
        dispatch({ type: 'LOAD_CART', payload: syncedItems });
        toast.success('Giỏ hàng đã được đồng bộ từ tab khác');
      }
    });

    return () => {
      if (syncManager.current) {
        syncManager.current.stopSync();
      }
    };
  }, [isInitialized, state.items]);

  // Helper Functions
  const generateItemId = (productId: string, selectedVariants?: Record<string, string>) => {
    const variantKey = selectedVariants ? Object.entries(selectedVariants).map(([k, v]) => `${k}:${v}`).join('|') : '';
    return `${productId}-${variantKey}`;
  };

  const addToCart = (
    product: Product, 
    quantity: number, 
    selectedVariants?: Record<string, string>, 
    finalPrice?: number
  ) => {
    const price = finalPrice || product.sellingPrice;
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity, selectedVariants, finalPrice: price } 
    });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const updateVariants = (itemId: string, selectedVariants: Record<string, string>, finalPrice: number) => {
    dispatch({ type: 'UPDATE_VARIANTS', payload: { itemId, selectedVariants, finalPrice } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    persistClearCart();
    setCartMetadata(null);
    toast.success('Đã xóa giỏ hàng');
  };

  const getItemQuantity = (productId: string, selectedVariants?: Record<string, string>) => {
    const itemId = generateItemId(productId, selectedVariants);
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string, selectedVariants?: Record<string, string>) => {
    return getItemQuantity(productId, selectedVariants) > 0;
  };

  // Advanced persistence features
  const restoreAbandonedCart = (cartId: string) => {
    try {
      const abandonedCarts = getAbandonedCarts();
      const targetCart = abandonedCarts.find(cart => cart.metadata.tabId === cartId);
      
      if (targetCart) {
        dispatch({ type: 'LOAD_CART', payload: targetCart.items });
        toast.success(`Đã khôi phục giỏ hàng với ${targetCart.totalItems} sản phẩm`);
      } else {
        toast.error('Không tìm thấy giỏ hàng để khôi phục');
      }
    } catch (error) {
      console.error('Failed to restore abandoned cart:', error);
      toast.error('Không thể khôi phục giỏ hàng');
    }
  };

  const getAbandonedCartsList = () => {
    return getAbandonedCarts();
  };

  const exportCart = () => {
    try {
      const cartExport = {
        items: state.items,
        exportedAt: new Date().toISOString(),
        version: CART_CONFIG.VERSION,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      };
      return JSON.stringify(cartExport);
    } catch (error) {
      console.error('Failed to export cart:', error);
      toast.error('Không thể xuất giỏ hàng');
      return '';
    }
  };

  const importCart = (cartData: string) => {
    try {
      const importedCart = JSON.parse(cartData);
      
      if (importedCart.version !== CART_CONFIG.VERSION) {
        toast.error('Phiên bản giỏ hàng không tương thích');
        return false;
      }
      
      const items = importedCart.items.map((item: CartItem) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));
      
      dispatch({ type: 'LOAD_CART', payload: items });
      toast.success(`Đã nhập ${importedCart.totalItems} sản phẩm vào giỏ hàng`);
      return true;
    } catch (error) {
      console.error('Failed to import cart:', error);
      toast.error('Không thể nhập giỏ hàng');
      return false;
    }
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateVariants,
    clearCart,
    getItemQuantity,
    isInCart,
    restoreAbandonedCart,
    getAbandonedCartsList,
    exportCart,
    importCart,
    cartMetadata,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to use Cart Context
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
