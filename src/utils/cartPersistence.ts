import { CartItem } from '@/types/product';
import toast from 'react-hot-toast';

// Storage keys
export const CART_STORAGE_KEYS = {
  PRIMARY: 'gsa-cart',
  BACKUP: 'gsa-cart-backup',
  METADATA: 'gsa-cart-metadata',
  ABANDONED: 'gsa-cart-abandoned'
} as const;

// Abandoned cart interface
export interface AbandonedCart {
  items: CartItem[];
  metadata: CartMetadata;
  abandonedAt: string;
  totalItems: number;
  totalValue: number;
}

// Cart metadata interface
export interface CartMetadata {
  version: string;
  lastSaved: string;
  expiresAt: string;
  tabId: string;
  deviceId: string;
  cartHash: string;
}

// Cart persistence configuration
export const CART_CONFIG = {
  VERSION: '1.0.0',
  EXPIRY_HOURS: 72, // Cart expires after 72 hours
  SYNC_INTERVAL: 2000, // Sync between tabs every 2 seconds
  ABANDONED_THRESHOLD: 30 * 60 * 1000, // 30 minutes for abandoned cart
  MAX_BACKUP_SIZE: 50 // Maximum number of backup carts
} as const;

// Generate unique IDs
export const generateTabId = (): string => {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateDeviceId = (): string => {
  let deviceId = localStorage.getItem('gsa-device-id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('gsa-device-id', deviceId);
  }
  return deviceId;
};

// Generate cart hash for change detection
export const generateCartHash = (items: CartItem[]): string => {
  const cartString = JSON.stringify(items.sort((a, b) => a.id.localeCompare(b.id)));
  return btoa(cartString).substr(0, 20);
};

// Create cart metadata
export const createCartMetadata = (items: CartItem[]): CartMetadata => ({
  version: CART_CONFIG.VERSION,
  lastSaved: new Date().toISOString(),
  expiresAt: new Date(Date.now() + CART_CONFIG.EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
  tabId: generateTabId(),
  deviceId: generateDeviceId(),
  cartHash: generateCartHash(items)
});

// Check if cart is expired
export const isCartExpired = (metadata: CartMetadata): boolean => {
  return new Date() > new Date(metadata.expiresAt);
};

// Save cart with metadata
export const saveCart = (items: CartItem[]): boolean => {
  try {
    const metadata = createCartMetadata(items);
    
    // Save to primary storage (localStorage)
    localStorage.setItem(CART_STORAGE_KEYS.PRIMARY, JSON.stringify(items));
    localStorage.setItem(CART_STORAGE_KEYS.METADATA, JSON.stringify(metadata));
    
    // Save to backup storage (sessionStorage)
    sessionStorage.setItem(CART_STORAGE_KEYS.BACKUP, JSON.stringify(items));
    
    return true;
  } catch (error) {
    console.error('Failed to save cart:', error);
    toast.error('Không thể lưu giỏ hàng');
    return false;
  }
};

// Load cart with validation
export const loadCart = (): { items: CartItem[]; metadata: CartMetadata | null } | null => {
  try {
    // Try to load from primary storage first
    const itemsData = localStorage.getItem(CART_STORAGE_KEYS.PRIMARY);
    const metadataData = localStorage.getItem(CART_STORAGE_KEYS.METADATA);
    
    if (itemsData && metadataData) {
      const items = JSON.parse(itemsData) as CartItem[];
      const metadata = JSON.parse(metadataData) as CartMetadata;
      
      // Check if cart is expired
      if (isCartExpired(metadata)) {
        // Move to abandoned cart before clearing
        saveAbandonedCart(items, metadata);
        clearCart();
        return null;
      }
      
      // Validate cart hash
      const currentHash = generateCartHash(items);
      if (currentHash !== metadata.cartHash) {
        console.warn('Cart hash mismatch, possible data corruption');
        // Try backup
        return loadBackupCart();
      }
      
      // Convert date strings back to Date objects
      const processedItems = items.map(item => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));
      
      return { items: processedItems, metadata };
    }
    
    // Try backup if primary fails
    return loadBackupCart();
  } catch (error) {
    console.error('Failed to load cart:', error);
    return loadBackupCart();
  }
};

// Load backup cart
export const loadBackupCart = (): { items: CartItem[]; metadata: CartMetadata | null } | null => {
  try {
    const backupData = sessionStorage.getItem(CART_STORAGE_KEYS.BACKUP);
    if (backupData) {
      const items = JSON.parse(backupData) as CartItem[];
      const processedItems = items.map(item => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));
      
      toast.success('Đã khôi phục giỏ hàng từ phiên làm việc trước');
      return { items: processedItems, metadata: null };
    }
    return null;
  } catch (error) {
    console.error('Failed to load backup cart:', error);
    return null;
  }
};

