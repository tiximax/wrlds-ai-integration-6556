import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, History, Settings } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { formatCurrency } from '../lib/format';
import { useLanguage } from '../contexts/LanguageContext';
import CartRecovery from './CartRecovery';

interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShoppingCartSidebar: React.FC<ShoppingCartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const {
    items,
    totalPrice,
    totalItems,
    updateQuantity: updateCartQuantity,
    removeFromCart,
    clearCart,
    getAbandonedCartsList,
    cartMetadata
  } = useCart();
  
  const [isCartRecoveryOpen, setIsCartRecoveryOpen] = useState(false);
  const abandonedCarts = getAbandonedCartsList();
  const hasAbandonedCarts = abandonedCarts.length > 0;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const removeItem = (itemId: string) => {
    removeFromCart(itemId);
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
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-lg font-semibold">
              {t('cart.title')} ({totalItems} {t('cart.items')})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Cart Recovery Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartRecoveryOpen(true)}
              className="p-2 relative"
              title="Quản lý giỏ hàng"
            >
              <Settings className="w-5 h-5" />
              {hasAbandonedCarts && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{abandonedCarts.length}</span>
                </div>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('cart.empty.title')}
              </h3>
              <p className="text-gray-500 mb-6">
                {t('cart.empty.description')}
              </p>
              
              {/* Cart Recovery for Empty Cart */}
              {hasAbandonedCarts && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <History className="w-4 h-4 text-blue-600" />
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
                    <History className="w-4 h-4 mr-1" />
                    Xem giỏ hàng đã lưu
                  </Button>
                </div>
              )}
              
              <Button onClick={onClose} className="w-full max-w-xs">
                {t('cart.continueShopping')}
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
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={(item.product.images.find(img => img.isPrimary) || item.product.images[0])?.url || '/api/placeholder/80/80'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        
                        {/* Variants */}
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <div className="mt-1">
                            {Object.entries(item.selectedVariants).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-xs text-gray-500 mr-2"
                              >
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-primary">
                            {formatCurrency(item.finalPrice)}
                          </span>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {t('cart.subtotal')}: {formatCurrency(item.finalPrice * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart & Advanced Features */}
                {items.length > 0 && (
                  <div className="mt-6 pt-4 border-t space-y-3">
                    {/* Cart Metadata */}
                    {cartMetadata && (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <div className="flex justify-between">
                          <span>Lưu lần cuối:</span>
                          <span>{new Date(cartMetadata.lastSaved).toLocaleTimeString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phiên bản:</span>
                          <span>{cartMetadata.version}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Advanced Features Button */}
                    <Button
                      variant="outline"
                      onClick={() => setIsCartRecoveryOpen(true)}
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Quản lý giỏ hàng
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('cart.clearAll')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-4 bg-white">
                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">{t('cart.total')}:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    {t('cart.checkout')} ({totalItems} {t('cart.items')})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    {t('cart.continueShopping')}
                  </Button>
                </div>

                {/* Shipping Info */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  {t('cart.freeShipping')} {formatCurrency(500000)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Cart Recovery Modal */}
      <CartRecovery 
        isOpen={isCartRecoveryOpen} 
        onClose={() => setIsCartRecoveryOpen(false)} 
      />
    </>
  );
};
