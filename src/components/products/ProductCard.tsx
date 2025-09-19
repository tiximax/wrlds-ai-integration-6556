import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Clock, Users, Zap, Package, Heart } from 'lucide-react';
import { Product } from '@/types/simple';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import LazyImage from '@/components/LazyImage';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ProductCardProps {
  product: Product;
  className?: string;
  showWishlist?: boolean;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  showWishlist = true,
  onAddToCart,
  onAddToWishlist
}) => {
  const { t } = useTranslation();
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

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
        icon: <Zap className="w-3 h-3" />
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

  // Get CTA button info
  const getCTAInfo = () => {
    if (product.status === 'preorder') {
      const deposit = product.preorderInfo?.depositPercent || 0;
      return {
        text: `Đặt cọc ${deposit}%`,
        icon: <Clock className="w-4 h-4" />,
        variant: 'outline' as const,
        available: true
      };
    }
    
    if (product.type === 'group_buy') {
      return {
        text: 'Tham gia',
        icon: <Users className="w-4 h-4" />,
        variant: 'default' as const,
        available: true
      };
    }
    
    if (product.stock > 0) {
      return {
        text: 'Thêm vào giỏ',
        icon: <ShoppingCart className="w-4 h-4" />,
        variant: 'default' as const,
        available: true
      };
    }
    
    return {
      text: 'Hết hàng',
      icon: <Package className="w-4 h-4" />,
      variant: 'secondary' as const,
      available: false
    };
  };

  const badgeInfo = getBadgeInfo();
  const ctaInfo = getCTAInfo();

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

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group ${className}`}
    >
      <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Link to={`/products/${product.slug}`}>
              <LazyImage
                src={primaryImage?.url || ''}
                alt={primaryImage?.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                priority={product.featured}
              />
            </Link>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {badgeInfo && (
                <Badge variant={badgeInfo.variant} className="flex items-center gap-1 text-xs">
                  {badgeInfo.icon}
                  {badgeInfo.text}
                </Badge>
              )}
              
              {discountPercent > 0 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  -{discountPercent}%
                </Badge>
              )}
              
              {product.trending && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  Hot
                </Badge>
              )}
            </div>
            
            {/* Origin Flag */}
            <div className="absolute top-3 right-3">
              <span className="text-lg" title={product.origin}>
                {getOriginFlag(product.origin)}
              </span>
            </div>
            
            {/* Wishlist Button */}
            {showWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToWishlist?.(product.id);
                }}
                className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50"
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            )}
            
            {/* Preorder Progress */}
            {product.status === 'preorder' && product.preorderInfo && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                <div className="flex justify-between items-center text-xs">
                  <span>{product.preorderInfo.currentPreorderCount}/{product.preorderInfo.minPreorderQuantity}</span>
                  <span>
                    {format(product.preorderInfo.expectedArrival, 'dd/MM', { locale: vi })}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((product.preorderInfo.currentPreorderCount / product.preorderInfo.minPreorderQuantity) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            {/* Brand & Rating */}
            <div className="flex justify-between items-start mb-2">
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
                  {product.rating.average} ({product.rating.count})
                </span>
              </div>
            </div>
            
            {/* Product Name */}
            <Link to={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {/* Short Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.shortDescription}
            </p>
            
            {/* Pricing */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.sellingPrice)}
                </span>
                
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              
              {/* Preorder Pricing */}
              {product.status === 'preorder' && product.preorderInfo?.estimatedPrice && (
                <div className="text-xs text-gray-500 mt-1">
                  Dự kiến: {formatPrice(product.preorderInfo.estimatedPrice.min)} - {formatPrice(product.preorderInfo.estimatedPrice.max)}
                </div>
              )}
            </div>
            
            {/* Stock Info */}
            {product.type === 'ready_stock' && (
              <div className="mb-3">
                {product.stock > 10 ? (
                  <span className="text-xs text-green-600 font-medium">Còn hàng</span>
                ) : product.stock > 0 ? (
                  <span className="text-xs text-orange-600 font-medium">Chỉ còn {product.stock}</span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">Hết hàng</span>
                )}
              </div>
            )}
            
            {/* CTA Button */}
            <Button
              className="w-full flex items-center justify-center gap-2"
              variant={ctaInfo.variant}
              disabled={!ctaInfo.available}
              onClick={() => ctaInfo.available && onAddToCart?.(product.id)}
            >
              {ctaInfo.icon}
              {ctaInfo.text}
            </Button>
            
            {/* Deal Timer for Flash Sales */}
            {product.type === 'flash_deal' && product.deal?.isActive && product.deal.endDate && (
              <div className="mt-2 text-center">
                <div className="text-xs text-red-600 font-medium">
                  Còn {Math.max(0, differenceInDays(product.deal.endDate, new Date()))} ngày
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
