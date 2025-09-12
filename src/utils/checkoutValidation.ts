// Advanced validation utilities for checkout forms

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstErrorField?: string;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^\d{13,19}$/,
  cvv: /^\d{3,4}$/,
  expiryDate: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  address: /^[a-zA-Z0-9\s,.-]{5,100}$/
};

// Credit card type detection
export const CARD_TYPES = {
  visa: { pattern: /^4/, length: [16] },
  mastercard: { pattern: /^5[1-5]/, length: [16] },
  amex: { pattern: /^3[47]/, length: [15] },
  discover: { pattern: /^6(?:011|5)/, length: [16] },
  dinersclub: { pattern: /^3[0689]/, length: [14] },
  jcb: { pattern: /^35/, length: [16] }
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  zipCode: 'Please enter a valid ZIP code',
  creditCard: 'Please enter a valid credit card number',
  cvv: 'Please enter a valid CVV',
  expiryDate: 'Please enter a valid expiry date (MM/YY)',
  expiredCard: 'This card has expired',
  name: 'Please enter a valid name (2-50 characters, letters only)',
  address: 'Please enter a valid address',
  passwordStrength: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  passwordMatch: 'Passwords do not match',
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must be no more than {max} characters',
  invalidFormat: 'Invalid format'
};

// Core validation function
export function validateField(value: any, rule: ValidationRule): string | null {
  // Check required
  if (rule.required && (!value || value.toString().trim() === '')) {
    return rule.message || VALIDATION_MESSAGES.required;
  }

  // If not required and empty, skip other validations
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString().trim();

  // Check min length
  if (rule.min !== undefined && stringValue.length < rule.min) {
    return rule.message || VALIDATION_MESSAGES.minLength.replace('{min}', rule.min.toString());
  }

  // Check max length
  if (rule.max !== undefined && stringValue.length > rule.max) {
    return rule.message || VALIDATION_MESSAGES.maxLength.replace('{max}', rule.max.toString());
  }

  // Check pattern
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return rule.message || VALIDATION_MESSAGES.invalidFormat;
  }

  // Check custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

// Validate entire form
export function validateForm(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string> = {};
  let firstErrorField: string | undefined;

  Object.keys(schema).forEach(field => {
    const error = validateField(data[field], schema[field]);
    if (error) {
      errors[field] = error;
      if (!firstErrorField) {
        firstErrorField = field;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorField
  };
}

// Shipping address validation schema
export const SHIPPING_VALIDATION_SCHEMA: ValidationSchema = {
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email,
    message: VALIDATION_MESSAGES.email
  },
  firstName: {
    required: true,
    min: 2,
    max: 50,
    pattern: VALIDATION_PATTERNS.name,
    message: VALIDATION_MESSAGES.name
  },
  lastName: {
    required: true,
    min: 2,
    max: 50,
    pattern: VALIDATION_PATTERNS.name,
    message: VALIDATION_MESSAGES.name
  },
  company: {
    max: 100
  },
  address: {
    required: true,
    min: 5,
    max: 100,
    pattern: VALIDATION_PATTERNS.address,
    message: VALIDATION_MESSAGES.address
  },
  apartment: {
    max: 50
  },
  city: {
    required: true,
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s'-]{2,50}$/,
    message: 'Please enter a valid city name'
  },
  state: {
    required: true,
    custom: (value) => {
      const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
      return validStates.includes(value) ? null : 'Please select a valid state';
    }
  },
  zipCode: {
    required: true,
    pattern: VALIDATION_PATTERNS.zipCode,
    message: VALIDATION_MESSAGES.zipCode
  },
  phone: {
    required: true,
    pattern: VALIDATION_PATTERNS.phone,
    message: VALIDATION_MESSAGES.phone
  }
};

// Payment validation schema
export const PAYMENT_VALIDATION_SCHEMA: ValidationSchema = {
  cardNumber: {
    required: true,
    custom: (value) => {
      if (!value) return 'Card number is required';
      const cleaned = value.replace(/\s/g, '');
      if (!VALIDATION_PATTERNS.creditCard.test(cleaned)) {
        return 'Please enter a valid credit card number';
      }
      if (!isValidLuhn(cleaned)) {
        return 'Invalid card number';
      }
      return null;
    }
  },
  expiryDate: {
    required: true,
    custom: (value) => {
      if (!value) return 'Expiry date is required';
      if (!VALIDATION_PATTERNS.expiryDate.test(value)) {
        return 'Please enter a valid expiry date (MM/YY)';
      }
      
      const [month, year] = value.split('/');
      const expiry = new Date(parseInt('20' + year), parseInt(month) - 1);
      const now = new Date();
      
      if (expiry < now) {
        return 'This card has expired';
      }
      
      return null;
    }
  },
  cvv: {
    required: true,
    pattern: VALIDATION_PATTERNS.cvv,
    message: 'Please enter a valid CVV (3-4 digits)'
  },
  cardholderName: {
    required: true,
    min: 2,
    max: 50,
    pattern: VALIDATION_PATTERNS.name,
    message: 'Please enter the cardholder name as it appears on the card'
  }
};

// Luhn algorithm for credit card validation
export function isValidLuhn(cardNumber: string): boolean {
  let sum = 0;
  let alternate = false;
  
  // Process digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);
    
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

// Detect credit card type
export function detectCardType(cardNumber: string): string | null {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  for (const [type, config] of Object.entries(CARD_TYPES)) {
    if (config.pattern.test(cleaned) && config.length.includes(cleaned.length)) {
      return type;
    }
  }
  
  return null;
}

// Format credit card number
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '');
  const match = cleaned.match(/\d{1,4}/g);
  return match ? match.join(' ') : '';
}

// Format expiry date
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  }
  return cleaned;
}

