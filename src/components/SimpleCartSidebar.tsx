import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface SimpleCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleCartSidebar: React.FC<SimpleCartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    items,
    totalPrice,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useSimpleCart();

  const { track } = useAnalytics();

  const handleUpdateQuantity = (item: any, newQty: number) => {
    const oldQty = item.quantity;
    const delta = newQty - oldQty;
    updateQuantity(item.id, newQty);
    try {
      track('update_quantity', {
        productId: item.product.id,
        name: item.product.name,
        old_quantity: oldQty,
        new_quantity: newQty,
        delta,
        unit_price: item.finalPrice,
        currency: (item.product as any)?.currency || 'VND',
      });
    } catch {}
  };

  const handleRemoveFromCart = (item: any) => {
    removeFromCart(item.id);
    try {
      track('remove_from_cart', {
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unit_price: item.finalPrice,
        currency: (item.product as any)?.currency || 'VND',
      });
    } catch {}
  };

  const handleClearCart = () => {
    try {
      track('clear_cart', { total_items: totalItems, total_price: totalPrice });
    } catch {}
    clearCart();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        data-testid="cart-sidebar"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-lg font-semibold">
              Giỏ hàng ({totalItems} sản phẩm)
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-11 h-11 p-0"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Local data notice */}
          <div className="px-4 py-2 text-xs text-gray-600 bg-gray-50 border-b">
            Lưu ý: Giỏ hàng được lưu cục bộ trên trình duyệt này.
          </div>
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600 mb-6">
                Thêm sản phẩm để bắt đầu mua sắm
              </p>
              <Button onClick={onClose} className="w-full max-w-xs">
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <Link to={`/products/${item.product.slug}`} onClick={onClose}>
                        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={(item.product.images.find(img => img.isPrimary) || item.product.images[0])?.url || '/placeholder.svg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.slug}`} onClick={onClose}>
                          <h4 className="font-medium text-sm text-gray-900 truncate hover:text-primary">
                            {item.product.name}
                          </h4>
                        </Link>
                        
                        <p className="text-xs text-gray-600 mt-1">
                          {item.product.category.name}
                        </p>

                        {/* Variants */}
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <div className="mt-1">
                            {Object.entries(item.selectedVariants).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-xs text-gray-600 mr-2"
                              >
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-primary">
                            {formatPrice(item.finalPrice)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-h-[44px] min-w-[44px] p-0 active:scale-95 transition-transform"
                              onClick={() => handleUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                              aria-label="Decrease quantity"
                              title="Decrease item quantity"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-h-[44px] min-w-[44px] p-0 active:scale-95 transition-transform"
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              aria-label="Increase quantity"
                              title="Increase item quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Subtotal: {formatPrice(item.finalPrice * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={() => handleRemoveFromCart(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart */}
                {items.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa giỏ hàng
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-4 bg-white" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <EnhancedButton asChild className="w-full" size="lg" variant="gradient">
                    <Link to="/checkout" data-testid="go-checkout" onClick={onClose}>
                      Thanh toán ({totalItems} sản phẩm)
                    </Link>
                  </EnhancedButton>
                  <EnhancedButton
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    Tiếp tục mua sắm
                  </EnhancedButton>
                </div>

                {/* Shipping Info */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  Miễn phí vận chuyển cho đơn hàng trên {formatPrice(500000)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};