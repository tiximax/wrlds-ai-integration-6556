import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Users,
  Clock,
  Package,
  Plus,
  Minus,
  Check,
  ExternalLink
} from 'lucide-react';
import { Product } from '@/types/product';
import { useTranslation } from 'react-i18next';
import LazyImage from '@/components/LazyImage';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  onShare?: (product: Product) => void;
  isWishlisted?: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onAddToWishlist,
  onShare,
  isWishlisted = false
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setQuantity(1);
      setShowSuccess(false);
      setSelectedVariants({});
    }
  }, [product]);

  if (!product) return null;

  const currentImage = product.images[currentImageIndex] || product.images[0];

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discount percentage
  const discountPercent = product.compareAtPrice 
    ? Math.round((1 - product.sellingPrice / product.compareAtPrice) * 100)
    : 0;

  // Get badge info
  const getBadgeInfo = () => {
    if (product.type === 'flash_deal' && product.deal?.isActive) {
      return {
        text: `FLASH ${product.deal.discountPercent}%`,
        variant: 'destructive' as const,
        icon: <Zap className="w-4 h-4" />,
        pulse: true
      };
    }
    
    if (product.type === 'group_buy') {
      const current = product.deal?.currentQuantity || 0;
      const min = product.deal?.minQuantity || 0;
      return {
        text: `Group Buy ${current}/${min}`,
        variant: 'secondary' as const,
        icon: <Users className="w-4 h-4" />
      };
    }
    
    if (product.status === 'preorder') {
      return {
        text: 'Preorder',
        variant: 'outline' as const,
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    return null;
  };

  const badgeInfo = getBadgeInfo();

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!onAddToCart || isCartLoading) return;
    
    setIsCartLoading(true);
    try {
      await onAddToCart(product.id, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Quantity controls
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Modal animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[80vh]"
        >
          {/* Image Gallery Section */}
          <div className="relative bg-gray-50 min-h-[400px] lg:min-h-[600px]">
            {/* Main Image */}
            <div className="relative h-full overflow-hidden">
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={currentImageIndex}
                  custom={1}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0"
                >
                  {/* Desktop lens zoom for QuickView */}
                  <div className="hidden lg:block w-full h-full">
                    {currentImage?.url && (
                      React.createElement(require('@/components/ui/lens-zoom').default, {
                        src: currentImage.url,
                        alt: currentImage?.alt || product.name,
                        zoom: 2,
                        className: 'w-full h-full'
                      })
                    )}
                  </div>
                  {/* Mobile/Tablet image */}
                  <div className="block lg:hidden w-full h-full">
                    <LazyImage
                      src={currentImage?.url || ''}
                      alt={currentImage?.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {badgeInfo && (
                  <Badge 
                    variant={badgeInfo.variant} 
                    className={cn(
                      "flex items-center gap-1 shadow-sm backdrop-blur-sm",
                      badgeInfo.pulse && "animate-pulse"
                    )}
                  >
                    {badgeInfo.icon}
                    {badgeInfo.text}
                  </Badge>
                )}
                
                {discountPercent > 0 && (
                  <Badge variant="destructive" className="font-bold shadow-sm backdrop-blur-sm">
                    -{discountPercent}%
                  </Badge>
                )}
                
                {product.trending && (
                  <Badge className="bg-orange-100 text-orange-700 shadow-sm backdrop-blur-sm">
                    🔥 Hot
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                      index === currentImageIndex
                        ? "border-blue-500 shadow-lg scale-105"
                        : "border-white/50 hover:border-white"
                    )}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 overflow-y-auto">
            <DialogHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Brand */}
                  {product.brand && (
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={product.brand.logo} 
                        alt={product.brand.name}
                        className="w-6 h-6 object-contain rounded"
                      />
                      <span className="text-sm text-gray-500 font-medium">
                        {product.brand.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Product Title */}
                  <DialogTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {product.name}
                  </DialogTitle>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating.average)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.average} ({product.rating.count} reviews)
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </DialogHeader>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.sellingPrice)}
                </span>
                
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="mt-2 text-sm">
                {product.stock > 10 ? (
                  <span className="text-green-600 font-medium">✓ Còn hàng ({product.stock} sản phẩm)</span>
                ) : product.stock > 0 ? (
                  <span className="text-orange-600 font-medium">⚠ Chỉ còn {product.stock} sản phẩm</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Hết hàng</span>
                )}
              </div>
            </div>

            {/* Variants Selection (if available) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variant.name}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {variant.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedVariants(prev => ({
                            ...prev,
                            [variant.id]: option.id
                          }))}
                          className={cn(
                            "px-3 py-2 rounded-md border text-sm font-medium transition-colors",
                            selectedVariants[variant.id] === option.id
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 hover:border-gray-400"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selection */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    (Tối đa {product.stock})
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add to Cart */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isCartLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 font-semibold text-lg"
                  size="lg"
                >
                  <AnimatePresence mode="wait">
                    {isCartLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 180 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Plus className="w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    ) : showSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isCartLoading 
                    ? 'Đang thêm...' 
                    : showSuccess 
                    ? 'Đã thêm vào giỏ!' 
                    : product.stock > 0 
                    ? `Thêm ${quantity} vào giỏ hàng` 
                    : 'Hết hàng'
                  }
                </Button>
              </motion.div>

              {/* Secondary Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onAddToWishlist?.(product.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2",
                    isWishlisted && "bg-red-50 border-red-200 text-red-600"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                  {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => onShare?.(product)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </Button>
              </div>

              {/* View Full Details */}
              <Button
                variant="ghost"
                asChild
                className="w-full flex items-center justify-center gap-2"
              >
                <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Xem chi tiết đầy đủ
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
