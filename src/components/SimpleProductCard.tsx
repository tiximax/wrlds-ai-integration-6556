import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';
import { SimpleProduct } from '@/types/simple';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import QuickViewModal from '@/components/ui/quick-view-modal';
import { useCompare } from '@/contexts/CompareContext';

interface SimpleProductCardProps {
  product: SimpleProduct;
  className?: string;
  showWishlist?: boolean;
  highlightQuery?: string;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({
  product,
  className = '',
  showWishlist = true,
  highlightQuery,
}) => {
  const [isQuickOpen, setIsQuickOpen] = React.useState(false);
  const { addToCart, isInCart, getItemQuantity } = useSimpleCart();
  const compare = useCompare();
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const renderHighlighted = (text: string) => {
    if (!highlightQuery || !text) return text;
    try {
      const pattern = new RegExp(`(${escapeRegExp(highlightQuery)})`, 'ig');
      const parts = text.split(pattern);
      return (
        <>
          {parts.map((part, i) =>
            pattern.test(part) ? <mark key={i}>{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <>
    <Card className={`group h-full hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link to={`/products/${product.slug}`}>
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={primaryImage?.url || '/placeholder.svg'}
              alt={primaryImage?.alt || product.name}
              className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
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

            {/* Quick View Button */}
            <div className="absolute inset-x-0 bottom-2 flex justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <EnhancedButton
                variant="secondary"
                size="sm"
                className="min-h-[32px] px-3 py-1"
                onClick={(e) => { e.preventDefault(); setIsQuickOpen(true); }}
                data-testid="quick-view-button"
              >
                Quick View
              </EnhancedButton>
            </div>

            {/* Compare Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                compare.add(product.id);
              }}
              className="absolute bottom-2 left-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:bg-gray-50"
              aria-label="Add to compare"
              data-testid="add-to-compare"
            >
              <span className="text-[10px] font-medium text-gray-700">Compare</span>
            </button>

            {/* Wishlist Button */}
            {showWishlist && (
              <WishlistButton product={product as any} className="absolute top-2 right-2" />
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <p className="text-sm text-gray-500 mb-1">{renderHighlighted(product.category.name)}</p>
            
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {renderHighlighted(product.name)}
            </h3>

            {/* Description (snippet) */}
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {renderHighlighted(product.description)}
            </p>

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
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                {product.origin.toUpperCase()}
              </Badge>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs text-orange-600">
                  Only {product.stock} left
                </Badge>
              )}
            </div>

            {/* Add to Cart Button */}
            <EnhancedButton
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
              className="w-full"
              size="sm"
              variant={product.status === 'out_of_stock' ? 'ghost' : (inCart ? 'secondary' : 'primary')}
              leftIcon={<ShoppingCart className="w-4 h-4" />}
            >
              {product.status === 'out_of_stock' 
                ? 'Out of Stock'
                : inCart 
                  ? `In Cart (${cartQuantity})`
                  : 'Add to Cart'
              }
            </EnhancedButton>
          </div>
        </CardContent>
      </Link>
    </Card>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickOpen}
        onClose={() => setIsQuickOpen(false)}
        product={product as any}
        onAddToCart={async (_id, qty) => {
          addToCart(product as any, qty);
        }}
      />
    </>
  );
};

export default SimpleProductCard;