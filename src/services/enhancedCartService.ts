// Enhanced Cart Service - Advanced shopping cart features
// Includes cart sharing, saved carts, bulk operations, price alerts, and abandonment recovery

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity?: number;
  sku?: string;
  variant?: {
    size?: string;
    color?: string;
    style?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  addedAt: Date;
  isAvailable: boolean;
  priceAlert?: {
    targetPrice: number;
    enabled: boolean;
    createdAt: Date;
  };
}

export interface SavedCart {
  id: string;
  name: string;
  description?: string;
  customerId: string;
  items: CartItem[];
  totalValue: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
  isPublic: boolean;
  tags: string[];
  occasion?: string; // birthday, wedding, holiday, etc.
}

export interface SharedCart {
  id: string;
  shareToken: string;
  originalCartId: string;
  sharedBy: string;
  sharedWith?: string[];
  accessLevel: 'view' | 'edit' | 'admin';
  expiresAt?: Date;
  createdAt: Date;
  lastAccessedAt?: Date;
  accessCount: number;
  isPasswordProtected: boolean;
  password?: string;
  allowAnonymousAccess: boolean;
  customMessage?: string;
}

export interface BulkOperation {
  type: 'update_quantity' | 'remove_items' | 'move_to_saved' | 'apply_discount' | 'change_variant';
  itemIds: string[];
  data: Record<string, any>;
  executedAt: Date;
  executedBy: string;
  result: {
    success: boolean;
    affectedItems: number;
    errors: string[];
  };
}

export interface PriceAlert {
  id: string;
  customerId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  notificationsSent: number;
  maxNotifications: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface CartAbandonmentData {
  sessionId: string;
  customerId?: string;
  email?: string;
  cartItems: CartItem[];
  totalValue: number;
  abandonedAt: Date;
  recoveryAttempts: number;
  lastRecoveryAttempt?: Date;
  isRecovered: boolean;
  recoveredAt?: Date;
  recoveryEmails: {
    sentAt: Date;
    type: 'initial' | 'reminder' | 'final';
    opened?: Date;
    clicked?: Date;
  }[];
}

export interface CartRecommendation {
  type: 'frequently_bought_together' | 'similar_products' | 'price_drop' | 'back_in_stock' | 'cross_sell' | 'upsell';
  productId: string;
  confidence: number;
  reason: string;
  discount?: number;
  priority: number;
}

export interface CartAnalytics {
  totalCarts: number;
  activeCarts: number;
  abandonedCarts: number;
  savedCarts: number;
  sharedCarts: number;
  averageCartValue: number;
  averageItemsPerCart: number;
  conversionRate: number;
  abandonmentRate: number;
  recoveryRate: number;
  topProducts: { productId: string; name: string; addedCount: number }[];
  peakHours: { hour: number; cartActivity: number }[];
}

// Enhanced Cart Service Class
export class EnhancedCartService {
  private savedCarts: Map<string, SavedCart> = new Map();
  private sharedCarts: Map<string, SharedCart> = new Map();
  private priceAlerts: Map<string, PriceAlert> = new Map();
  private abandonmentData: Map<string, CartAbandonmentData> = new Map();
  private bulkOperations: BulkOperation[] = [];

  constructor() {
    this.initializeMockData();
    this.startPriceAlertMonitoring();
    this.startAbandonmentTracking();
  }