// Format phone number
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
}

// Real-time validation hook
export function useFormValidation(schema: ValidationSchema, initialData: Record<string, any> = {}) {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateSingleField = (field: string, value: any) => {
    if (schema[field]) {
      const error = validateField(value, schema[field]);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      }));
      return !error;
    }
    return true;
  };

  const updateField = (field: string, value: any, shouldValidate = true) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    if (shouldValidate && touched[field]) {
      validateSingleField(field, value);
    }
  };

  const touchField = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (data[field] !== undefined) {
      validateSingleField(field, data[field]);
    }
  };

  const validateAll = () => {
    const result = validateForm(data, schema);
    setErrors(result.errors);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(schema).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return result;
  };

  const reset = (newData: Record<string, any> = {}) => {
    setData(newData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    updateField,
    touchField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
}

// Address validation (using a mock service)
export async function validateAddress(address: {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}): Promise<{ isValid: boolean; suggestions?: any[]; error?: string }> {
  // Mock address validation service
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple validation logic
      if (address.address.includes('invalid')) {
        resolve({
          isValid: false,
          error: 'Address not found',
          suggestions: [
            {
              address: address.address.replace('invalid', '123 Main St'),
              city: address.city,
              state: address.state,
              zipCode: address.zipCode
            }
          ]
        });
      } else {
        resolve({ isValid: true });
      }
    }, 1000);
  });
}

// Tax calculation
export function calculateTax(subtotal: number, state: string): number {
  // Mock tax rates by state
  const taxRates: Record<string, number> = {
    CA: 0.095,
    NY: 0.08,
    TX: 0.0625,
    FL: 0.065,
    // Add more states as needed
  };
  
  return subtotal * (taxRates[state] || 0.05);
}

// Shipping cost calculation
export function calculateShipping(items: any[], method: string, state: string): number {
  const weight = items.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0);
  const baseRates: Record<string, number> = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99
  };
  
  let cost = baseRates[method] || 5.99;
  
  // Adjust for weight
  if (weight > 5) {
    cost += (weight - 5) * 2;
  }
  
  // Free shipping for orders over $50
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotal > 50 && method === 'standard') {
    cost = 0;
  }
  
  return Math.round(cost * 100) / 100;
}

// Promo code validation
export async function validatePromoCode(code: string, subtotal: number): Promise<{
  isValid: boolean;
  discount: number;
  discountType: 'percentage' | 'fixed';
  error?: string;
}> {
  // Mock promo codes
  const promoCodes: Record<string, { discount: number; type: 'percentage' | 'fixed'; minOrder?: number }> = {
    SAVE10: { discount: 10, type: 'percentage' },
    WELCOME: { discount: 5, type: 'fixed' },
    FREESHIP: { discount: 100, type: 'percentage', minOrder: 25 }
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const promo = promoCodes[code.toUpperCase()];
      
      if (!promo) {
        resolve({
          isValid: false,
          discount: 0,
          discountType: 'fixed',
          error: 'Invalid promo code'
        });
        return;
      }
      
      if (promo.minOrder && subtotal < promo.minOrder) {
        resolve({
          isValid: false,
          discount: 0,
          discountType: promo.type,
          error: `Minimum order of $${promo.minOrder} required`
        });
        return;
      }
      
      let discount = promo.discount;
      if (promo.type === 'percentage') {
        discount = (subtotal * promo.discount) / 100;
      }
      
      resolve({
        isValid: true,
        discount,
        discountType: promo.type
      });
    }, 500);
  });
}

// Export all utilities
export default {
  validateField,
  validateForm,
  isValidLuhn,
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  formatPhoneNumber,
  useFormValidation,
  validateAddress,
  calculateTax,
  calculateShipping,
  validatePromoCode,
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
  SHIPPING_VALIDATION_SCHEMA,
  PAYMENT_VALIDATION_SCHEMA
};
