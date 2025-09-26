import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { simpleProducts as mockProducts } from '@/data/simpleProducts';
import { SimpleProduct } from '@/types/simple';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductSpecifications from '@/components/ProductSpecifications';
import ProductBreadcrumbs from '@/components/ProductBreadcrumbs';
import RelatedProducts from '@/components/RelatedProducts';
import ProductReviews from '@/components/ProductReviews';
import ProductVariants from '@/components/ProductVariants';
import RecentlyViewed from '@/components/products/RecentlyViewed';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import { recordRecentlyViewed } from '@/utils/recentlyViewed';
import CustomerReviews from '@/components/trust/CustomerReviews';
import AssurancePolicies from '@/components/trust/AssurancePolicies';
import RatingDistribution from '@/components/trust/RatingDistribution';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for variant selection and pricing
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  
  // Cart context
  const { addToCart, isInCart, getItemQuantity } = useSimpleCart();

  // Variant handlers
  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantType]: value }));
  };

  const handlePriceChange = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    try {
      // Add to cart with current selections
      addToCart(product, quantity);
      
      // Show success message
      // You can replace this with a toast notification
      console.log('Added to cart:', {
        product: product.name,
        quantity,
        variants: selectedVariants,
        price: currentPrice
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  // Find product by slug
  const product = useMemo(() => {
    const foundProduct = mockProducts.find(p => p.slug === slug);
    if (foundProduct && currentPrice === 0) {
      setCurrentPrice(foundProduct.sellingPrice);
    }
    return foundProduct;
  }, [slug, currentPrice]);

  // Record recently viewed when product changes
  React.useEffect(() => {
    if (product?.id) {
      recordRecentlyViewed(product.id);
    }
  }, [product?.id]);

  // Simplified breadcrumbs moved to component

  // Handle product not found
  if (!product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found | Global Shopping Assistant</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
              <p className="text-gray-600 mb-6">
                The product you're looking for doesn't exist or has been removed.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/products')}
                className="w-full"
              >
                Back to Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Generate SEO data
  const pageTitle = `${product.name} | Global Shopping Assistant`;
  const pageDescription = product.description.substring(0, 160);
  const canonicalUrl = `${window.location.origin}/products/${product.slug}`;
  const primaryImage = product.images?.[0]?.url || '/placeholder-product.jpg';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${product.name}, ${product.brand?.name}, ${product.origin}, mua hộ, ${product.tags.join(', ')}`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={primaryImage} />
        <meta property="product:price:amount" content={product.sellingPrice.toString()} />
        <meta property="product:price:currency" content={product.currency} />
        <meta property="product:availability" content={product.status === 'available' ? 'in stock' : 'out of stock'} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={primaryImage} />
        
        {/* Structured Data for Google Shopping */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images.map(img => img.url),
            "brand": {
              "@type": "Brand",
              "name": product.brand?.name || "Unknown"
            },
            "sku": product.sku,
            "offers": {
              "@type": "Offer",
              "price": product.sellingPrice,
              "priceCurrency": product.currency,
              "availability": product.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Global Shopping Assistant"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating.average,
              "reviewCount": product.rating.count
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header with breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex-1 min-w-0">
                <ProductBreadcrumbs product={product as any} />
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('productDetail.back')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: pageDescription,
                        url: canonicalUrl
                      });
                    } else {
                      navigator.clipboard.writeText(canonicalUrl);
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('productDetail.share')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = JSON.parse(localStorage.getItem('compare-list') || '[]');
                    if (!current.includes(product.id)) {
                      localStorage.setItem('compare-list', JSON.stringify([...current, product.id]));
                    }
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {t('productDetail.compare')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Image Gallery */}
              <ProductImageGallery images={product.images} productName={product.name} />

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap">
                    <span>{t('productDetail.brand')}: {product.brand?.name || 'Unknown'}</span>
                    {product.category && (
                      <>
                        <span>•</span>
                        <span>{t('productDetail.category')}: {product.category.name}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{t('productDetail.origin')}: {product.origin.toUpperCase()}</span>
                    <span>•</span>
                    <span>{t('productDetail.sku')}: {product.sku}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-l-4 border-gsa-primary pl-4">
                  <div className="text-3xl font-bold text-gsa-primary">
                    {currentPrice.toLocaleString('vi-VN')} {product.currency}
                  </div>
                  {currentPrice !== product.sellingPrice && (
                    <div className="text-sm text-gray-500">
                      {t('productDetail.price.base')}: {product.sellingPrice.toLocaleString('vi-VN')} {product.currency}
                    </div>
                  )}
                  {product.originalPrice && (
                      <div className="text-sm text-gray-600">
                        {t('productDetail.price.original')}: {product.originalPrice.toLocaleString('vi-VN')} {product.currency}
                      </div>
                    )}
                </div>

                {/* Status & Stock */}
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status === 'available'
                      ? t('productDetail.status.available')
                      : product.status === 'preorder'
                        ? t('productDetail.status.preorder')
                        : t('productDetail.status.out_of_stock')}
                  </span>
                  <span className="text-sm text-gray-600">
                    {t('productDetail.stock', { count: product.stock })}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={i < Math.floor(product.rating.average) ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.average}/5 ({product.rating.count} {t('productDetail.reviews')})
                  </span>
                </div>

                {/* Rating distribution */}
                <RatingDistribution average={product.rating.average} count={product.rating.count} />

                {/* Assurance Policies */}
                <AssurancePolicies />

                {/* Product Variants */}
                <ProductVariants 
                  product={product as any} 
                  selectedVariants={selectedVariants} 
                  onVariantChange={handleVariantChange}
                  onPriceChange={handlePriceChange}
                />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('productDetail.description')}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Specifications */}
                <ProductSpecifications product={product as any} />

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('productDetail.tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deal and preorder info temporarily disabled for SimpleProduct */}

                {/* Add to Cart Section */}
                <div className="pt-6 border-t space-y-4">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('productDetail.quantity')}
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-11 h-11 p-0"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-lg font-medium min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-11 h-11 p-0"
                        aria-label="Increase quantity"
                        disabled={quantity >= product.stock}
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-sm text-gray-500 ml-4">
                        {product.stock > 0 ? t('productDetail.stock', { count: product.stock }) : t('productDetail.outOfStock')}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <EnhancedButton
                    size="lg"
                    className="w-full hidden md:inline-flex"
                    variant="gradient"
                    isLoading={isAddingToCart}
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? t('productDetail.addToCart') : t('productDetail.outOfStock')}
                  </EnhancedButton>

                  {/* Current cart status */}
                  {isInCart(product.id) && (
                    <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        ✅ {getItemQuantity(product.id)} item(s) in cart
                      </p>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">{t('productDetail.price.total')}</div>
                    <div className="text-2xl font-bold text-gsa-primary">
                      {(currentPrice * quantity).toLocaleString('vi-VN')} {product.currency}
                    </div>
                    {quantity > 1 && (
                      <div className="text-sm text-gray-500">
                        {currentPrice.toLocaleString('vi-VN')} × {quantity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Recently Viewed */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyViewed excludeId={product.id} />
        </div>

        {/* Product Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 mt-6">
            <div className="pt-2">
              <ProductRecommendations current={product as any} />
            </div>
          </div>
        </div>

        {/* Related Products and Reviews */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <RelatedProducts current={product as any} />
          <ProductReviews product={product as any} />
          <CustomerReviews />
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t z-40 px-4 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">{t('productDetail.total')}</div>
              <div className="text-lg font-bold text-gsa-primary truncate">{(currentPrice * quantity).toLocaleString('vi-VN')} {product.currency}</div>
            </div>
            <EnhancedButton
              variant="gradient"
              size="lg"
              className="flex-1"
              isLoading={isAddingToCart}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? t('productDetail.addToCart') : t('productDetail.outOfStock')}
            </EnhancedButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
