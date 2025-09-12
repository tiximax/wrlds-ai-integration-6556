import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '@/contexts/CartContext';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Shield,
  Clock,
  Truck,
  AlertCircle,
  Info,
  Lock,
  User,
  Mail,
  Phone,
  Home
} from 'lucide-react';

// Types for checkout process
interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<CheckoutStepProps>;
  isComplete: boolean;
  isActive: boolean;
}

interface CheckoutStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

interface ShippingData {
  email: string;
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
  saveAddress: boolean;
  isGift: boolean;
  giftMessage?: string;
}

interface PaymentData {
  method: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  billingAddress?: ShippingData;
  useBillingAddress: boolean;
  savePaymentMethod: boolean;
}

interface OrderSummaryData {
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingMethod: string;
  estimatedDelivery: string;
}

// Step 1: Shipping Information
const ShippingStep: React.FC<CheckoutStepProps> = ({ onNext, data, errors, setErrors }) => {
  const [formData, setFormData] = useState<ShippingData>(data.shipping || {
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    saveAddress: false,
    isGift: false,
    giftMessage: ''
  });

  const handleInputChange = (field: keyof ShippingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext({ shipping: formData });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Shipping Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              We'll use this information to deliver your order and send updates.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Company (optional) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company (optional)
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Acme Inc."
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="inline h-4 w-4 mr-1" />
            Address *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Apartment */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            value={formData.apartment || ''}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Apt 2B"
          />
        </div>

        {/* City, State, ZIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="New York"
          />
          {errors.city && (
            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            {/* Add more states as needed */}
          </select>
          {errors.state && (
            <p className="text-red-600 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="10001"
          />
          {errors.zipCode && (
            <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 border-t pt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.saveAddress}
            onChange={(e) => handleInputChange('saveAddress', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Save this address for future orders</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isGift}
            onChange={(e) => handleInputChange('isGift', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">This is a gift</span>
        </label>

        {formData.isGift && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gift Message (optional)
            </label>
            <textarea
              value={formData.giftMessage || ''}
              onChange={(e) => handleInputChange('giftMessage', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Happy Birthday! Hope you enjoy this gift."
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Continue to Shipping
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Step 2: Shipping Method
const ShippingMethodStep: React.FC<CheckoutStepProps> = ({ onNext, onBack, data }) => {
  const [selectedMethod, setSelectedMethod] = useState(data.shippingMethod || 'standard');

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 5.99,
      icon: <Truck className="h-5 w-5" />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 12.99,
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 24.99,
      icon: <ArrowRight className="h-5 w-5" />
    }
  ];

  const handleNext = () => {
    const selectedMethodData = shippingMethods.find(m => m.id === selectedMethod);
    onNext({ 
      shippingMethod: selectedMethod,
      shippingCost: selectedMethodData?.price || 0,
      estimatedDelivery: selectedMethodData?.description || ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Shipping Method</h3>
        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ${method.price.toFixed(2)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Continue to Payment
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Step 3: Payment Method
const PaymentStep: React.FC<CheckoutStepProps> = ({ onNext, onBack, data, errors, setErrors }) => {
  const [formData, setFormData] = useState<PaymentData>(data.payment || {
    method: 'card',
    useBillingAddress: true,
    savePaymentMethod: false
  });

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'paypal', name: 'PayPal', icon: <Shield className="h-5 w-5" /> },
    { id: 'apple_pay', name: 'Apple Pay', icon: <Shield className="h-5 w-5" /> },
    { id: 'google_pay', name: 'Google Pay', icon: <Shield className="h-5 w-5" /> }
  ];

  const validateCardForm = () => {
    if (formData.method !== 'card') return true;
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateCardForm()) {
      onNext({ payment: formData });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        
        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.method === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={formData.method === method.id}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value as any }))}
                className="text-blue-600 focus:ring-blue-500"
              />
              {method.icon}
              <span className="font-medium">{method.name}</span>
            </label>
          ))}
        </div>

        {/* Card Details */}
        {formData.method === 'card' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Your payment information is secure and encrypted</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={formData.cardNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={formData.expiryDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={formData.cvv || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                />
                {errors.cvv && (
                  <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={formData.cardholderName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.cardholderName && (
                <p className="text-red-600 text-sm mt-1">{errors.cardholderName}</p>
              )}
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.savePaymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, savePaymentMethod: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Save payment method for future orders</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Review Order
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Step 4: Order Review
const ReviewStep: React.FC<CheckoutStepProps> = ({ onNext, onBack, data }) => {
  const { cart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = data.shippingCost || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    onNext({ 
      orderId: `ORDER-${Date.now()}`,
      total,
      orderDetails: {
        items: cart,
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        shippingAddress: data.shipping,
        paymentMethod: data.payment,
        shippingMethod: data.shippingMethod
      }
    });
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Order</h3>
        
        {/* Order Items */}
        <div className="border rounded-lg divide-y">
          {cart.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <img
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping ({data.shippingMethod})</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
            <div className="text-sm text-gray-600">
              <p>{data.shipping?.firstName} {data.shipping?.lastName}</p>
              <p>{data.shipping?.address}</p>
              {data.shipping?.apartment && <p>{data.shipping.apartment}</p>}
              <p>{data.shipping?.city}, {data.shipping?.state} {data.shipping?.zipCode}</p>
              <p>{data.shipping?.phone}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Payment Method</h5>
            <div className="text-sm text-gray-600">
              {data.payment?.method === 'card' ? (
                <>
                  <p>Credit Card</p>
                  <p>**** **** **** {data.payment.cardNumber?.slice(-4)}</p>
                  <p>{data.payment.cardholderName}</p>
                </>
              ) : (
                <p className="capitalize">{data.payment?.method?.replace('_', ' ')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          disabled={isProcessing}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Step 5: Order Confirmation
const ConfirmationStep: React.FC<CheckoutStepProps> = ({ data }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
        <p className="text-gray-600">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Order Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-medium">{data.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">${data.total?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery:</span>
            <span className="font-medium">{data.estimatedDelivery || '5-7 business days'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          View Order
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

// Main Checkout Process Component
const AdvancedCheckoutProcess: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkoutData, setCheckoutData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: CheckoutStep[] = [
    {
      id: 'shipping',
      title: 'Shipping',
      description: 'Address & contact info',
      icon: <MapPin className="h-5 w-5" />,
      component: ShippingStep,
      isComplete: currentStepIndex > 0,
      isActive: currentStepIndex === 0
    },
    {
      id: 'shipping-method',
      title: 'Delivery',
      description: 'Shipping method',
      icon: <Truck className="h-5 w-5" />,
      component: ShippingMethodStep,
      isComplete: currentStepIndex > 1,
      isActive: currentStepIndex === 1
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Payment method',
      icon: <CreditCard className="h-5 w-5" />,
      component: PaymentStep,
      isComplete: currentStepIndex > 2,
      isActive: currentStepIndex === 2
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Confirm your order',
      icon: <ShoppingBag className="h-5 w-5" />,
      component: ReviewStep,
      isComplete: currentStepIndex > 3,
      isActive: currentStepIndex === 3
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Order complete',
      icon: <CheckCircle className="h-5 w-5" />,
      component: ConfirmationStep,
      isComplete: currentStepIndex > 4,
      isActive: currentStepIndex === 4
    }
  ];

  const handleNext = (data: any) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
    setErrors({});
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const CurrentStepComponent = steps[currentStepIndex].component;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step.isComplete
                  ? 'bg-green-600 border-green-600 text-white'
                  : step.isActive
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step.isComplete ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  step.isActive ? 'text-blue-600' : step.isComplete ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  steps[index + 1].isComplete || steps[index + 1].isActive
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <CurrentStepComponent
            onNext={handleNext}
            onBack={handleBack}
            data={checkoutData}
            errors={errors}
            setErrors={setErrors}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdvancedCheckoutProcess;
