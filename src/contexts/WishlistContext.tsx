import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'wishlist_items';

// Initial state
const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WishlistState>(initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        setState({
          ...initialState,
          items: parsed.map((item: WishlistItem) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
        });
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Không thể tải danh sách yêu thích');
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, [state.items]);

  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      toast.error('Sản phẩm đã có trong danh sách yêu thích');
      return;
    }

    const wishlistItem: WishlistItem = {
      id: product.id,
      product,
      addedAt: new Date()
    };

    setState(prev => ({
      ...prev,
      items: [...prev.items, wishlistItem]
    }));

    toast.success('Đã thêm vào danh sách yêu thích');
  };

  const removeFromWishlist = (productId: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId)
    }));

    toast.success('Đã xóa khỏi danh sách yêu thích');
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setState(prev => ({
      ...prev,
      items: []
    }));
    toast.success('Đã xóa tất cả danh sách yêu thích');
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

