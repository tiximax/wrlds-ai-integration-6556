/*
  LEGACY: Enhanced Shopping Cart Sidebar (không dùng trong UI hiện tại)
  - Thành phần giỏ hàng nâng cao được giữ lại để tham khảo hoặc sử dụng tương lai.
  - Vui lòng KHÔNG import vào UI production hiện hành (hiện đang dùng SimpleCartSidebar).
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Package, 
  ArrowLeft, 
  Settings,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedCartItem } from './cart/EnhancedCartItem';
import { CartSummary } from './cart/CartSummary';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CartRecovery from './CartRecovery';

interface EnhancedShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants = {
  hidden: { 
    opacity: 0,
    x: "100%"
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0,
    x: "100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const emptyCartVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const EnhancedShoppingCartSidebar: React.FC<EnhancedShoppingCartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    items,
    totalPrice,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getAbandonedCartsList,
  } = useCart();
  
  const { addToWishlist } = useWishlist();
  
  const [isCartRecoveryOpen, setIsCartRecoveryOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const abandonedCarts = getAbandonedCartsList();
  const hasAbandonedCarts = abandonedCarts.length > 0;

  const handleQuantityUpdate = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => new Set([...prev, itemId]));
    
    // Add delay for animation
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleAddToWishlist = (item: CartItem) => {
    addToWishlist(item.product);
    toast.success(`Đã thêm ${item.product.name} vào danh sách yêu thích`);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Đơn hàng đã được tạo thành công!', {
        description: 'Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng.',
        duration: 5000,
      });
      
      // In real app, navigate to checkout success page
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = async () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          clearCart();
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Đang xóa giỏ hàng...',
        success: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
        error: 'Có lỗi khi xóa giỏ hàng'
      }
    );
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            data-testid="cart-sidebar"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: totalItems > 0 ? [0, -10, 10, 0] : 0,
                    scale: totalItems > 0 ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Giỏ hàng
                  </h2>
                  <motion.p 
                    className="text-sm text-gray-500"
                    key={totalItems}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {totalItems} sản phẩm
                  </motion.p>
                </div>
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {totalItems}
                    </Badge>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Cart Management Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCartRecoveryOpen(true)}
                    className="relative p-2"
                    title="Quản lý giỏ hàng"
                  >
                    <Settings className="w-5 h-5" />
                    {hasAbandonedCarts && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-bold">
                          {abandonedCarts.length}
                        </span>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>

                {/* Close Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {items.length === 0 ? (
                /* Empty Cart */
                <motion.div
                  variants={emptyCartVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    variants={itemVariants}
                    className="relative mb-6"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Package className="w-20 h-20 text-gray-300" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  </motion.div>

                  <motion.h3 
                    variants={itemVariants}
                    className="text-xl font-semibold text-gray-900 mb-3"
                  >
                    Giỏ hàng trống
                  </motion.h3>
                  
                  <motion.p 
                    variants={itemVariants}
                    className="text-gray-500 mb-8 max-w-xs"
                  >
                    Hãy khám phá các sản phẩm tuyệt vời và thêm chúng vào giỏ hàng!
                  </motion.p>

                  {/* Cart Recovery for Empty Cart */}
                  <AnimatePresence>
                    {hasAbandonedCarts && (
                      <motion.div
                        variants={itemVariants}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 w-full max-w-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Giỏ hàng đã lưu
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 mb-3">
                          Bạn có {abandonedCarts.length} giỏ hàng đã lưu trước đó
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCartRecoveryOpen(true)}
                          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          Xem giỏ hàng đã lưu
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <Button 
                      onClick={onClose} 
                      className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Tiếp tục mua sắm
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {/* Cart Items */}
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          layout
                        >
                          <EnhancedCartItem
                            item={item}
                            onUpdateQuantity={handleQuantityUpdate}
                            onRemove={handleRemoveItem}
                            onAddToWishlist={handleAddToWishlist}
                            isRemoving={removingItems.has(item.id)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Clear Cart Button */}
                    {items.length > 1 && (
                      <motion.div
                        variants={itemVariants}
                        className="pt-4 border-t border-gray-200"
                      >
                        <Button
                          variant="outline"
                          onClick={handleClearCart}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Xóa tất cả sản phẩm
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Cart Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="border-t bg-white p-4"
                  >
                    <CartSummary
                      subtotal={totalPrice}
                      totalItems={totalItems}
                      onCheckout={handleCheckout}
                      isCheckingOut={isCheckingOut}
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '60px 60px'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Recovery Modal */}
      <CartRecovery 
        isOpen={isCartRecoveryOpen} 
        onClose={() => setIsCartRecoveryOpen(false)} 
      />
    </>
  );
};

export default EnhancedShoppingCartSidebar;
