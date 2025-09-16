import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { SimpleProduct } from '@/types/simple';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSimpleCart } from '@/contexts/SimpleCartContext';

interface SimpleProductCardProps {
  product: SimpleProduct;
  className?: string;
  showWishlist?: boolean;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({
  product,
  className = '',
  showWishlist = true,
}) => {
  const { addToCart, isInCart, getItemQuantity } = useSimpleCart();
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Card className={`group h-full hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link to={`/products/${product.slug}`}>
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={primaryImage?.url || '/placeholder.svg'}
              alt={primaryImage?.alt || product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 space-y-1">
              {product.status === 'preorder' && (
                <Badge variant="secondary" className="bg-orange-500 text-white">
                  Pre-order
                </Badge>
              )}
              {product.featured && (
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
              {product.trending && (
                <Badge variant="secondary" className="bg-red-500 text-white">
                  Trending
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            {showWishlist && (
              <button
                onClick={(e) => e.preventDefault()}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
            
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating.average)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.rating.count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.sellingPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Origin */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {product.origin.toUpperCase()}
              </Badge>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline" className="text-xs text-orange-600">
                  Only {product.stock} left
                </Badge>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.status === 'out_of_stock' 
                ? 'Out of Stock'
                : inCart 
                  ? `In Cart (${cartQuantity})`
                  : 'Add to Cart'
              }
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default SimpleProductCard;