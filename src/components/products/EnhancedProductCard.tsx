import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Clock, 
  Users, 
  Zap, 
  Package, 
  Heart,
  Eye,
  Share2,
  Plus,
  Check,
  ArrowRight
} from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMouseTilt } from '@/hooks/use-mouse-tilt';
import LazyImage from '@/components/LazyImage';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EnhancedProductCardProps {
  product: Product;
  className?: string;
  showWishlist?: boolean;
  showQuickView?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onShare?: (product: Product) => void;
  layout?: 'grid' | 'list';
  isWishlisted?: boolean;
  priority?: boolean;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  className = '',
  showWishlist = true,
  showQuickView = true,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onShare,
  layout = 'grid',
  isWishlisted = false,
  priority = false
}) => {
  const { t } = useLanguage();
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 3D Tilt Effect - only for grid layout
  const { ref: tiltRef, tiltStyle, isHovered } = useMouseTilt({
    maxTilt: layout === 'grid' ? 15 : 0,
    perspective: 1000,
    scale: layout === 'grid' ? 1.03 : 1.01,
    speed: 0.2
  });

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hasMultipleImages = product.images.length > 1;

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

  // Get badge info based on product type/status
  const getBadgeInfo = () => {
    if (product.type === 'flash_deal' && product.deal?.isActive) {
      return {
        text: `FLASH ${product.deal.discountPercent}%`,
        variant: 'destructive' as const,
        icon: <Zap className="w-3 h-3" />,
        pulse: true
      };
    }
    
    if (product.type === 'group_buy') {
      const current = product.deal?.currentQuantity || 0;
      const min = product.deal?.minQuantity || 0;
      return {
        text: `Group ${current}/${min}`,
        variant: 'secondary' as const,
        icon: <Users className="w-3 h-3" />
      };
    }
    
    if (product.status === 'preorder') {
      return {
        text: 'Preorder',
        variant: 'outline' as const,
        icon: <Clock className="w-3 h-3" />
      };
    }
    
    if (product.type === 'ready_stock' && product.stock > 0) {
      return {
        text: 'Có sẵn',
        variant: 'secondary' as const,
        icon: <Package className="w-3 h-3" />
      };
    }
    
    return null;
  };

  // Enhanced CTA with animations
  const handleAddToCart = async () => {
    if (!onAddToCart || isCartLoading) return;
    
    setIsCartLoading(true);
    try {
      await onAddToCart(product.id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Get origin flag emoji
  const getOriginFlag = (origin: string) => {
    const flags = {
      'japan': '🇯🇵',
      'korea': '🇰🇷', 
      'usa': '🇺🇸',
      'europe': '🇪🇺'
    };
    return flags[origin as keyof typeof flags] || '🌍';
  };

  const badgeInfo = getBadgeInfo();

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  if (layout === 'list') {
    // List Layout - horizontal card
    return (
      <motion.div
        ref={tiltRef}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={tiltStyle}
        className={cn("group w-full", className)}
      >
        <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardContent className="p-0 flex">
            {/* Image Container - Fixed width for list */}
            <div className="relative w-48 h-48 overflow-hidden bg-gray-50 flex-shrink-0">
              <Link to={`/products/${product.slug}`}>
                <LazyImage
                  src={primaryImage?.url || ''}
                  alt={primaryImage?.alt || product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  priority={priority}
                />
              </Link>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                {badgeInfo && (
                  <Badge variant={badgeInfo.variant} className={cn(
                    "flex items-center gap-1 text-xs",
                    badgeInfo.pulse && "animate-pulse"
                  )}>
                    {badgeInfo.icon}
                    {badgeInfo.text}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Content - Flexible width */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              {/* Top content */}
              <div>
                {/* Brand & Rating */}
                <div className="flex justify-between items-start mb-2">
                  {product.brand && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={product.brand.logo} 
                        alt={product.brand.name}
                        className="w-5 h-5 object-contain rounded"
                      />
                      <span className="text-sm text-gray-500 font-medium">
                        {product.brand.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.rating.average} ({product.rating.count})
                    </span>
                  </div>
                </div>
                
                {/* Product Name */}
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.shortDescription}
                </p>
              </div>
              
              {/* Bottom content */}
              <div className="flex justify-between items-end">
                {/* Pricing */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.sellingPrice)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  
                  {/* Stock info */}
                  {product.type === 'ready_stock' && (
                    <div className="text-sm">
                      {product.stock > 10 ? (
                        <span className="text-green-600 font-medium">Còn hàng</span>
                      ) : product.stock > 0 ? (
                        <span className="text-orange-600 font-medium">Chỉ còn {product.stock}</span>
                      ) : (
                        <span className="text-red-600 font-medium">Hết hàng</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {showQuickView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onQuickView?.(product.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isCartLoading}
                    className="flex items-center gap-2"
                  >
                    {isCartLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.div>
                    ) : showSuccess ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid Layout - vertical card with 3D effects
  return (
    <motion.div
      ref={tiltRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={tiltStyle}
      className={cn("group", className)}
    >
      <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        {/* 3D Inner Layer */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: 'translateZ(20px)' }}
        />
        
        <CardContent className="p-0 relative z-10">
          {/* Image Container */}
          <div 
            className="relative aspect-square overflow-hidden bg-gray-50"
            onMouseEnter={() => hasMultipleImages && setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
          >
            <Link to={`/products/${product.slug}`}>
              <LazyImage
                src={product.images[currentImageIndex]?.url || primaryImage?.url || ''}
                alt={product.images[currentImageIndex]?.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                priority={priority}
              />
            </Link>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <AnimatePresence>
                {isHovered && (
                  <>
                    {showWishlist && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ delay: 0.1 }}
                        onClick={(e) => {
                          e.preventDefault();
                          onAddToWishlist?.(product.id);
                        }}
                        className={cn(
                          "p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200",
                          isWishlisted 
                            ? "bg-red-500 text-white" 
                            : "bg-white/90 text-gray-600 hover:bg-red-50"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                      </motion.button>
                    )}
                    
                    {showQuickView && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ delay: 0.2 }}
                        onClick={(e) => {
                          e.preventDefault();
                          onQuickView?.(product.id);
                        }}
                        className="p-2 bg-white/90 rounded-full shadow-lg backdrop-blur-sm text-gray-600 hover:bg-blue-50 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    )}
                    
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ delay: 0.3 }}
                      onClick={(e) => {
                        e.preventDefault();
                        onShare?.(product);
                      }}
                      className="p-2 bg-white/90 rounded-full shadow-lg backdrop-blur-sm text-gray-600 hover:bg-green-50 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {badgeInfo && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={badgeInfo.pulse ? "animate-pulse" : ""}
                >
                  <Badge variant={badgeInfo.variant} className="flex items-center gap-1 text-xs shadow-sm">
                    {badgeInfo.icon}
                    {badgeInfo.text}
                  </Badge>
                </motion.div>
              )}
              
              {discountPercent > 0 && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge variant="destructive" className="text-xs font-bold shadow-sm">
                    -{discountPercent}%
                  </Badge>
                </motion.div>
              )}
              
              {product.trending && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge className="text-xs bg-orange-100 text-orange-700 shadow-sm">
                    🔥 Hot
                  </Badge>
                </motion.div>
              )}
            </div>
            
            {/* Origin Flag */}
            <div className="absolute bottom-3 left-3">
              <motion.span 
                className="text-lg filter drop-shadow-sm" 
                title={product.origin}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {getOriginFlag(product.origin)}
              </motion.span>
            </div>
            
            {/* Image indicator dots for multiple images */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 right-3 flex gap-1">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Brand & Rating */}
            <div className="flex justify-between items-start">
              {product.brand && (
                <div className="flex items-center gap-2">
                  <img 
                    src={product.brand.logo} 
                    alt={product.brand.name}
                    className="w-5 h-5 object-contain rounded"
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    {product.brand.name}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">
                  {product.rating.average}
                </span>
              </div>
            </div>
            
            {/* Product Name */}
            <Link to={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {/* Short Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.shortDescription}
            </p>
            
            {/* Pricing */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <motion.span 
                  className="text-lg font-bold text-gray-900"
                  whileHover={{ scale: 1.05 }}
                >
                  {formatPrice(product.sellingPrice)}
                </motion.span>
                
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Stock Info */}
            {product.type === 'ready_stock' && (
              <div className="text-xs">
                {product.stock > 10 ? (
                  <span className="text-green-600 font-medium">✓ Còn hàng</span>
                ) : product.stock > 0 ? (
                  <span className="text-orange-600 font-medium">⚠ Chỉ còn {product.stock}</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Hết hàng</span>
                )}
              </div>
            )}
            
            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full flex items-center justify-center gap-2 font-medium"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isCartLoading}
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
                        <Plus className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  ) : showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {isCartLoading ? 'Đang thêm...' : showSuccess ? 'Đã thêm!' : product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedProductCard;