  private initializeMockData(): void {
    // Mock saved carts
    const mockSavedCart: SavedCart = {
      id: 'saved_cart_1',
      name: 'Holiday Shopping List',
      description: 'Items for Christmas gifts',
      customerId: 'customer_1',
      items: [
        {
          id: 'item_1',
          productId: 'prod_1',
          name: 'Wireless Headphones',
          price: 199.99,
          originalPrice: 249.99,
          quantity: 2,
          addedAt: new Date(),
          isAvailable: true
        } as CartItem
      ],
      totalValue: 399.98,
      itemCount: 2,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
      lastAccessedAt: new Date(Date.now() - 1800000),
      isPublic: false,
      tags: ['holiday', 'gifts', 'electronics'],
      occasion: 'Christmas'
    };

    this.savedCarts.set(mockSavedCart.id, mockSavedCart);

    // Mock price alerts
    const mockPriceAlert: PriceAlert = {
      id: 'alert_1',
      customerId: 'customer_1',
      productId: 'prod_1',
      targetPrice: 150.00,
      currentPrice: 199.99,
      isActive: true,
      createdAt: new Date(Date.now() - 172800000),
      notificationsSent: 0,
      maxNotifications: 3,
      emailNotifications: true,
      pushNotifications: true
    };

    this.priceAlerts.set(mockPriceAlert.id, mockPriceAlert);
  }

