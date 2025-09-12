// Payment Service - Handles all payment-related operations
// This is a comprehensive payment integration system

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  provider: 'stripe' | 'paypal' | 'square' | 'manual';
  isDefault: boolean;
  createdAt: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

export interface CreditCardPaymentMethod extends PaymentMethod {
  type: 'card';
  card: {
    last4: string;
    brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unionpay' | 'unknown';
    expMonth: number;
    expYear: number;
    country: string;
    funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
    fingerprint: string;
  };
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PayPalPaymentMethod extends PaymentMethod {
  type: 'paypal';
  paypal: {
    email: string;
    payerId: string;
    accountId: string;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  paymentMethod?: string;
  shipping?: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    name: string;
    phone?: string;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  lastError?: {
    code: string;
    message: string;
    type: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: {
    code: string;
    message: string;
    type: 'card_error' | 'validation_error' | 'api_error' | 'authentication_error' | 'rate_limit_error';
  };
  requiresAction?: {
    type: 'redirect_to_url' | 'use_stripe_sdk';
    redirectUrl?: string;
    clientSecret?: string;
  };
}

export interface RefundResult {
  success: boolean;
  refund?: {
    id: string;
    amount: number;
    status: 'pending' | 'succeeded' | 'failed' | 'canceled';
    reason: 'duplicate' | 'fraudulent' | 'requested_by_customer';
    createdAt: Date;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentConfig {
  stripePublicKey?: string;
  stripeSecretKey?: string;
  paypalClientId?: string;
  paypalClientSecret?: string;
  environment: 'development' | 'staging' | 'production';
  currency: string;
  country: string;
}

// Mock payment configuration
export const PAYMENT_CONFIG: PaymentConfig = {
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock',
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'paypal_client_id_mock',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  currency: 'usd',
  country: 'US'
};

// Payment Service Class
export class PaymentService {
  private config: PaymentConfig;
  private stripe: any; // In real app, this would be the Stripe instance
  private paypal: any; // In real app, this would be the PayPal instance

  constructor(config: PaymentConfig = PAYMENT_CONFIG) {
    this.config = config;
    this.initializeProviders();
  }

  private async initializeProviders(): Promise<void> {
    try {
      // Initialize Stripe
      if (this.config.stripePublicKey && typeof window !== 'undefined') {
        // In real app: this.stripe = Stripe(this.config.stripePublicKey);
        console.log('Stripe initialized with key:', this.config.stripePublicKey.substring(0, 10) + '...');
      }

      // Initialize PayPal
      if (this.config.paypalClientId) {
        // In real app: initialize PayPal SDK
        console.log('PayPal initialized with client ID:', this.config.paypalClientId.substring(0, 10) + '...');
      }
    } catch (error) {
      console.error('Failed to initialize payment providers:', error);
    }
  }

  // Create Payment Intent
  async createPaymentIntent(
    amount: number,
    currency: string = this.config.currency,
    metadata: Record<string, any> = {}
  ): Promise<PaymentIntent> {
    try {
      // In real app, this would make an API call to your backend
      const mockPaymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        status: 'requires_payment_method',
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 16)}`,
        metadata,
        createdAt: new Date()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockPaymentIntent;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm Payment with Card
  async confirmCardPayment(
    clientSecret: string,
    paymentData: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
      billingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    }
  ): Promise<PaymentResult> {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation logic
      if (paymentData.cardNumber.includes('4000000000000002')) {
        return {
          success: false,
          error: {
            code: 'card_declined',
            message: 'Your card was declined.',
            type: 'card_error'
          }
        };
      }

      if (paymentData.cardNumber.includes('4000000000003220')) {
        return {
          success: false,
          requiresAction: {
            type: 'use_stripe_sdk',
            clientSecret
          }
        };
      }

      // Successful payment
      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}_success`,
        amount: 5000, // Mock amount
        currency: 'usd',
        status: 'succeeded',
        clientSecret,
        paymentMethod: `pm_${Date.now()}`,
        metadata: { orderId: `order_${Date.now()}` },
        createdAt: new Date()
      };

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'api_error',
          message: 'An unexpected error occurred.',
          type: 'api_error'
        }
      };
    }
  }

