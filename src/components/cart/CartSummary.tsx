import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, Gift, Tag, ChevronDown, ChevronUp, Info, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CartSummarySkeleton } from '@/components/skeletons';

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout: () => void;
  isCheckingOut?: boolean;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

const PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage', description: 'Giảm 10% cho đơn hàng đầu tiên' },
  { code: 'FREESHIP', discount: 30000, type: 'fixed', description: 'Miễn phí vận chuyển' },
  { code: 'SAVE50K', discount: 50000, type: 'fixed', description: 'Giảm 50.000đ cho đơn từ 500.000đ' },
];

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  totalItems,
  onCheckout,
  isCheckingOut = false,
  className,
  isLoading = false,
  error = null,
  onRetry = () => {}
}) => {
  // Show skeleton while loading
  if (isLoading) {
    return <CartSummarySkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("bg-gray-50 rounded-xl p-6", className)}
      >
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to Load Cart
              </h3>
              <p className="text-red-700 mb-4">
                {error.message || 'An error occurred while calculating your cart total.'}
              </p>
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [showPromoSuggestions, setShowPromoSuggestions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate shipping
  const shippingThreshold = 500000; // Free shipping threshold
  const shippingCost = subtotal >= shippingThreshold ? 0 : 30000;
  const freeShippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const amountForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = (subtotal * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount;
    }
  }

  // Calculate total
  const total = subtotal - discount + shippingCost;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundPromo = PROMO_CODES.find(
        p => p.code.toLowerCase() === promoCode.toLowerCase()
      );

      if (foundPromo) {
        // Check minimum order requirements
        if (foundPromo.code === 'SAVE50K' && subtotal < 500000) {
          toast.error('Mã giảm giá này chỉ áp dụng cho đơn hàng từ 500.000đ');
          return;
        }

        setAppliedPromo(foundPromo);
        toast.success(`Đã áp dụng mã ${foundPromo.code}: ${foundPromo.description}`);
        setPromoCode('');
        setShowPromoSuggestions(false);
      } else {
        toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    } catch (error) {
      toast.error('Có lỗi khi áp dụng mã giảm giá');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success('Đã hủy mã giảm giá');
  };

  const handleSuggestedPromo = (code: string) => {
    setPromoCode(code);
    setShowPromoSuggestions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-gray-50 rounded-xl p-6 space-y-4", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Tóm tắt đơn hàng
        </h3>
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Chi tiết
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      {/* Free Shipping Progress */}
      <AnimatePresence>
        {amountForFreeShipping > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Mua thêm {formatCurrency(amountForFreeShipping)} để được miễn phí vận chuyển
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
        {amountForFreeShipping === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                🎉 Bạn được miễn phí vận chuyển!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
          <motion.span 
            className="font-medium"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3 }}
            key={subtotal}
          >
            {formatCurrency(subtotal)}
          </motion.span>
        </div>

        {/* Detailed breakdown */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pl-4 border-l-2 border-gray-200"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">VAT (10%)</span>
                <span>{formatCurrency(subtotal * 0.1)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Giá trước thuế</span>
                <span>{formatCurrency(subtotal * 0.9)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Vận chuyển</span>
            {shippingCost === 0 && (
              <Badge variant="secondary" className="text-xs">
                Miễn phí
              </Badge>
            )}
          </div>
          <span className="font-medium">
            {shippingCost === 0 ? 'Miễn phí' : formatCurrency(shippingCost)}
          </span>
        </div>

        {/* Discount */}
        <AnimatePresence>
          {appliedPromo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between items-center text-green-600"
            >
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>Giảm giá ({appliedPromo.code})</span>
                <button
                  onClick={handleRemovePromo}
                  className="text-xs text-gray-500 hover:text-red-500 ml-1"
                >
                  ✕
                </button>
              </div>
              <span className="font-medium">
                -{formatCurrency(discount)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promo Code Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                className="pr-10"
                disabled={isApplyingPromo || appliedPromo !== null}
              />
              <motion.button
                onClick={() => setShowPromoSuggestions(!showPromoSuggestions)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tag className="w-4 h-4" />
              </motion.button>
            </div>
            <Button
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || isApplyingPromo || appliedPromo !== null}
              size="sm"
              className="px-4"
            >
              {isApplyingPromo ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Áp dụng'
              )}
            </Button>
          </div>

          {/* Promo Suggestions */}
          <AnimatePresence>
            {showPromoSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 shadow-sm"
              >
                <div className="text-xs text-gray-500 font-medium">Mã giảm giá có sẵn:</div>
                {PROMO_CODES.map((promo) => (
                  <motion.button
                    key={promo.code}
                    onClick={() => handleSuggestedPromo(promo.code)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-blue-600">{promo.code}</div>
                        <div className="text-xs text-gray-500">{promo.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {promo.type === 'percentage' ? `${promo.discount}%` : formatCurrency(promo.discount)}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
            <motion.span 
              className="text-xl font-bold text-blue-600"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              key={total}
            >
              {formatCurrency(total)}
            </motion.span>
          </div>
          {discount > 0 && (
            <div className="text-sm text-green-600 text-right">
              Bạn tiết kiệm được {formatCurrency(discount)}!
            </div>
          )}
        </div>
      </div>

      {/* Checkout Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onCheckout}
          disabled={isCheckingOut || totalItems === 0}
          className="w-full py-3 text-lg font-semibold relative overflow-hidden"
          size="lg"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ x: "100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isCheckingOut ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Đang xử lý...
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Thanh toán ({totalItems} sản phẩm)
              </>
            )}
          </span>
        </Button>
      </motion.div>

      {/* Security Info */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <Info className="w-3 h-3" />
        <span>Thanh toán được bảo mật bằng SSL 256-bit</span>
      </div>
    </motion.div>
  );
};
