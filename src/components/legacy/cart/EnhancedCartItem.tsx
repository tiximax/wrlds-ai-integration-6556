/*
  LEGACY: Enhanced Cart Item (không dùng trong UI hiện tại)
  - Hỗ trợ animation & cảnh báo nâng cao cho item trong giỏ hàng nâng cao.
  - Không import vào UI production hiện hành.
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Heart, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { CartItem } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EnhancedCartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onAddToWishlist?: (item: CartItem) => void;
  isRemoving?: boolean;
  className?: string;
}

export const EnhancedCartItem: React.FC<EnhancedCartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onAddToWishlist,
  isRemoving = false,
  className
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const primaryImage = item.product.images.find(img => img.isPrimary) || item.product.images[0];
  const hasVariants = item.selectedVariants && Object.keys(item.selectedVariants).length > 0;
  const isOutOfStock = item.product.stock === 0;
  const isLowStock = item.product.stock > 0 && item.product.stock <= 5;
  const exceedsStock = item.quantity > item.product.stock;

  // Handle quantity updates with debouncing
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      setShowConfirmDelete(true);
      return;
    }

    setIsUpdating(true);
    setPendingQuantity(newQuantity);

    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      onUpdateQuantity(item.id, newQuantity);
      
      if (newQuantity > item.quantity) {
        toast.success(`Đã tăng số lượng lên ${newQuantity}`);
      } else {
        toast.success(`Đã giảm số lượng xuống ${newQuantity}`);
      }
    } catch (error) {
      toast.error('Có lỗi khi cập nhật số lượng');
    } finally {
      setIsUpdating(false);
      setPendingQuantity(null);
    }
  };

  const handleRemove = async () => {
    try {
      onRemove(item.id);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Có lỗi khi xóa sản phẩm');
    }
  };

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(item);
      toast.success('Đã thêm vào danh sách yêu thích');
    }
  };

  const displayQuantity = pendingQuantity !== null ? pendingQuantity : item.quantity;
  const subtotal = item.finalPrice * displayQuantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        y: isRemoving ? -20 : 0,
        scale: isRemoving ? 0.95 : 1,
        x: isRemoving ? 300 : 0
      }}
      exit={{ 
        opacity: 0, 
        y: -20, 
        scale: 0.95,
        x: 300,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        layout: { duration: 0.3 }
      }}
      className={cn(
        "group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300",
        isRemoving && "pointer-events-none",
        exceedsStock && "border-red-200 bg-red-50/50",
        className
      )}
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        {/* Product Image */}
        <motion.div 
          className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={primaryImage?.url || '/api/placeholder/80/80'}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs">
                Hết hàng
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <motion.h4 
                className="font-medium text-gray-900 truncate"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.product.name}
              </motion.h4>

              {/* Variants */}
              {hasVariants && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(item.selectedVariants!).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stock Warnings */}
              <AnimatePresence>
                {exceedsStock && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex items-center gap-1 text-red-600"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs">
                      Chỉ còn {item.product.stock} sản phẩm
                    </span>
                  </motion.div>
                )}
                {isLowStock && !exceedsStock && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex items-center gap-1 text-orange-600"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs">
                      Chỉ còn {item.product.stock} sản phẩm
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Price */}
              <div className="mt-2">
                <motion.span 
                  className="font-semibold text-blue-600"
                  animate={{ 
                    scale: isUpdating ? [1, 1.05, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {formatCurrency(item.finalPrice)}
                </motion.span>
                {item.product.compareAtPrice && item.product.compareAtPrice > item.finalPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {formatCurrency(item.product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-start gap-1">
              {onAddToWishlist && (
                <motion.button
                  onClick={handleAddToWishlist}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-4 h-4" />
                </motion.button>
              )}

              <motion.button
                onClick={() => setShowConfirmDelete(true)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Quantity Controls & Subtotal */}
          <div className="mt-3 flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <motion.button
                  onClick={() => handleQuantityChange(displayQuantity - 1)}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating || displayQuantity <= 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-3 h-3" />
                </motion.button>

                <motion.span 
                  className="px-3 py-2 text-sm font-medium min-w-[40px] text-center"
                  animate={{ 
                    scale: isUpdating ? [1, 1.1, 1] : 1,
                    color: exceedsStock ? "#dc2626" : "#374151"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {displayQuantity}
                </motion.span>

                <motion.button
                  onClick={() => handleQuantityChange(displayQuantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating || displayQuantity >= item.product.stock}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </div>

              <span className="text-xs text-gray-500">
                / {item.product.stock} có sẵn
              </span>
            </div>

            {/* Subtotal */}
            <motion.div 
              className="text-right"
              animate={{ 
                scale: isUpdating ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(subtotal)}
              </div>
              {displayQuantity > 1 && (
                <div className="text-xs text-gray-500">
                  {displayQuantity} × {formatCurrency(item.finalPrice)}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center p-4 z-20"
          >
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-4">
                Xóa sản phẩm khỏi giỏ hàng?
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Hủy
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Xóa
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
