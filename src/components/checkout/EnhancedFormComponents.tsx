import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  Tag
} from 'lucide-react';
import {
  formatCardNumber,
  formatExpiryDate,
  formatPhoneNumber,
  detectCardType,
  validateField,
  ValidationRule
} from '@/utils/checkoutValidation';

// Base enhanced input props
interface BaseInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  validationRule?: ValidationRule;
  onValidate?: (isValid: boolean, error?: string) => void;
}

// Enhanced Text Input
interface EnhancedTextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  icon?: React.ReactNode;
  autoComplete?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoFormat?: boolean;
}

export const EnhancedTextInput = forwardRef<HTMLInputElement, EnhancedTextInputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  loading,
  disabled,
  required,
  hint,
  className = '',
  icon,
  autoComplete,
  maxLength,
  showCharCount,
  autoFormat,
  validationRule,
  onValidate
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string>('');

  const inputRef = React.useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Auto-format based on type
    if (autoFormat) {
      switch (type) {
        case 'tel':
          newValue = formatPhoneNumber(newValue);
          break;
      }
    }

    onChange(newValue);
    
    // Real-time validation
    if (validationRule && focused) {
      const validationError = validateField(newValue, validationRule);
      setLocalError(validationError || '');
      onValidate?.(!validationError, validationError || undefined);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
    
    // Validate on blur
    if (validationRule) {
      const validationError = validateField(value, validationRule);
      setLocalError(validationError || '');
      onValidate?.(!validationError, validationError || undefined);
    }
  };

  const displayError = error || localError;
  const hasError = !!displayError;
  const hasSuccess = success && !hasError && value.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {icon && <span className="inline-flex items-center mr-1">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : hasSuccess
              ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300'
          } ${loading ? 'pr-10' : type === 'password' ? 'pr-10' : ''}`}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}

        {/* Success/Error indicators */}
        {!loading && hasSuccess && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}

        {!loading && hasError && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}

        {/* Password visibility toggle */}
        {type === 'password' && !loading && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Character count */}
      {showCharCount && maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint */}
      {hint && !displayError && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
});

EnhancedTextInput.displayName = 'EnhancedTextInput';

// Credit Card Input with type detection
interface CreditCardInputProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onCardTypeDetected?: (cardType: string | null) => void;
}

export const CreditCardInput: React.FC<CreditCardInputProps> = ({
  value,
  onChange,
  onBlur,
  onCardTypeDetected,
  error,
  success,
  loading,
  disabled,
  required,
  hint,
  className = '',
  validationRule,
  onValidate
}) => {
  const [cardType, setCardType] = useState<string | null>(null);

  useEffect(() => {
    const type = detectCardType(value);
    setCardType(type);
    onCardTypeDetected?.(type);
  }, [value, onCardTypeDetected]);

  const handleChange = (newValue: string) => {
    const formatted = formatCardNumber(newValue);
    onChange(formatted);
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <div className="text-blue-600 font-bold text-xs">VISA</div>;
      case 'mastercard':
        return <div className="text-orange-500 font-bold text-xs">MC</div>;
      case 'amex':
        return <div className="text-blue-800 font-bold text-xs">AMEX</div>;
      case 'discover':
        return <div className="text-orange-600 font-bold text-xs">DISC</div>;
      default:
        return <CreditCard className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <EnhancedTextInput
      label="Card Number"
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder="1234 5678 9012 3456"
      error={error}
      success={success}
      loading={loading}
      disabled={disabled}
      required={required}
      hint={hint}
      className={className}
      maxLength={19} // Formatted card number with spaces
      autoComplete="cc-number"
      icon={getCardIcon()}
      validationRule={validationRule}
      onValidate={onValidate}
    />
  );
};

// Expiry Date Input with formatting
interface ExpiryDateInputProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const ExpiryDateInput: React.FC<ExpiryDateInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  success,
  loading,
  disabled,
  required,
  hint,
  className = '',
  validationRule,
  onValidate
}) => {
  const handleChange = (newValue: string) => {
    const formatted = formatExpiryDate(newValue);
    onChange(formatted);
  };

  return (
    <EnhancedTextInput
      label="Expiry Date"
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder="MM/YY"
      error={error}
      success={success}
      loading={loading}
      disabled={disabled}
      required={required}
      hint={hint}
      className={className}
      maxLength={5}
      autoComplete="cc-exp"
      validationRule={validationRule}
      onValidate={onValidate}
    />
  );
};

// Enhanced Select component
interface EnhancedSelectProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
  success,
  loading,
  disabled,
  required,
  hint,
  className = '',
  validationRule,
  onValidate
}) => {
  const [localError, setLocalError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Validate
    if (validationRule) {
      const validationError = validateField(newValue, validationRule);
      setLocalError(validationError || '');
      onValidate?.(!validationError, validationError || undefined);
    }
  };

  const handleBlur = () => {
    onBlur?.();
    
    if (validationRule) {
      const validationError = validateField(value, validationRule);
      setLocalError(validationError || '');
      onValidate?.(!validationError, validationError || undefined);
    }
  };

  const displayError = error || localError;
  const hasError = !!displayError;
  const hasSuccess = success && !hasError && value.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none ${
            hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : hasSuccess
              ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300'
          }`}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint */}
      {hint && !displayError && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

// Address Autocomplete Component
interface AddressAutocompleteProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: any) => void;
  onBlur?: () => void;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  onBlur,
  label = "Address",
  error,
  success,
  loading,
  disabled,
  required,
  hint,
  className = '',
  validationRule,
  onValidate
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (value.length > 3) {
      setIsLoading(true);
      // Mock address suggestions - replace with actual service
      setTimeout(() => {
        setSuggestions([
          { id: 1, address: `${value} Street`, city: 'New York', state: 'NY', zipCode: '10001' },
          { id: 2, address: `${value} Avenue`, city: 'New York', state: 'NY', zipCode: '10002' },
          { id: 3, address: `${value} Boulevard`, city: 'Los Angeles', state: 'CA', zipCode: '90001' }
        ]);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSuggestionClick = (suggestion: any) => {
    onChange(suggestion.address);
    onAddressSelect?.(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <EnhancedTextInput
        label={label}
        type="text"
        value={value}
        onChange={onChange}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
          onBlur?.();
        }}
        placeholder="123 Main Street"
        error={error}
        success={success}
        loading={loading || isLoading}
        disabled={disabled}
        required={required}
        hint={hint}
        icon={<MapPin className="h-4 w-4" />}
        autoComplete="address-line1"
        validationRule={validationRule}
        onValidate={onValidate}
      />

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{suggestion.address}</div>
                <div className="text-sm text-gray-500">
                  {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Promo Code Input with validation
interface PromoCodeInputProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply?: (code: string) => void;
  isApplying?: boolean;
  isValid?: boolean;
  discount?: number;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  value,
  onChange,
  onApply,
  isApplying,
  isValid,
  discount,
  error,
  loading,
  disabled,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleApply = () => {
    if (localValue.trim() && onApply) {
      onApply(localValue.trim().toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        <Tag className="inline h-4 w-4 mr-1" />
        Promo Code
      </label>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value.toUpperCase());
              onChange(e.target.value.toUpperCase());
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter promo code"
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 uppercase ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : isValid
                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300'
            }`}
          />

          {isValid && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={!localValue.trim() || isApplying || disabled}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            'Apply'
          )}
        </button>
      </div>

      {/* Success message */}
      {isValid && discount !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-600 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          Promo code applied! You saved ${discount.toFixed(2)}
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Checkbox with enhanced styling
interface EnhancedCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  className?: string;
}

export const EnhancedCheckbox: React.FC<EnhancedCheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled,
  required,
  description,
  className = ''
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? 'bg-blue-600 border-blue-600' : ''
          }`}
        />
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900 cursor-pointer">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default {
  EnhancedTextInput,
  CreditCardInput,
  ExpiryDateInput,
  EnhancedSelect,
  AddressAutocomplete,
  PromoCodeInput,
  EnhancedCheckbox
};
