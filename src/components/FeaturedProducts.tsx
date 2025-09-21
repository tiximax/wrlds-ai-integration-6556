import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { simpleProducts } from '@/data/simpleProducts';
import { EnhancedButton } from '@/components/ui/enhanced-button';

const FeaturedProducts = () => {
  const { addToCart } = useSimpleCart();
  
  // Get featured products (first 4)
  const featuredProducts = simpleProducts.slice(0, 4);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof featuredProducts[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products from around the world
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredProducts.map((product) => {
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
            
            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <Link to={`/products/${product.slug}`}>
                    <CardContent className="p-0">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={primaryImage?.url || '/placeholder.svg'}
                          alt={primaryImage?.alt || product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          {product.status === 'preorder' && (
                            <Badge className="bg-orange-500 text-white">
                              Pre-order
                            </Badge>
                          )}
                          {product.featured && (
                            <Badge className="bg-blue-500 text-white">
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Quick Add to Cart */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-10 h-10 p-0 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-primary shadow-lg"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Category */}
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                          {product.category.name}
                        </p>
                        
                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating.average)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({product.rating.count})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(product.sellingPrice)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.sellingPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          
                          <Badge variant="outline" className="text-xs">
                            {product.origin.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
<Link to="/products">
            <EnhancedButton variant="gradient" size="lg" rightIcon={<ArrowRight className="w-5 h-5 ml-2 transition-transform" />}>
              View All Products
            </EnhancedButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;