// Save abandoned cart
export const saveAbandonedCart = (items: CartItem[], metadata: CartMetadata): void => {
  try {
    const abandonedCart = {
      items,
      metadata,
      abandonedAt: new Date().toISOString(),
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0)
    };
    
    const existingAbandoned = JSON.parse(localStorage.getItem(CART_STORAGE_KEYS.ABANDONED) || '[]');
    existingAbandoned.unshift(abandonedCart);
    
    // Keep only recent abandoned carts
    const limitedAbandoned = existingAbandoned.slice(0, CART_CONFIG.MAX_BACKUP_SIZE);
    localStorage.setItem(CART_STORAGE_KEYS.ABANDONED, JSON.stringify(limitedAbandoned));
  } catch (error) {
    console.error('Failed to save abandoned cart:', error);
  }
};

// Get abandoned carts
export const getAbandonedCarts = (): AbandonedCart[] => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEYS.ABANDONED) || '[]');
    } catch (error: unknown) {
    console.error('Failed to load abandoned carts:', error);
    return [];
  }
};

// Clear cart and metadata
export const clearCart = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEYS.PRIMARY);
    localStorage.removeItem(CART_STORAGE_KEYS.METADATA);
    sessionStorage.removeItem(CART_STORAGE_KEYS.BACKUP);
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
};

// Cross-tab synchronization
export class CartSyncManager {
  private currentTabId: string;
  private syncInterval: NodeJS.Timeout | null = null;
  private onSyncCallback: ((items: CartItem[]) => void) | null = null;

  constructor() {
    this.currentTabId = generateTabId();
  }

  startSync(callback: (items: CartItem[]) => void): void {
    this.onSyncCallback = callback;
    
    // Listen for storage events (cross-tab changes)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Periodic sync check
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, CART_CONFIG.SYNC_INTERVAL);
  }

  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === CART_STORAGE_KEYS.PRIMARY && event.newValue) {
      try {
        const items = JSON.parse(event.newValue) as CartItem[];
        const processedItems = items.map(item => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        
        if (this.onSyncCallback) {
          this.onSyncCallback(processedItems);
        }
      } catch (error) {
        console.error('Failed to sync cart from other tab:', error);
      }
    }
  }

  private checkForUpdates(): void {
    const cartData = loadCart();
    if (cartData && cartData.metadata && cartData.metadata.tabId !== this.currentTabId) {
      if (this.onSyncCallback) {
        this.onSyncCallback(cartData.items);
      }
    }
  }

  getCurrentTabId(): string {
    return this.currentTabId;
  }
}

// Cart recovery utilities
export const showCartRecoveryNotification = (items: CartItem[]): void => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const message = `Bạn có ${totalItems} sản phẩm trong giỏ hàng từ phiên trước. Bạn có muốn khôi phục không?`;
  
  toast.success(message, {
    duration: 10000,
    position: 'top-center',
  });
};

// Storage cleanup utility
export const cleanupExpiredCarts = (): void => {
  try {
    const metadata = localStorage.getItem(CART_STORAGE_KEYS.METADATA);
    if (metadata) {
      const parsedMetadata = JSON.parse(metadata) as CartMetadata;
      if (isCartExpired(parsedMetadata)) {
        const items = localStorage.getItem(CART_STORAGE_KEYS.PRIMARY);
        if (items) {
          const cartItems = JSON.parse(items) as CartItem[];
          saveAbandonedCart(cartItems, parsedMetadata);
        }
        clearCart();
      }
    }

    // Clean up old abandoned carts (older than 30 days)
    const abandonedCarts = getAbandonedCarts();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const cleanedCarts = abandonedCarts.filter(cart => 
      new Date(cart.abandonedAt).getTime() > thirtyDaysAgo
    );
    localStorage.setItem(CART_STORAGE_KEYS.ABANDONED, JSON.stringify(cleanedCarts));
  } catch (error) {
    console.error('Failed to cleanup expired carts:', error);
  }
};

// Initialize cart persistence system
export const initCartPersistence = (): void => {
  // Clean up expired carts on initialization
  cleanupExpiredCarts();
  
  // Set up periodic cleanup
  setInterval(cleanupExpiredCarts, 60 * 60 * 1000); // Every hour
};