  // Saved Cart Management
  async saveCart(
    customerId: string,
    cartItems: CartItem[],
    name: string,
    options?: {
      description?: string;
      tags?: string[];
      occasion?: string;
      isPublic?: boolean;
    }
  ): Promise<SavedCart> {
    try {
      const cartId = `saved_cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      const savedCart: SavedCart = {
        id: cartId,
        name,
        description: options?.description,
        customerId,
        items: cartItems.map(item => ({ ...item, addedAt: new Date() })),
        totalValue,
        itemCount,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessedAt: new Date(),
        isPublic: options?.isPublic || false,
        tags: options?.tags || [],
        occasion: options?.occasion
      };

      this.savedCarts.set(cartId, savedCart);
      return savedCart;
    } catch (error) {
      throw new Error(`Failed to save cart: ${error}`);
    }
  }

  async getSavedCarts(
    customerId: string,
    options?: {
      tags?: string[];
      occasion?: string;
      isPublic?: boolean;
      sortBy?: 'name' | 'created' | 'updated' | 'value';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
    }
  ): Promise<SavedCart[]> {
    let carts = Array.from(this.savedCarts.values())
      .filter(cart => cart.customerId === customerId);

    // Apply filters
    if (options?.tags && options.tags.length > 0) {
      carts = carts.filter(cart => 
        options.tags!.some(tag => cart.tags.includes(tag))
      );
    }

    if (options?.occasion) {
      carts = carts.filter(cart => cart.occasion === options.occasion);
    }

    if (options?.isPublic !== undefined) {
      carts = carts.filter(cart => cart.isPublic === options.isPublic);
    }

    // Apply sorting
    const sortBy = options?.sortBy || 'updated';
    const sortOrder = options?.sortOrder || 'desc';

    carts.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'created':
          compareValue = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updated':
          compareValue = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'value':
          compareValue = a.totalValue - b.totalValue;
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Apply limit
    if (options?.limit) {
      carts = carts.slice(0, options.limit);
    }

    return carts;
  }

  async updateSavedCart(cartId: string, updates: Partial<SavedCart>): Promise<SavedCart> {
    const cart = this.savedCarts.get(cartId);
    if (!cart) {
      throw new Error('Saved cart not found');
    }

    const updatedCart: SavedCart = {
      ...cart,
      ...updates,
      updatedAt: new Date(),
      lastAccessedAt: new Date()
    };

    // Recalculate totals if items were updated
    if (updates.items) {
      updatedCart.totalValue = updates.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      updatedCart.itemCount = updates.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    this.savedCarts.set(cartId, updatedCart);
    return updatedCart;
  }

  async deleteSavedCart(cartId: string): Promise<boolean> {
    return this.savedCarts.delete(cartId);
  }

  // Cart Sharing
  async shareCart(
    cartId: string,
    sharedBy: string,
    options?: {
      accessLevel?: 'view' | 'edit' | 'admin';
      expiresIn?: number; // hours
      password?: string;
      allowAnonymousAccess?: boolean;
      customMessage?: string;
      sharedWith?: string[];
    }
  ): Promise<SharedCart> {
    try {
      const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shareToken = `${shareId}_${Math.random().toString(36).substr(2, 16)}`;
      const expiresAt = options?.expiresIn 
        ? new Date(Date.now() + (options.expiresIn * 60 * 60 * 1000))
        : undefined;

      const sharedCart: SharedCart = {
        id: shareId,
        shareToken,
        originalCartId: cartId,
        sharedBy,
        sharedWith: options?.sharedWith,
        accessLevel: options?.accessLevel || 'view',
        expiresAt,
        createdAt: new Date(),
        accessCount: 0,
        isPasswordProtected: !!options?.password,
        password: options?.password,
        allowAnonymousAccess: options?.allowAnonymousAccess || true,
        customMessage: options?.customMessage
      };

      this.sharedCarts.set(shareId, sharedCart);
      return sharedCart;
    } catch (error) {
      throw new Error(`Failed to share cart: ${error}`);
    }
  }

  async getSharedCart(
    shareToken: string, 
    options?: { password?: string; userId?: string }
  ): Promise<{ sharedCart: SharedCart; cart: SavedCart } | null> {
    try {
      const sharedCart = Array.from(this.sharedCarts.values())
        .find(sc => sc.shareToken === shareToken);

      if (!sharedCart) {
        return null;
      }

      // Check expiration
      if (sharedCart.expiresAt && sharedCart.expiresAt < new Date()) {
        return null;
      }

      // Check password
      if (sharedCart.isPasswordProtected && sharedCart.password !== options?.password) {
        throw new Error('Invalid password');
      }

      // Check access permissions
      if (!sharedCart.allowAnonymousAccess && 
          (!options?.userId || 
           (sharedCart.sharedWith && !sharedCart.sharedWith.includes(options.userId)))) {
        throw new Error('Access denied');
      }

      // Update access tracking
      sharedCart.accessCount++;
      sharedCart.lastAccessedAt = new Date();

      const originalCart = this.savedCarts.get(sharedCart.originalCartId);
      if (!originalCart) {
        throw new Error('Original cart not found');
      }

      return { sharedCart, cart: originalCart };
    } catch (error) {
      throw error;
    }
  }

  async revokeCartShare(shareId: string): Promise<boolean> {
    return this.sharedCarts.delete(shareId);
  }

  // Bulk Operations
  async performBulkOperation(
    operation: BulkOperation['type'],
    itemIds: string[],
    data: Record<string, any>,
    executedBy: string
  ): Promise<BulkOperation> {
    try {
      const bulkOp: BulkOperation = {
        type: operation,
        itemIds,
        data,
        executedAt: new Date(),
        executedBy,
        result: {
          success: false,
          affectedItems: 0,
          errors: []
        }
      };

      // Execute the operation based on type
      switch (operation) {
        case 'update_quantity':
          bulkOp.result = await this.bulkUpdateQuantity(itemIds, data.quantity);
          break;
        case 'remove_items':
          bulkOp.result = await this.bulkRemoveItems(itemIds);
          break;
        case 'move_to_saved':
          bulkOp.result = await this.bulkMoveToSaved(itemIds, data.savedCartId);
          break;
        case 'apply_discount':
          bulkOp.result = await this.bulkApplyDiscount(itemIds, data.discountCode);
          break;
        case 'change_variant':
          bulkOp.result = await this.bulkChangeVariant(itemIds, data.variant);
          break;
        default:
          throw new Error(`Unsupported bulk operation: ${operation}`);
      }

      this.bulkOperations.push(bulkOp);
      return bulkOp;
    } catch (error) {
      throw new Error(`Bulk operation failed: ${error}`);
    }
  }

  private async bulkUpdateQuantity(itemIds: string[], quantity: number): Promise<BulkOperation['result']> {
    // Mock implementation
    return {
      success: true,
      affectedItems: itemIds.length,
      errors: []
    };
  }

  private async bulkRemoveItems(itemIds: string[]): Promise<BulkOperation['result']> {
    // Mock implementation
    return {
      success: true,
      affectedItems: itemIds.length,
      errors: []
    };
  }

  private async bulkMoveToSaved(itemIds: string[], savedCartId: string): Promise<BulkOperation['result']> {
    // Mock implementation
    return {
      success: true,
      affectedItems: itemIds.length,
      errors: []
    };
  }

  private async bulkApplyDiscount(itemIds: string[], discountCode: string): Promise<BulkOperation['result']> {
    // Mock implementation - validate discount code and apply
    const validCodes = ['SAVE10', 'BULK20', 'WELCOME5'];
    if (!validCodes.includes(discountCode)) {
      return {
        success: false,
        affectedItems: 0,
        errors: [`Invalid discount code: ${discountCode}`]
      };
    }

    return {
      success: true,
      affectedItems: itemIds.length,
      errors: []
    };
  }

  private async bulkChangeVariant(itemIds: string[], variant: Record<string, string>): Promise<BulkOperation['result']> {
    // Mock implementation
    return {
      success: true,
      affectedItems: itemIds.length,
      errors: []
    };
  }

  // Price Alert Management
  async createPriceAlert(
    customerId: string,
    productId: string,
    targetPrice: number,
    currentPrice: number,
    options?: {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      maxNotifications?: number;
    }
  ): Promise<PriceAlert> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const priceAlert: PriceAlert = {
      id: alertId,
      customerId,
      productId,
      targetPrice,
      currentPrice,
      isActive: true,
      createdAt: new Date(),
      notificationsSent: 0,
      maxNotifications: options?.maxNotifications || 3,
      emailNotifications: options?.emailNotifications !== false,
      pushNotifications: options?.pushNotifications || false
    };

    this.priceAlerts.set(alertId, priceAlert);
    return priceAlert;
  }

  async getPriceAlerts(customerId: string, options?: { isActive?: boolean }): Promise<PriceAlert[]> {
    let alerts = Array.from(this.priceAlerts.values())
      .filter(alert => alert.customerId === customerId);

    if (options?.isActive !== undefined) {
      alerts = alerts.filter(alert => alert.isActive === options.isActive);
    }

    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updatePriceAlert(alertId: string, updates: Partial<PriceAlert>): Promise<PriceAlert> {
    const alert = this.priceAlerts.get(alertId);
    if (!alert) {
      throw new Error('Price alert not found');
    }

    const updatedAlert = { ...alert, ...updates };
    this.priceAlerts.set(alertId, updatedAlert);
    return updatedAlert;
  }

  async deletePriceAlert(alertId: string): Promise<boolean> {
    return this.priceAlerts.delete(alertId);
  }

  private startPriceAlertMonitoring(): void {
    // Check price alerts every 5 minutes
    setInterval(async () => {
      for (const alert of this.priceAlerts.values()) {
        if (alert.isActive && alert.notificationsSent < alert.maxNotifications) {
          // Mock price check - in real app, this would check actual product prices
          const currentPrice = await this.getCurrentPrice(alert.productId);
          
          if (currentPrice <= alert.targetPrice) {
            await this.triggerPriceAlert(alert, currentPrice);
          }
        }
      }
    }, 5 * 60 * 1000);
  }

  private async getCurrentPrice(productId: string): Promise<number> {
    // Mock implementation - would fetch real price from product service
    return Math.random() * 200 + 50; // Random price between 50-250
  }

  private async triggerPriceAlert(alert: PriceAlert, currentPrice: number): Promise<void> {
    alert.currentPrice = currentPrice;
    alert.triggeredAt = new Date();
    alert.notificationsSent++;

    // Send notifications (mock implementation)
    if (alert.emailNotifications) {
      console.log(`Email sent: Price alert for product ${alert.productId} - now $${currentPrice}`);
    }

    if (alert.pushNotifications) {
      console.log(`Push notification sent: Price alert for product ${alert.productId}`);
    }

    // Deactivate if max notifications reached
    if (alert.notificationsSent >= alert.maxNotifications) {
      alert.isActive = false;
    }
  }

  // Cart Abandonment Recovery
  async trackCartAbandonment(
    sessionId: string,
    cartItems: CartItem[],
    customerId?: string,
    email?: string
  ): Promise<CartAbandonmentData> {
    const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const abandonmentData: CartAbandonmentData = {
      sessionId,
      customerId,
      email,
      cartItems,
      totalValue,
      abandonedAt: new Date(),
      recoveryAttempts: 0,
      isRecovered: false,
      recoveryEmails: []
    };

    this.abandonmentData.set(sessionId, abandonmentData);
    
    // Schedule recovery emails
    this.scheduleRecoveryEmails(abandonmentData);
    
    return abandonmentData;
  }

  private scheduleRecoveryEmails(abandonmentData: CartAbandonmentData): void {
    // Schedule recovery emails at different intervals
    const recoverySchedule = [
      { delay: 1 * 60 * 60 * 1000, type: 'initial' }, // 1 hour
      { delay: 24 * 60 * 60 * 1000, type: 'reminder' }, // 1 day
      { delay: 72 * 60 * 60 * 1000, type: 'final' } // 3 days
    ];

    recoverySchedule.forEach((schedule) => {
      setTimeout(async () => {
        if (!abandonmentData.isRecovered && abandonmentData.email) {
          await this.sendRecoveryEmail(abandonmentData, schedule.type as any);
        }
      }, schedule.delay);
    });
  }

  private async sendRecoveryEmail(
    abandonmentData: CartAbandonmentData, 
    type: 'initial' | 'reminder' | 'final'
  ): Promise<void> {
    const recoveryEmail = {
      sentAt: new Date(),
      type
    };

    abandonmentData.recoveryEmails.push(recoveryEmail);
    abandonmentData.recoveryAttempts++;
    abandonmentData.lastRecoveryAttempt = new Date();

    // Mock email sending
    console.log(`Recovery email sent: ${type} for session ${abandonmentData.sessionId}`);
  }

  async markCartAsRecovered(sessionId: string): Promise<boolean> {
    const abandonmentData = this.abandonmentData.get(sessionId);
    if (!abandonmentData) {
      return false;
    }

    abandonmentData.isRecovered = true;
    abandonmentData.recoveredAt = new Date();
    return true;
  }

  async getAbandonmentAnalytics(dateFrom?: Date, dateTo?: Date): Promise<{
    totalAbandoned: number;
    totalRecovered: number;
    recoveryRate: number;
    avgCartValue: number;
    topReasons: string[];
    recoveryByEmailType: Record<string, number>;
  }> {
    let abandonments = Array.from(this.abandonmentData.values());

    if (dateFrom) {
      abandonments = abandonments.filter(a => a.abandonedAt >= dateFrom);
    }
    if (dateTo) {
      abandonments = abandonments.filter(a => a.abandonedAt <= dateTo);
    }

    const totalAbandoned = abandonments.length;
    const totalRecovered = abandonments.filter(a => a.isRecovered).length;
    const recoveryRate = totalAbandoned > 0 ? totalRecovered / totalAbandoned : 0;
    const avgCartValue = abandonments.reduce((sum, a) => sum + a.totalValue, 0) / totalAbandoned || 0;

    return {
      totalAbandoned,
      totalRecovered,
      recoveryRate,
      avgCartValue,
      topReasons: ['price_comparison', 'unexpected_costs', 'complex_checkout', 'security_concerns'],
      recoveryByEmailType: {
        initial: abandonments.filter(a => a.recoveryEmails.some(e => e.type === 'initial')).length,
        reminder: abandonments.filter(a => a.recoveryEmails.some(e => e.type === 'reminder')).length,
        final: abandonments.filter(a => a.recoveryEmails.some(e => e.type === 'final')).length
      }
    };
  }

  // Cart Recommendations
  async getCartRecommendations(cartItems: CartItem[]): Promise<CartRecommendation[]> {
    const recommendations: CartRecommendation[] = [];

    // Frequently bought together
    if (cartItems.length > 0) {
      recommendations.push({
        type: 'frequently_bought_together',
        productId: 'rec_prod_1',
        confidence: 0.85,
        reason: 'Customers who bought these items also purchased this',
        priority: 1
      });
    }

    // Cross-sell opportunities
    const hasElectronics = cartItems.some(item => item.category?.name.toLowerCase().includes('electronics'));
    if (hasElectronics) {
      recommendations.push({
        type: 'cross_sell',
        productId: 'accessory_1',
        confidence: 0.72,
        reason: 'Perfect accessory for your electronics',
        priority: 2
      });
    }

    // Price-based upselling
    const avgPrice = cartItems.reduce((sum, item) => sum + item.price, 0) / cartItems.length;
    if (avgPrice > 100) {
      recommendations.push({
        type: 'upsell',
        productId: 'premium_version',
        confidence: 0.68,
        reason: 'Upgrade to premium version',
        discount: 10,
        priority: 3
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  // Analytics
  async getCartAnalytics(): Promise<CartAnalytics> {
    const savedCartsArray = Array.from(this.savedCarts.values());
    const sharedCartsArray = Array.from(this.sharedCarts.values());
    const abandonmentsArray = Array.from(this.abandonmentData.values());

    const totalCarts = savedCartsArray.length;
    const activeCarts = savedCartsArray.filter(cart => 
      Date.now() - cart.lastAccessedAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;

    const averageCartValue = savedCartsArray.reduce((sum, cart) => sum + cart.totalValue, 0) / totalCarts || 0;
    const averageItemsPerCart = savedCartsArray.reduce((sum, cart) => sum + cart.itemCount, 0) / totalCarts || 0;

    const recoveredCarts = abandonmentsArray.filter(a => a.isRecovered).length;
    const recoveryRate = abandonmentsArray.length > 0 ? recoveredCarts / abandonmentsArray.length : 0;

    // Mock additional analytics
    return {
      totalCarts,
      activeCarts,
      abandonedCarts: abandonmentsArray.length,
      savedCarts: totalCarts,
      sharedCarts: sharedCartsArray.length,
      averageCartValue,
      averageItemsPerCart,
      conversionRate: 0.15, // Mock data
      abandonmentRate: 0.70, // Mock data
      recoveryRate,
      topProducts: [
        { productId: 'prod_1', name: 'Wireless Headphones', addedCount: 150 },
        { productId: 'prod_2', name: 'Smartphone Case', addedCount: 120 },
        { productId: 'prod_3', name: 'Gaming Mouse', addedCount: 95 }
      ],
      peakHours: [
        { hour: 9, cartActivity: 45 },
        { hour: 12, cartActivity: 60 },
        { hour: 15, cartActivity: 55 },
        { hour: 19, cartActivity: 80 },
        { hour: 21, cartActivity: 70 }
      ]
    };
  }

  private startAbandonmentTracking(): void {
    // Track cart abandonment patterns
    setInterval(() => {
      // Check for abandoned carts and trigger recovery sequences
      console.log('Checking for cart abandonment patterns...');
    }, 10 * 60 * 1000); // Every 10 minutes
  }
}

// Global enhanced cart service instance
let globalEnhancedCartService: EnhancedCartService | null = null;

export const getEnhancedCartService = (): EnhancedCartService => {
  if (!globalEnhancedCartService) {
    globalEnhancedCartService = new EnhancedCartService();
  }
  return globalEnhancedCartService;
};

export default EnhancedCartService;
