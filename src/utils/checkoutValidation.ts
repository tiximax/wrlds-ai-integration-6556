// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  creditCard?: boolean;
  custom?: (value: string) => string | null;
}

// Format functions
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
  return match ? [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ') : cleaned;
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : value;
};

// Card type detection
export const detectCardType = (cardNumber: string): string | null => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6/.test(cleaned)) return 'discover';
  return null;
};

// Field validation
export const validateField = (value: string, rule: ValidationRule): string | null => {
  if (rule.required && !value.trim()) {
    return 'This field is required';
  }
  
  if (rule.minLength && value.length < rule.minLength) {
    return `Minimum ${rule.minLength} characters required`;
  }
  
  if (rule.maxLength && value.length > rule.maxLength) {
    return `Maximum ${rule.maxLength} characters allowed`;
  }
  
  if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }
  
  if (rule.phone && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
    return 'Please enter a valid phone number';
  }
  
  if (rule.pattern && !rule.pattern.test(value)) {
    return 'Invalid format';
  }
  
  if (rule.custom) {
    return rule.custom(value);
  }
  
  return null;
};

// Legacy exports
export const validateCheckout = () => true;
export const useFormValidation = () => ({});