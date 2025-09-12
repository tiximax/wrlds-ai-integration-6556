// Order Management Service - Handles all order-related operations
// Complete order lifecycle management system

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  description?: string;
  image?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
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
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderPayment {
  id: string;
  method: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  amount: number;
  currency: string;
  paymentIntentId?: string;
  transactionId?: string;
  createdAt: Date;
  processedAt?: Date;
  refundedAmount?: number;
  processingFee?: number;
  failureReason?: string;
}

export interface OrderShipping {
  method: string;
  cost: number;
  estimatedDelivery: string;
  trackingNumber?: string;
  carrier?: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  shippedAt?: Date;
  deliveredAt?: Date;
  address: ShippingAddress;
  updates: ShippingUpdate[];
}

export interface ShippingUpdate {
  id: string;
  status: OrderShipping['status'];
  message: string;
  location?: string;
  timestamp: Date;
  carrier?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded' | 'returned';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  payment: OrderPayment;
  shippingDetails: OrderShipping;
  promoCode?: {
    code: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
  };
  notes?: string;
  isGift?: boolean;
  giftMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  metadata: Record<string, any>;
}

export interface OrderFilter {
  status?: OrderStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
  shippingMethod?: string;
  search?: string;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
  statusBreakdown: Record<OrderStatus, number>;
  revenueByMonth: { month: string; revenue: number; orders: number }[];
}

export interface Receipt {
  orderId: string;
  orderNumber: string;
  customer: {
    email: string;
    name: string;
    address: ShippingAddress;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  issuedAt: Date;
  businessInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
    taxId?: string;
  };
}

export interface EmailNotification {
  type: 'order_confirmation' | 'order_shipped' | 'order_delivered' | 'order_cancelled' | 'payment_failed' | 'refund_processed';
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
}

