import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Clock, 
  Download, 
  Upload, 
  RefreshCw, 
  X, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { AbandonedCart } from '@/utils/cartPersistence';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface CartRecoveryProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartRecovery: React.FC<CartRecoveryProps> = ({ isOpen, onClose }) => {
  const { 
    getAbandonedCartsList, 
    restoreAbandonedCart, 
    exportCart, 
    importCart,
    totalItems 
  } = useCart();
  
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [importData, setImportData] = useState('');
  const [activeTab, setActiveTab] = useState<'abandoned' | 'import' | 'export'>('abandoned');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const carts = getAbandonedCartsList();
      setAbandonedCarts(carts);
    }
  }, [isOpen, getAbandonedCartsList]);

  const handleRestoreCart = async (cartId: string) => {
    setIsLoading(true);
    try {
      restoreAbandonedCart(cartId);
      onClose();
      } catch (error: unknown) {
      console.error('Failed to restore cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCart = () => {
    try {
      const cartData = exportCart();
      if (cartData) {
        // Create download link
        const blob = new Blob([cartData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cart-export-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Đã xuất giỏ hàng thành công');
      }
    } catch (error) {
      console.error('Failed to export cart:', error);
      toast.error('Lỗi khi xuất giỏ hàng');
    }
  };

  const handleImportCart = () => {
    if (!importData.trim()) {
      toast.error('Vui lòng nhập dữ liệu giỏ hàng');
      return;
    }

    setIsLoading(true);
    try {
      const success = importCart(importData);
      if (success) {
        setImportData('');
        onClose();
      }
    } catch (error) {
      console.error('Failed to import cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return format(past, 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Quản lý Giỏ hàng
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('abandoned')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'abandoned'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Giỏ hàng đã bỏ
                {abandonedCarts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {abandonedCarts.length}
                  </Badge>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'import'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Nhập giỏ hàng
              </div>
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'export'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Xuất giỏ hàng
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'abandoned' && (
              <div className="space-y-4">
                {abandonedCarts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không có giỏ hàng nào được lưu trữ</p>
                  </div>
                ) : (
                  abandonedCarts.map((cart, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline">
                                {cart.totalItems} sản phẩm
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(cart.abandonedAt)}
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(cart.totalValue)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Thiết bị: {cart.metadata.deviceId.substring(0, 20)}...
                            </p>
                          </div>
                          <Button
                            onClick={() => handleRestoreCart(cart.metadata.tabId)}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Khôi phục
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === 'import' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Nhập giỏ hàng</h3>
                  <p className="text-gray-600 mb-4">
                    Bạn có thể nhập giỏ hàng từ file JSON hoặc dán trực tiếp dữ liệu.
                  </p>
                  
                  {/* File Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn file JSON
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  {/* Text Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hoặc dán dữ liệu JSON
                    </label>
                    <Textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Dán dữ liệu JSON giỏ hàng vào đây..."
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleImportCart}
                    disabled={!importData.trim() || isLoading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isLoading ? 'Đang nhập...' : 'Nhập giỏ hàng'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Xuất giỏ hàng</h3>
                  <p className="text-gray-600 mb-4">
                    Xuất giỏ hàng hiện tại thành file JSON để sao lưu hoặc chia sẻ.
                  </p>

                  {totalItems > 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          Giỏ hàng hiện tại
                        </span>
                      </div>
                      <p className="text-green-700">
                        {totalItems} sản phẩm sẵn sàng để xuất
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-800">
                          Giỏ hàng trống
                        </span>
                      </div>
                      <p className="text-orange-700">
                        Thêm sản phẩm vào giỏ hàng trước khi xuất
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleExportCart}
                    disabled={totalItems === 0}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống giỏ hàng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartRecovery;
