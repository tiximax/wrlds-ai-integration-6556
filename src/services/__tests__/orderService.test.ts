import { describe, it, expect, beforeEach } from 'vitest';
import {
  OrderService,
  Order,
  OrderItem,
  OrderStatus,
  ShippingAddress
} from '../orderService';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService();
  });

  const mockShippingAddress: ShippingAddress = {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Corp',
    address: '123 Main St',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US',
    phone: '+1-555-0123',
    isDefault: true
  };

  const mockOrderItems: OrderItem[] = [
    {
      id: 'item_1',
      productId: 'prod_1',
      name: 'Test Product 1',
      quantity: 2,
      price: 29.99
    },
    {
      id: 'item_2',
      productId: 'prod_2',
      name: 'Test Product 2',
      quantity: 1,
      price: 49.99
    }
  ];

  describe('Order Creation', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        customerId: 'customer_123',
        customerEmail: 'customer@test.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: {
          method: 'card' as const,
          paymentIntentId: 'pi_test_123'
        },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97,
        tax: 8.80
      };

      const order = await service.createOrder(orderData);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.customerId).toBe(orderData.customerId);
      expect(order.customerEmail).toBe(orderData.customerEmail);
      expect(order.status).toBe('pending');
      expect(order.items).toHaveLength(2);
      expect(order.total).toBeGreaterThan(0);
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.payment.method).toBe('card');
    });

    it('should create order with promo code', async () => {
      const orderData = {
        customerId: 'customer_123',
        customerEmail: 'customer@test.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: {
          method: 'paypal' as const,
          paymentIntentId: 'pi_test_456'
        },
        shippingMethod: 'express',
        shippingCost: 14.99,
        subtotal: 109.97,
        tax: 8.80,
        discount: 10.00,
        promoCode: {
          code: 'SAVE10',
          discountAmount: 10.00,
          discountType: 'fixed' as const
        }
      };

      const order = await service.createOrder(orderData);

      expect(order.promoCode).toBeDefined();
      expect(order.promoCode?.code).toBe('SAVE10');
      expect(order.discount).toBe(10.00);
      expect(order.payment.method).toBe('paypal');
    });

    it('should create order with gift options', async () => {
      const orderData = {
        customerId: 'customer_123',
        customerEmail: 'customer@test.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: {
          method: 'card' as const
        },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97,
        tax: 8.80,
        isGift: true,
        giftMessage: 'Happy Birthday!',
        notes: 'Please handle with care'
      };

      const order = await service.createOrder(orderData);

      expect(order.isGift).toBe(true);
      expect(order.giftMessage).toBe('Happy Birthday!');
      expect(order.notes).toBe('Please handle with care');
    });
  });

  describe('Order Retrieval', () => {
    let testOrder: Order;

    beforeEach(async () => {
      testOrder = await service.createOrder({
        customerId: 'customer_test',
        customerEmail: 'test@example.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: {
          method: 'card' as const,
          paymentIntentId: 'pi_test_123'
        },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97,
        tax: 8.80
      });
    });

    it('should get order by ID', async () => {
      const retrievedOrder = await service.getOrder(testOrder.id);

      expect(retrievedOrder).toBeDefined();
      expect(retrievedOrder?.id).toBe(testOrder.id);
      expect(retrievedOrder?.customerId).toBe(testOrder.customerId);
    });

    it('should return null for non-existent order', async () => {
      const order = await service.getOrder('non_existent_order');
      expect(order).toBeNull();
    });

    it('should get orders by customer', async () => {
      const customerId = 'customer_multi';
      
      // Create multiple orders for the same customer
      await service.createOrder({
        customerId,
        customerEmail: 'multi@example.com',
        items: [mockOrderItems[0]],
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'card' as const },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 29.99,
        tax: 2.40
      });

      await service.createOrder({
        customerId,
        customerEmail: 'multi@example.com',
        items: [mockOrderItems[1]],
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'paypal' as const },
        shippingMethod: 'express',
        shippingCost: 14.99,
        subtotal: 49.99,
        tax: 4.00
      });

      const result = await service.getOrdersByCustomer(customerId);

      expect(result.orders).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.orders.every(order => order.customerId === customerId)).toBe(true);
    });

    it('should filter orders by status', async () => {
      const customerId = 'customer_filter';
      const order1 = await service.createOrder({
        customerId,
        customerEmail: 'filter@example.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'card' as const },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97,
        tax: 8.80
      });

      // Confirm the order
      await service.confirmOrder(order1.id);

      const result = await service.getOrdersByCustomer(customerId, {
        status: ['confirmed']
      });

      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].status).toBe('confirmed');
    });
  });

  describe('Order Status Updates', () => {
    let testOrder: Order;

    beforeEach(async () => {
      testOrder = await service.createOrder({
        customerId: 'customer_status',
        customerEmail: 'status@example.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'card' as const },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97,
        tax: 8.80
      });
    });

    it('should confirm order', async () => {
      const result = await service.confirmOrder(testOrder.id);

      expect(result).toBe(true);
      const updatedOrder = await service.getOrder(testOrder.id);
      expect(updatedOrder?.status).toBe('confirmed');
      expect(updatedOrder?.confirmedAt).toBeInstanceOf(Date);
    });

    it('should ship order', async () => {
      await service.confirmOrder(testOrder.id);
      
      const shippingData = {
        trackingNumber: 'TRK123456',
        carrier: 'UPS',
        estimatedDelivery: '3-5 business days'
      };

      const result = await service.shipOrder(testOrder.id, shippingData);

      expect(result).toBe(true);
      const updatedOrder = await service.getOrder(testOrder.id);
      expect(updatedOrder?.status).toBe('shipped');
      expect(updatedOrder?.shippedAt).toBeInstanceOf(Date);
      expect(updatedOrder?.shippingDetails.trackingNumber).toBe('TRK123456');
    });

    it('should deliver order', async () => {
      await service.confirmOrder(testOrder.id);
      await service.shipOrder(testOrder.id, {
        trackingNumber: 'TRK123456',
        carrier: 'UPS'
      });
      
      const result = await service.deliverOrder(testOrder.id);

      expect(result).toBe(true);
      const updatedOrder = await service.getOrder(testOrder.id);
      expect(updatedOrder?.status).toBe('delivered');
      expect(updatedOrder?.deliveredAt).toBeInstanceOf(Date);
    });

    it('should cancel order', async () => {
      const reason = 'Customer requested cancellation';
      const result = await service.cancelOrder(testOrder.id, reason);

      expect(result).toBe(true);
      const updatedOrder = await service.getOrder(testOrder.id);
      expect(updatedOrder?.status).toBe('cancelled');
      expect(updatedOrder?.cancelledAt).toBeInstanceOf(Date);
      expect(updatedOrder?.cancellationReason).toBe(reason);
    });
  });

  describe('Order Calculations', () => {
    it('should calculate order totals correctly', async () => {
      const orderData = {
        customerId: 'customer_calc',
        customerEmail: 'calc@example.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'card' as const },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97, // (29.99 * 2) + 49.99
        tax: 8.80,
        discount: 15.00
      };

      const order = await service.createOrder(orderData);

      const expectedTotal = orderData.subtotal + orderData.tax + orderData.shippingCost - orderData.discount;
      expect(order.total).toBe(expectedTotal);
    });
  });

  describe('Order Search', () => {
    it('should search orders with filters', async () => {
      // Create some test orders first
      await service.createOrder({
        customerId: 'customer_search1',
        customerEmail: 'search1@example.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'card' as const },
        shippingMethod: 'standard',
        shippingCost: 9.99,
        subtotal: 109.97,
        tax: 8.80
      });

      await service.createOrder({
        customerId: 'customer_search2',
        customerEmail: 'search2@example.com',
        items: mockOrderItems,
        shippingAddress: mockShippingAddress,
        paymentData: { method: 'paypal' as const },
        shippingMethod: 'express',
        shippingCost: 14.99,
        subtotal: 109.97,
        tax: 8.80
      });

      const result = await service.searchOrders({
        status: ['pending'],
        minAmount: 100
      });

      expect(result.orders.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('Service Initialization', () => {
    it('should initialize with mock data', () => {
      expect(service).toBeInstanceOf(OrderService);
    });

    it('should have existing orders from mock data', async () => {
      const existingOrder = await service.getOrder('order_1');
      expect(existingOrder).toBeDefined();
      expect(existingOrder?.id).toBe('order_1');
    });
  });
});
