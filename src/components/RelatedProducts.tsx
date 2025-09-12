import React, { useMemo } from 'react';
import { Product } from '@/types/product';
import EnhancedProductCard from './products/EnhancedProductCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { mockProducts } from '../data/products';

interface RelatedProductsProps {
  currentProduct: Product;
  maxItems?: number;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProduct, 
  maxItems = 4 
}) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Algorithm to find related products
  const relatedProducts = useMemo(() => {
    const allProducts = mockProducts.filter(product => product.id !== currentProduct.id);
    
    // Scoring system for related products
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      
      // Same category gets highest score
      if (product.category === currentProduct.category) {
        score += 50;
      }
      
      // Same brand gets high score
      if (product.brand === currentProduct.brand) {
        score += 40;
      }
      
      // Same origin country gets medium score
      if (product.origin === currentProduct.origin) {
        score += 30;
      }
      
      // Similar price range (within 50% difference) gets medium score
      const priceRatio = Math.min(product.sellingPrice, currentProduct.sellingPrice) / 
                         Math.max(product.sellingPrice, currentProduct.sellingPrice);
      if (priceRatio > 0.5) {
        score += 20;
      }
      
      // Same tags get bonus points
      const commonTags = product.tags?.filter(tag => currentProduct.tags?.includes(tag)) || [];
      score += commonTags.length * 10;
      
      // Higher rating products get bonus
      if (product.rating >= 4.5) {
        score += 10;
      }
      
      // Popular products get small bonus
      if (product.ratingCount > 100) {
        score += 5;
      }
      
      // Trending products get small bonus
      if (product.tags?.includes('trending')) {
        score += 5;
      }
      
      // Available products get small bonus (prefer in-stock)
      if (product.status === 'available') {
        score += 3;
      }

      return { product, score };
    });
    
    // Sort by score and return top products
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map(item => item.product);
  }, [currentProduct, maxItems]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = (product: Product) => {
    toggleWishlist(product);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('productDetail.relatedProducts')}
        </h2>
        <p className="text-sm text-gray-500">
          {t('productDetail.basedOnCategory')}
        </p>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group">
            <EnhancedProductCard 
              product={product} 
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isInWishlist(product.id)}
            />
          </div>
        ))}
      </div>

      {/* Alternative layout for mobile - horizontal scroll */}
      <div className="md:hidden mt-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {relatedProducts.map((product) => (
            <div key={`mobile-${product.id}`} className="flex-shrink-0 w-64">
              <EnhancedProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                isWishlisted={isInWishlist(product.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">{t('productDetail.sameCategory')}</p>
            <p className="font-semibold text-primary">
              {relatedProducts.filter(p => p.category === currentProduct.category).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('productDetail.sameBrand')}</p>
            <p className="font-semibold text-primary">
              {relatedProducts.filter(p => p.brand === currentProduct.brand).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('productDetail.sameOrigin')}</p>
            <p className="font-semibold text-primary">
              {relatedProducts.filter(p => p.origin === currentProduct.origin).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('productDetail.avgRating')}</p>
            <p className="font-semibold text-primary">
              {(relatedProducts.reduce((sum, p) => sum + p.rating, 0) / relatedProducts.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
