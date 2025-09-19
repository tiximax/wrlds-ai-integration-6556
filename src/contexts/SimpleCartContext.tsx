import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem, SimpleCartState } from '@/types/simple';
import toast from 'react-hot-toast';

// Simple cart actions
type CartAction = 
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; finalPrice: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: SimpleCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
};

// Simple cart reducer
const cartReducer = (state: SimpleCartState, action: CartAction): SimpleCartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, finalPrice } = action.payload;
      const itemId = `${product.id}`;
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity,
          finalPrice,
          addedAt: new Date()
        };
        newItems = [...state.items, newItem];
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.itemId);
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { itemId } });
      }
      
      const newItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

// Simple cart context interface
interface SimpleCartContextType extends SimpleCartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

const SimpleCartContext = createContext<SimpleCartContextType | undefined>(undefined);

// Simple cart provider
export const SimpleCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('simple-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        cartData.items.forEach((item: CartItem) => {
          dispatch({
            type: 'ADD_TO_CART',
            payload: {
              product: item.product,
              quantity: item.quantity,
              finalPrice: item.finalPrice
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('simple-cart', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [state]);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        quantity,
        finalPrice: product.sellingPrice
      }
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { itemId } });
    toast.success('Removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getItemQuantity = (productId: string) => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string) => {
    return getItemQuantity(productId) > 0;
  };

  const value: SimpleCartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return <SimpleCartContext.Provider value={value}>{children}</SimpleCartContext.Provider>;
};

// Hook to use simple cart context
export const useSimpleCart = (): SimpleCartContextType => {
  const context = useContext(SimpleCartContext);
  if (context === undefined) {
    throw new Error('useSimpleCart must be used within a SimpleCartProvider');
  }
  return context;
};

export default SimpleCartContext;