  // Process PayPal Payment
  async processPayPalPayment(
    amount: number,
    currency: string = this.config.currency,
    orderId: string
  ): Promise<PaymentResult> {
    try {
      // Simulate PayPal processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentIntent: PaymentIntent = {
        id: `pi_paypal_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        status: 'succeeded',
        clientSecret: `paypal_secret_${Date.now()}`,
        paymentMethod: `pm_paypal_${Date.now()}`,
        metadata: { orderId, provider: 'paypal' },
        createdAt: new Date()
      };

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'paypal_error',
          message: 'PayPal payment failed.',
          type: 'api_error'
        }
      };
    }
  }

  // Process Apple Pay
  async processApplePayPayment(
    amount: number,
    currency: string = this.config.currency,
    paymentData: any
  ): Promise<PaymentResult> {
    try {
      // Simulate Apple Pay processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paymentIntent: PaymentIntent = {
        id: `pi_apple_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        status: 'succeeded',
        clientSecret: `apple_secret_${Date.now()}`,
        paymentMethod: `pm_apple_${Date.now()}`,
        metadata: { provider: 'apple_pay' },
        createdAt: new Date()
      };

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'apple_pay_error',
          message: 'Apple Pay payment failed.',
          type: 'api_error'
        }
      };
    }
  }

  // Process Google Pay
  async processGooglePayPayment(
    amount: number,
    currency: string = this.config.currency,
    paymentData: any
  ): Promise<PaymentResult> {
    try {
      // Simulate Google Pay processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paymentIntent: PaymentIntent = {
        id: `pi_google_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        status: 'succeeded',
        clientSecret: `google_secret_${Date.now()}`,
        paymentMethod: `pm_google_${Date.now()}`,
        metadata: { provider: 'google_pay' },
        createdAt: new Date()
      };

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'google_pay_error',
          message: 'Google Pay payment failed.',
          type: 'api_error'
        }
      };
    }
  }

  // Save Payment Method
  async savePaymentMethod(
    customerId: string,
    paymentMethodData: {
      type: 'card';
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
      billingAddress: any;
    }
  ): Promise<CreditCardPaymentMethod> {
    try {
      // In real app, this would securely tokenize and save the payment method
      await new Promise(resolve => setTimeout(resolve, 1000));

      const [expMonth, expYear] = paymentMethodData.expiryDate.split('/').map(Number);
      const last4 = paymentMethodData.cardNumber.slice(-4);
      
      // Detect card brand
      let brand: CreditCardPaymentMethod['card']['brand'] = 'unknown';
      if (paymentMethodData.cardNumber.startsWith('4')) brand = 'visa';
      else if (paymentMethodData.cardNumber.match(/^5[1-5]/)) brand = 'mastercard';
      else if (paymentMethodData.cardNumber.match(/^3[47]/)) brand = 'amex';
      else if (paymentMethodData.cardNumber.match(/^6(?:011|5)/)) brand = 'discover';

      const savedPaymentMethod: CreditCardPaymentMethod = {
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'card',
        provider: 'stripe',
        isDefault: false,
        createdAt: new Date(),
        card: {
          last4,
          brand,
          expMonth: expMonth + 2000, // Convert YY to YYYY
          expYear,
          country: 'US',
          funding: 'credit',
          fingerprint: `fp_${Math.random().toString(36).substr(2, 16)}`
        },
        billingAddress: paymentMethodData.billingAddress,
        metadata: { customerId }
      };

      return savedPaymentMethod;
    } catch (error) {
      throw new Error('Failed to save payment method');
    }
  }

  // Get Saved Payment Methods
  async getSavedPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      // In real app, this would fetch from database
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock saved payment methods
      const mockMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          provider: 'stripe',
          isDefault: true,
          createdAt: new Date(Date.now() - 86400000), // Yesterday
          card: {
            last4: '4242',
            brand: 'visa',
            expMonth: 12,
            expYear: 2027,
            country: 'US',
            funding: 'credit',
            fingerprint: 'fp_mock_1'
          },
          billingAddress: {
            line1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          },
          metadata: { customerId }
        } as CreditCardPaymentMethod,
        {
          id: 'pm_2',
          type: 'paypal',
          provider: 'paypal',
          isDefault: false,
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          paypal: {
            email: 'user@example.com',
            payerId: 'payer_mock',
            accountId: 'account_mock'
          },
          metadata: { customerId }
        } as PayPalPaymentMethod
      ];

      return mockMethods;
    } catch (error) {
      throw new Error('Failed to retrieve payment methods');
    }
  }

  // Delete Payment Method
  async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      // In real app, this would delete from stripe and database
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      throw new Error('Failed to delete payment method');
    }
  }

  // Set Default Payment Method
  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<boolean> {
    try {
      // In real app, this would update database
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (error) {
      throw new Error('Failed to set default payment method');
    }
  }

  // Process Refund
  async processRefund(
    paymentIntentId: string,
    amount?: number,
    reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' = 'requested_by_customer'
  ): Promise<RefundResult> {
    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const refund = {
        id: `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount || 5000, // Mock amount
        status: 'succeeded' as const,
        reason,
        createdAt: new Date()
      };

      return {
        success: true,
        refund
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'refund_failed',
          message: 'Failed to process refund.'
        }
      };
    }
  }

  // Get Payment Intent
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    try {
      // In real app, this would fetch from Stripe
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockPaymentIntent: PaymentIntent = {
        id: paymentIntentId,
        amount: 5000,
        currency: 'usd',
        status: 'succeeded',
        clientSecret: `${paymentIntentId}_secret`,
        paymentMethod: `pm_${Date.now()}`,
        metadata: { orderId: `order_${Date.now()}` },
        createdAt: new Date()
      };

      return mockPaymentIntent;
    } catch (error) {
      return null;
    }
  }

  // Validate Payment Data
  validatePaymentData(paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Validate card number (basic Luhn algorithm)
    if (!this.isValidCardNumber(paymentData.cardNumber)) {
      errors.cardNumber = 'Invalid card number';
    }

    // Validate expiry date
    if (!this.isValidExpiryDate(paymentData.expiryDate)) {
      errors.expiryDate = 'Invalid or expired date';
    }

    // Validate CVV
    if (!this.isValidCVV(paymentData.cvv)) {
      errors.cvv = 'Invalid CVV';
    }

    // Validate cardholder name
    if (!paymentData.cardholderName || paymentData.cardholderName.trim().length < 2) {
      errors.cardholderName = 'Invalid cardholder name';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Helper Methods
  private isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Basic length check
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let alternate = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return (sum % 10) === 0;
  }

  private isValidExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/').map(Number);
    
    if (!month || !year || month < 1 || month > 12) {
      return false;
    }
    
    const expiry = new Date(2000 + year, month - 1);
    const now = new Date();
    
    return expiry > now;
  }

  private isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Calculate Processing Fees
  calculateProcessingFee(amount: number, paymentMethod: string): number {
    const fees = {
      card: 0.029, // 2.9%
      paypal: 0.035, // 3.5%
      apple_pay: 0.029, // 2.9%
      google_pay: 0.029, // 2.9%
      bank_transfer: 0.008 // 0.8%
    };

    const rate = fees[paymentMethod as keyof typeof fees] || fees.card;
    return Math.round(amount * rate * 100) / 100;
  }

  // Check Payment Method Availability
  isPaymentMethodAvailable(method: string, country: string = this.config.country): boolean {
    const availability = {
      card: ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'JP'], // Most countries
      paypal: ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'JP', 'NL', 'ES', 'IT'],
      apple_pay: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      google_pay: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'IN'],
      bank_transfer: ['US', 'GB', 'DE', 'NL']
    };

    return availability[method as keyof typeof availability]?.includes(country) || false;
  }
}

// Global payment service instance
let globalPaymentService: PaymentService | null = null;

export const getPaymentService = (config?: PaymentConfig): PaymentService => {
  if (!globalPaymentService) {
    globalPaymentService = new PaymentService(config);
  }
  return globalPaymentService;
};

// Webhook handler for payment events
export const handlePaymentWebhook = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Handle failed payment
        break;
      case 'payment_method.attached':
        console.log('Payment method attached:', event.data.object.id);
        // Handle payment method attachment
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
};

export default PaymentService;
