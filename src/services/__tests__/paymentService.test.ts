import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PaymentService,
  PaymentIntent,
  PaymentResult,
  RefundResult,
  PaymentConfig,
  PAYMENT_CONFIG,
  handlePaymentWebhook
} from '../paymentService';

// Mock environment variables
vi.mock('process', () => ({
  env: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock_key',
    STRIPE_SECRET_KEY: 'sk_test_mock_secret',
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: 'paypal_test_client'
  }
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockConfig: PaymentConfig;

  beforeEach(() => {
    mockConfig = {
      stripePublicKey: 'pk_test_mock',
      stripeSecretKey: 'sk_test_mock',
      paypalClientId: 'paypal_mock',
      environment: 'development',
      currency: 'usd',
      country: 'US'
    };
    paymentService = new PaymentService(mockConfig);
    vi.clearAllTimers();
  });

  describe('Configuration', () => {
    it('should initialize with default config', () => {
      const service = new PaymentService();
      expect(service).toBeInstanceOf(PaymentService);
    });

    it('should initialize with custom config', () => {
      const customConfig: PaymentConfig = {
        stripePublicKey: 'pk_custom',
        environment: 'production',
        currency: 'eur',
        country: 'FR'
      };
      const service = new PaymentService(customConfig);
      expect(service).toBeInstanceOf(PaymentService);
    });

    it('should have proper default configuration values', () => {
      expect(PAYMENT_CONFIG.environment).toBe('development');
      expect(PAYMENT_CONFIG.currency).toBe('usd');
      expect(PAYMENT_CONFIG.country).toBe('US');
    });
  });

  describe('Payment Intent Creation', () => {
    it('should create a payment intent successfully', async () => {
      const amount = 100.50;
      const currency = 'usd';
      const metadata = { orderId: 'order_123' };

      const paymentIntent = await paymentService.createPaymentIntent(amount, currency, metadata);

      expect(paymentIntent).toBeDefined();
      expect(paymentIntent.id).toContain('pi_');
      expect(paymentIntent.amount).toBe(10050); // Amount in cents
      expect(paymentIntent.currency).toBe(currency);
      expect(paymentIntent.status).toBe('requires_payment_method');
      expect(paymentIntent.clientSecret).toContain('secret_');
      expect(paymentIntent.metadata).toEqual(metadata);
      expect(paymentIntent.createdAt).toBeInstanceOf(Date);
    });

    it('should create payment intent with default currency', async () => {
      const amount = 50.00;
      
      const paymentIntent = await paymentService.createPaymentIntent(amount);

      expect(paymentIntent.currency).toBe(mockConfig.currency);
      expect(paymentIntent.amount).toBe(5000); // $50.00 in cents
    });

    it('should handle payment intent creation errors', async () => {
      // Mock an error scenario
      const originalAmount = -10; // Invalid amount
      
      await expect(paymentService.createPaymentIntent(originalAmount))
        .rejects.toThrow('Failed to create payment intent');
    });
  });

  describe('Card Payment Processing', () => {
    let mockPaymentIntent: PaymentIntent;

    beforeEach(async () => {
      mockPaymentIntent = await paymentService.createPaymentIntent(100);
    });

    it('should process valid card payment successfully', async () => {
      const paymentData = {
        cardNumber: '4242424242424242', // Stripe test card
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      };

      const result = await paymentService.confirmCardPayment(
        mockPaymentIntent.clientSecret,
        paymentData
      );

      expect(result.success).toBe(true);
      expect(result.paymentIntent).toBeDefined();
      expect(result.paymentIntent?.status).toBe('succeeded');
      expect(result.error).toBeUndefined();
    });

    it('should handle declined card payment', async () => {
      const paymentData = {
        cardNumber: '4000000000000002', // Declined card
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      };

      const result = await paymentService.confirmCardPayment(
        mockPaymentIntent.clientSecret,
        paymentData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('card_error');
    });

    it('should handle insufficient funds card', async () => {
      const paymentData = {
        cardNumber: '4000000000009995', // Insufficient funds
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      };

      const result = await paymentService.confirmCardPayment(
        mockPaymentIntent.clientSecret,
        paymentData
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('insufficient_funds');
    });

    it('should require 3D Secure authentication', async () => {
      const paymentData = {
        cardNumber: '4000000000003220', // 3DS required
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      };

      const result = await paymentService.confirmCardPayment(
        mockPaymentIntent.clientSecret,
        paymentData
      );

      expect(result.success).toBe(false);
      expect(result.requiresAction).toBeDefined();
      expect(result.requiresAction?.type).toBe('use_stripe_sdk');
    });
  });

  describe('PayPal Payment Processing', () => {
    let mockPaymentIntent: PaymentIntent;

    beforeEach(async () => {
      mockPaymentIntent = await paymentService.createPaymentIntent(100);
    });

    it('should process PayPal payment successfully', async () => {
      const paypalData = {
        payerId: 'PAYER_123',
        paymentId: 'PAYPAL_ORDER_123'
      };

      const result = await paymentService.confirmPayPalPayment(
        mockPaymentIntent.clientSecret,
        paypalData
      );

      expect(result.success).toBe(true);
      expect(result.paymentIntent?.status).toBe('succeeded');
    });

    it('should handle PayPal payment errors', async () => {
      const invalidPaypalData = {
        payerId: 'invalid_payer',
        paymentId: 'invalid_payment'
      };

      const result = await paymentService.confirmPayPalPayment(
        mockPaymentIntent.clientSecret,
        invalidPaypalData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Refund Processing', () => {
    let mockPaymentIntent: PaymentIntent;

    beforeEach(async () => {
      mockPaymentIntent = await paymentService.createPaymentIntent(100);
      // Simulate successful payment
      mockPaymentIntent.status = 'succeeded';
    });

    it('should process full refund successfully', async () => {
      const result = await paymentService.processRefund(
        mockPaymentIntent.id,
        mockPaymentIntent.amount,
        'requested_by_customer'
      );

      expect(result.success).toBe(true);
      expect(result.refund).toBeDefined();
      expect(result.refund?.amount).toBe(mockPaymentIntent.amount);
      expect(result.refund?.status).toBe('succeeded');
      expect(result.refund?.reason).toBe('requested_by_customer');
    });

    it('should process partial refund successfully', async () => {
      const refundAmount = mockPaymentIntent.amount / 2; // 50% refund

      const result = await paymentService.processRefund(
        mockPaymentIntent.id,
        refundAmount,
        'requested_by_customer'
      );

      expect(result.success).toBe(true);
      expect(result.refund?.amount).toBe(refundAmount);
    });

    it('should handle refund errors', async () => {
      const result = await paymentService.processRefund(
        'pi_invalid_refund',
        5000,
        'fraudulent'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle refund for non-existent payment', async () => {
      const result = await paymentService.processRefund(
        'pi_non_existent',
        1000,
        'requested_by_customer'
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('payment_not_found');
    });
  });

  describe('Payment Method Management', () => {
    it('should save payment method successfully', async () => {
      const customerId = 'customer_123';
      const paymentMethodData = {
        type: 'card' as const,
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      };

      const paymentMethod = await paymentService.savePaymentMethod(customerId, paymentMethodData);

      expect(paymentMethod).toBeDefined();
      expect(paymentMethod.type).toBe('card');
      expect(paymentMethod.id).toBeDefined();
      expect(paymentMethod.isDefault).toBe(false);
    });

    it('should get saved payment methods for customer', async () => {
      const customerId = 'customer_123';
      
      // Save a couple of payment methods first
      await paymentService.savePaymentMethod(customerId, {
        type: 'card',
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      });

      const paymentMethods = await paymentService.getPaymentMethods(customerId);

      expect(paymentMethods).toBeInstanceOf(Array);
      expect(paymentMethods.length).toBeGreaterThan(0);
      expect(paymentMethods[0].type).toBe('card');
    });

    it('should delete payment method successfully', async () => {
      const customerId = 'customer_123';
      const paymentMethod = await paymentService.savePaymentMethod(customerId, {
        type: 'card',
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      });

      const result = await paymentService.deletePaymentMethod(paymentMethod.id);

      expect(result).toBe(true);
    });
  });

  describe('Payment Validation', () => {
    it('should validate card number format', () => {
      const validCard = '4242424242424242';
      const invalidCard = '1234';

      expect(paymentService.validateCardNumber(validCard)).toBe(true);
      expect(paymentService.validateCardNumber(invalidCard)).toBe(false);
    });

    it('should validate expiry date format', () => {
      const validExpiry = '12/25';
      const invalidExpiry = '13/20'; // Invalid month and past date

      expect(paymentService.validateExpiryDate(validExpiry)).toBe(true);
      expect(paymentService.validateExpiryDate(invalidExpiry)).toBe(false);
    });

    it('should validate CVV format', () => {
      const validCvv = '123';
      const invalidCvv = '12';

      expect(paymentService.validateCvv(validCvv)).toBe(true);
      expect(paymentService.validateCvv(invalidCvv)).toBe(false);
    });

    it('should detect card brand correctly', () => {
      expect(paymentService.detectCardBrand('4242424242424242')).toBe('visa');
      expect(paymentService.detectCardBrand('5555555555554444')).toBe('mastercard');
      expect(paymentService.detectCardBrand('378282246310005')).toBe('amex');
      expect(paymentService.detectCardBrand('1234567890123456')).toBe('unknown');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Test with invalid amount to trigger error
      await expect(paymentService.createPaymentIntent(-100))
        .rejects.toThrow('Failed to create payment intent');
    });

    it('should handle API errors gracefully', async () => {
      const result = await paymentService.confirmCardPayment('invalid_secret', {
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
        billingAddress: {
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Webhook Handling', () => {
    it('should handle payment succeeded webhook', async () => {
      const webhookPayload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            status: 'succeeded',
            amount: 10000
          }
        }
      };

      const result = await paymentService.handleWebhook(webhookPayload);

      expect(result.success).toBe(true);
    });

    it('should handle payment failed webhook', async () => {
      const webhookPayload = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
            status: 'payment_failed',
            last_payment_error: {
              message: 'Card was declined'
            }
          }
        }
      };

      const result = await paymentService.handleWebhook(webhookPayload);

      expect(result.success).toBe(true);
    });
  });
});