// Order Service Class
export class OrderService {
  private orders: Map<string, Order> = new Map();
  private ordersByCustomer: Map<string, string[]> = new Map();
  private notifications: EmailNotification[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize with some mock orders for demo
    const mockOrders: Order[] = [
      {
        id: 'order_1',
        orderNumber: 'ORD-001',
        customerId: 'customer_1',
        customerEmail: 'customer@example.com',
        status: 'delivered',
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            name: 'Wireless Headphones',
            quantity: 1,
            price: 199.99,
            originalPrice: 249.99,
            image: '/images/headphones.jpg'
          }
        ],
        subtotal: 199.99,
        tax: 16.00,
        shipping: 9.99,
        discount: 0,
        total: 225.98,
        currency: 'USD',
        payment: {
          id: 'pay_1',
          method: 'card',
          status: 'completed',
          amount: 225.98,
          currency: 'USD',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          processedAt: new Date(Date.now() - 172800000)
        },
        shippingDetails: {
          method: 'standard',
          cost: 9.99,
          estimatedDelivery: '5-7 business days',
          trackingNumber: 'TRK123456789',
          carrier: 'UPS',
          status: 'delivered',
          shippedAt: new Date(Date.now() - 86400000), // Yesterday
          deliveredAt: new Date(),
          address: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
            phone: '+1234567890'
          },
          updates: [
            {
              id: 'update_1',
              status: 'shipped',
              message: 'Package shipped from warehouse',
              location: 'New York, NY',
              timestamp: new Date(Date.now() - 86400000),
              carrier: 'UPS'
            },
            {
              id: 'update_2',
              status: 'delivered',
              message: 'Package delivered to front door',
              location: 'New York, NY',
              timestamp: new Date(),
              carrier: 'UPS'
            }
          ]
        },
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(),
        confirmedAt: new Date(Date.now() - 172800000),
        shippedAt: new Date(Date.now() - 86400000),
        deliveredAt: new Date(),
        metadata: { source: 'web' }
      }
    ];

    mockOrders.forEach(order => {
      this.orders.set(order.id, order);
      
      const customerOrders = this.ordersByCustomer.get(order.customerId) || [];
      customerOrders.push(order.id);
      this.ordersByCustomer.set(order.customerId, customerOrders);
    });
  }

  // Create new order
  async createOrder(orderData: {
    customerId: string;
    customerEmail: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentData: {
      method: OrderPayment['method'];
      paymentIntentId?: string;
      transactionId?: string;
    };
    shippingMethod: string;
    shippingCost: number;
    subtotal: number;
    tax: number;
    discount?: number;
    promoCode?: {
      code: string;
      discountAmount: number;
      discountType: 'percentage' | 'fixed';
    };
    notes?: string;
    isGift?: boolean;
    giftMessage?: string;
  }): Promise<Order> {
    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const orderNumber = `ORD-${String(this.orders.size + 1).padStart(6, '0')}`;
      
      const total = orderData.subtotal + orderData.tax + orderData.shippingCost - (orderData.discount || 0);

      const order: Order = {
        id: orderId,
        orderNumber,
        customerId: orderData.customerId,
        customerEmail: orderData.customerEmail,
        status: 'pending',
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shippingCost,
        discount: orderData.discount || 0,
        total,
        currency: 'USD',
        payment: {
          id: `pay_${Date.now()}`,
          method: orderData.paymentData.method,
          status: 'pending',
          amount: total,
          currency: 'USD',
          paymentIntentId: orderData.paymentData.paymentIntentId,
          transactionId: orderData.paymentData.transactionId,
          createdAt: new Date()
        },
        shippingDetails: {
          method: orderData.shippingMethod,
          cost: orderData.shippingCost,
          estimatedDelivery: this.calculateEstimatedDelivery(orderData.shippingMethod),
          status: 'pending',
          address: orderData.shippingAddress,
          updates: []
        },
        promoCode: orderData.promoCode,
        notes: orderData.notes,
        isGift: orderData.isGift,
        giftMessage: orderData.giftMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { source: 'web' }
      };

      // Save order
      this.orders.set(orderId, order);
      
      // Update customer orders index
      const customerOrders = this.ordersByCustomer.get(orderData.customerId) || [];
      customerOrders.push(orderId);
      this.ordersByCustomer.set(orderData.customerId, customerOrders);

      // Send order confirmation email
      await this.sendOrderConfirmationEmail(order);

      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  // Get orders by customer
  async getOrdersByCustomer(customerId: string, options?: {
    limit?: number;
    offset?: number;
    status?: OrderStatus[];
  }): Promise<{ orders: Order[]; total: number }> {
    const orderIds = this.ordersByCustomer.get(customerId) || [];
    let orders = orderIds.map(id => this.orders.get(id)!).filter(Boolean);

    // Filter by status
    if (options?.status && options.status.length > 0) {
      orders = orders.filter(order => options.status!.includes(order.status));
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = orders.length;
    
    // Apply pagination
    if (options?.offset) {
      orders = orders.slice(options.offset);
    }
    if (options?.limit) {
      orders = orders.slice(0, options.limit);
    }

    return { orders, total };
  }

  // Search orders
  async searchOrders(filter: OrderFilter, options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ orders: Order[]; total: number }> {
    let orders = Array.from(this.orders.values());

    // Apply filters
    if (filter.status && filter.status.length > 0) {
      orders = orders.filter(order => filter.status!.includes(order.status));
    }

    if (filter.customerId) {
      orders = orders.filter(order => order.customerId === filter.customerId);
    }

    if (filter.dateFrom) {
      orders = orders.filter(order => order.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      orders = orders.filter(order => order.createdAt <= filter.dateTo!);
    }

    if (filter.minAmount) {
      orders = orders.filter(order => order.total >= filter.minAmount!);
    }

    if (filter.maxAmount) {
      orders = orders.filter(order => order.total <= filter.maxAmount!);
    }

    if (filter.paymentMethod) {
      orders = orders.filter(order => order.payment.method === filter.paymentMethod);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      orders = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customerEmail.toLowerCase().includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm))
      );
    }

    // Sort orders
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';
    
    orders.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'createdAt':
          compareValue = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'total':
          compareValue = a.total - b.total;
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    const total = orders.length;
    
    // Apply pagination
    if (options?.offset) {
      orders = orders.slice(options.offset);
    }
    if (options?.limit) {
      orders = orders.slice(0, options.limit);
    }

    return { orders, total };
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();

    // Set status-specific timestamps
    switch (status) {
      case 'confirmed':
        order.confirmedAt = new Date();
        break;
      case 'shipped':
        order.shippedAt = new Date();
        order.shippingDetails.status = 'shipped';
        order.shippingDetails.shippedAt = new Date();
        break;
      case 'delivered':
        order.deliveredAt = new Date();
        order.shippingDetails.status = 'delivered';
        order.shippingDetails.deliveredAt = new Date();
        break;
      case 'cancelled':
        order.cancelledAt = new Date();
        order.cancellationReason = notes;
        break;
    }

    this.orders.set(orderId, order);

    // Send notifications for status changes
    await this.handleStatusChangeNotification(order, previousStatus, status);

    return order;
  }

  // Update shipping tracking
  async updateShippingTracking(orderId: string, update: {
    trackingNumber?: string;
    carrier?: string;
    status: ShippingUpdate['status'];
    message: string;
    location?: string;
  }): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (update.trackingNumber) {
      order.shippingDetails.trackingNumber = update.trackingNumber;
    }
    if (update.carrier) {
      order.shippingDetails.carrier = update.carrier;
    }

    order.shippingDetails.status = update.status;
    order.updatedAt = new Date();

    // Add shipping update
    const shippingUpdate: ShippingUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: update.status,
      message: update.message,
      location: update.location,
      timestamp: new Date(),
      carrier: update.carrier
    };

    order.shippingDetails.updates.push(shippingUpdate);

    // Update order status based on shipping status
    if (update.status === 'delivered') {
      order.status = 'delivered';
      order.deliveredAt = new Date();
      order.shippingDetails.deliveredAt = new Date();
    }

    this.orders.set(orderId, order);

    // Send shipping notification
    if (update.status === 'shipped') {
      await this.sendShippingNotificationEmail(order);
    } else if (update.status === 'delivered') {
      await this.sendDeliveryNotificationEmail(order);
    }

    return order;
  }

  // Process refund
  async processRefund(orderId: string, amount?: number, reason?: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const refundAmount = amount || order.total;
    
    // Update payment status
    order.payment.status = amount === order.total ? 'refunded' : 'partially_refunded';
    order.payment.refundedAmount = (order.payment.refundedAmount || 0) + refundAmount;
    
    // Update order status
    if (amount === order.total) {
      order.status = 'refunded';
    }
    
    order.updatedAt = new Date();
    this.orders.set(orderId, order);

    // Send refund notification
    await this.sendRefundNotificationEmail(order, refundAmount, reason);

    return order;
  }

  // Generate receipt
  async generateReceipt(orderId: string): Promise<Receipt> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const receipt: Receipt = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customer: {
        email: order.customerEmail,
        name: `${order.shippingDetails.address.firstName} ${order.shippingDetails.address.lastName}`,
        address: order.shippingDetails.address
      },
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      total: order.total,
      currency: order.currency,
      paymentMethod: order.payment.method,
      transactionId: order.payment.transactionId || order.payment.id,
      issuedAt: new Date(),
      businessInfo: {
        name: 'Your Store Name',
        address: '123 Business St, City, State 12345',
        email: 'support@yourstore.com',
        phone: '+1-555-123-4567',
        taxId: 'TAX123456789'
      }
    };

    return receipt;
  }

  // Get order analytics
  async getOrderAnalytics(dateFrom?: Date, dateTo?: Date): Promise<OrderSummary> {
    let orders = Array.from(this.orders.values());

    // Filter by date range
    if (dateFrom) {
      orders = orders.filter(order => order.createdAt >= dateFrom);
    }
    if (dateTo) {
      orders = orders.filter(order => order.createdAt <= dateTo);
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;
    const completedOrders = orders.filter(order => ['delivered', 'completed'].includes(order.status)).length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    const refundedOrders = orders.filter(order => order.status === 'refunded').length;

    // Status breakdown
    const statusBreakdown: Record<OrderStatus, number> = {
      pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0,
      completed: 0, cancelled: 0, refunded: 0, returned: 0
    };

    orders.forEach(order => {
      statusBreakdown[order.status]++;
    });

    // Top products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Revenue by month
    const revenueByMonth: { month: string; revenue: number; orders: number }[] = [];
    const monthlyData: Record<string, { revenue: number; orders: number }> = {};

    orders.forEach(order => {
      const monthKey = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, orders: 0 };
      }
      monthlyData[monthKey].revenue += order.total;
      monthlyData[monthKey].orders++;
    });

    Object.entries(monthlyData).forEach(([month, data]) => {
      revenueByMonth.push({ month, ...data });
    });

    revenueByMonth.sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      completedOrders,
      cancelledOrders,
      refundedOrders,
      topProducts,
      statusBreakdown,
      revenueByMonth
    };
  }

  // Email notification methods
  private async sendOrderConfirmationEmail(order: Order): Promise<void> {
    const notification: EmailNotification = {
      type: 'order_confirmation',
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      template: 'order_confirmation',
      data: {
        orderNumber: order.orderNumber,
        customerName: `${order.shippingDetails.address.firstName} ${order.shippingDetails.address.lastName}`,
        items: order.items,
        total: order.total,
        estimatedDelivery: order.shippingDetails.estimatedDelivery
      },
      status: 'pending'
    };

    // Simulate sending email
    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date();
    }, 1000);

    this.notifications.push(notification);
  }

  private async sendShippingNotificationEmail(order: Order): Promise<void> {
    const notification: EmailNotification = {
      type: 'order_shipped',
      to: order.customerEmail,
      subject: `Your Order Has Shipped - ${order.orderNumber}`,
      template: 'order_shipped',
      data: {
        orderNumber: order.orderNumber,
        trackingNumber: order.shippingDetails.trackingNumber,
        carrier: order.shippingDetails.carrier,
        estimatedDelivery: order.shippingDetails.estimatedDelivery
      },
      status: 'pending'
    };

    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date();
    }, 1000);

    this.notifications.push(notification);
  }

  private async sendDeliveryNotificationEmail(order: Order): Promise<void> {
    const notification: EmailNotification = {
      type: 'order_delivered',
      to: order.customerEmail,
      subject: `Your Order Has Been Delivered - ${order.orderNumber}`,
      template: 'order_delivered',
      data: {
        orderNumber: order.orderNumber,
        deliveredAt: order.deliveredAt,
        items: order.items
      },
      status: 'pending'
    };

    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date();
    }, 1000);

    this.notifications.push(notification);
  }

  private async sendRefundNotificationEmail(order: Order, refundAmount: number, reason?: string): Promise<void> {
    const notification: EmailNotification = {
      type: 'refund_processed',
      to: order.customerEmail,
      subject: `Refund Processed - ${order.orderNumber}`,
      template: 'refund_processed',
      data: {
        orderNumber: order.orderNumber,
        refundAmount,
        reason,
        originalAmount: order.total
      },
      status: 'pending'
    };

    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date();
    }, 1000);

    this.notifications.push(notification);
  }

  private async handleStatusChangeNotification(order: Order, previousStatus: OrderStatus, newStatus: OrderStatus): Promise<void> {
    // Send appropriate notifications based on status changes
    if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
      const notification: EmailNotification = {
        type: 'order_cancelled',
        to: order.customerEmail,
        subject: `Order Cancelled - ${order.orderNumber}`,
        template: 'order_cancelled',
        data: {
          orderNumber: order.orderNumber,
          reason: order.cancellationReason,
          refundInfo: 'Your refund will be processed within 5-7 business days.'
        },
        status: 'pending'
      };

      setTimeout(() => {
        notification.status = 'sent';
        notification.sentAt = new Date();
      }, 1000);

      this.notifications.push(notification);
    }
  }

  // Helper methods
  private calculateEstimatedDelivery(shippingMethod: string): string {
    const deliveryTimes: Record<string, string> = {
      standard: '5-7 business days',
      express: '2-3 business days',
      overnight: 'Next business day',
      pickup: 'Available for pickup'
    };

    return deliveryTimes[shippingMethod] || '5-7 business days';
  }

  // Get all notifications (for admin dashboard)
  async getNotifications(): Promise<EmailNotification[]> {
    return this.notifications.sort((a, b) => {
      const aTime = a.sentAt || new Date(0);
      const bTime = b.sentAt || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  }
}

// Global order service instance
let globalOrderService: OrderService | null = null;

export const getOrderService = (): OrderService => {
  if (!globalOrderService) {
    globalOrderService = new OrderService();
  }
  return globalOrderService;
};

export default OrderService;
