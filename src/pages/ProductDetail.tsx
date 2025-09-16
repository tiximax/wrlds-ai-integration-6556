import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { simpleProducts as mockProducts } from '@/data/simpleProducts';
import { SimpleProduct } from '@/types/simple';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
// Related products temporarily disabled
import { buildBreadcrumbs, generateCategoryUrl } from '@/utils/categoryUtils';

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

  // Get category breadcrumbs
  const categoryBreadcrumbs = useMemo(() => {
    return [];
  }, [product]);

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
              <nav className="flex items-center space-x-2 text-sm text-gray-500 flex-wrap">
                <button 
                  onClick={() => navigate('/')}
                  className="hover:text-gsa-primary transition-colors"
                >
                  {t('common.home')}
                </button>
                <span>/</span>
                <button 
                  onClick={() => navigate('/products')}
                  className="hover:text-gsa-primary transition-colors"
                >
                  {t('products.title')}
                </button>
                
                {/* Category breadcrumbs */}
                {categoryBreadcrumbs.slice(1).map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.id}>
                    <span>/</span>
                    <button 
                      onClick={() => navigate(breadcrumb.url)}
                      className="hover:text-gsa-primary transition-colors"
                    >
                      {breadcrumb.name}
                    </button>
                  </React.Fragment>
                ))}
                
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
              </nav>

              {/* Action buttons */}
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
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
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                {primaryImage ? (
                  <img 
                    src={primaryImage} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p>Product Image</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap">
                    <span>Brand: {product.brand?.name || 'Unknown'}</span>
                    {product.category && (
                      <>
                        <span>•</span>
                        <span>Category: {product.category.name}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Origin: {product.origin.toUpperCase()}</span>
                    <span>•</span>
                    <span>SKU: {product.sku}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-l-4 border-gsa-primary pl-4">
                  <div className="text-3xl font-bold text-gsa-primary">
                    {currentPrice.toLocaleString('vi-VN')} {product.currency}
                  </div>
                  {currentPrice !== product.sellingPrice && (
                    <div className="text-sm text-gray-500">
                      Base price: {product.sellingPrice.toLocaleString('vi-VN')} {product.currency}
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="text-sm text-gray-600">
                      Original: ${product.originalPrice}
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
                    {product.status === 'available' ? '✅ In Stock' : '⏳ Preorder'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {product.stock} units available
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
                    {product.rating.average}/5 ({product.rating.count} reviews)
                  </span>
                </div>

                {/* Product Variants - Temporarily disabled */}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Specifications */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Product Specifications</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">{product.origin.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{product.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{product.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium">{product.stock} units</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-medium">{product.sourceSite}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category.name}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deal Information */}
                {product.deal?.isActive && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-900 mb-2">🔥 Special Deal</h3>
                    <div className="space-y-2">
                      <p className="text-red-800">
                        <span className="font-bold">{product.deal.discountPercent}% OFF</span> - {product.deal.type.replace('_', ' ').toUpperCase()}
                      </p>
                      <div className="flex justify-between text-sm text-red-700">
                        <span>Starts: {new Date(product.deal.startDate).toLocaleDateString()}</span>
                        <span>Ends: {new Date(product.deal.endDate).toLocaleDateString()}</span>
                      </div>
                      {product.deal.type === 'group_buy' && (
                        <div className="text-sm text-red-700">
                          Current: {product.deal.currentQuantity || 0}/{product.deal.minQuantity || 0} orders
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preorder Information */}
                {product.preorderInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">📅 Preorder Information</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>Expected Arrival:</span>
                        <span className="font-medium">{new Date(product.preorderInfo.expectedArrival).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deposit Required:</span>
                        <span className="font-medium">{product.preorderInfo.depositPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Preorders:</span>
                        <span className="font-medium">{product.preorderInfo.currentPreorderCount}/{product.preorderInfo.minPreorderQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Price Range:</span>
                        <span className="font-medium">
                          {product.preorderInfo.estimatedPrice.min.toLocaleString('vi-VN')} - {product.preorderInfo.estimatedPrice.max.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="pt-6 border-t space-y-4">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
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
                        disabled={quantity >= product.stock}
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-sm text-gray-500 ml-4">
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={product.stock <= 0 || isAddingToCart}
                    onClick={handleAddToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </Button>

                  {/* Current cart status */}
                  {isInCart(product.id, selectedVariants) && (
                    <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        ✅ {getItemQuantity(product.id, selectedVariants)} item(s) in cart
                      </p>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">Total Price</div>
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
        
        {/* Related Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <RelatedProducts currentProduct={product} maxItems={4} />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
