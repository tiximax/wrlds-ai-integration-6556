import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Heart,
  Share2,
  Eye
} from 'lucide-react';
import { Product } from '@/types/product';
import EnhancedProductCard from './EnhancedProductCard';
import QuickViewModal from '@/components/ui/quick-view-modal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EnhancedProductGridProps {
  products: Product[];
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalResults: number;
  itemsPerPage?: number;
  layout?: 'grid' | 'list';
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  wishlistedProducts?: Set<string>;
  onToggleWishlist?: (productId: string) => void;
}

const EnhancedProductGrid: React.FC<EnhancedProductGridProps> = ({
  products,
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
  isLoading = false,
  totalResults,
  itemsPerPage = 12,
  layout = 'grid',
  onLayoutChange,
  showFilters = true,
  onToggleFilters,
  wishlistedProducts = new Set(),
  onToggleWishlist
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  // Pagination
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalResults);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Handlers
  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      await addToCart(product, quantity);
      toast.success(`Added ${product.name} to cart!`, {
        description: `Quantity: ${quantity}`,
        action: {
          label: 'View Cart',
          onClick: () => console.log('Open cart') // This should open cart sidebar
        }
      });
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: 'Please try again later.'
      });
    }
  };

  const handleToggleWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    onToggleWishlist?.(productId);
    
    const isWishlisted = wishlistedProducts.has(productId);
    if (isWishlisted) {
      toast.success(`Removed ${product.name} from wishlist`);
    } else {
      toast.success(`Added ${product.name} to wishlist`, {
        icon: '💖'
      });
    }
  };

  const handleQuickView = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  const handleShare = async (product: Product) => {
    const shareData = {
      title: product.name,
      text: product.shortDescription || product.description,
      url: `${window.location.origin}/products/${product.slug}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Product link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share product');
    }
  };

  // Pagination helpers
  const goToPage = (page: number) => {
    onPageChange(page);
    // Smooth scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1);
        range.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        range.push(1);
        range.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      }
    }
    
    return range;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for controls */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-48 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        
        {/* Loading skeleton for grid */}
        <motion.div 
          className={cn(
            "grid gap-6",
            layout === 'grid' 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white rounded-lg shadow-sm border"
      >
        <div className="space-y-4">
          <motion.div 
            className="text-6xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔍
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Controls Row */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 font-medium">
            {totalResults.toLocaleString()} products
          </Badge>
          <div className="w-px h-6 bg-gray-300" />
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-px h-6 bg-gray-300" />
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}-{endIndex}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filters Toggle */}
          {showFilters && onToggleFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          )}
          
          {/* Layout Toggle */}
          {onLayoutChange && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('grid')}
                className="w-8 h-8 p-1"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLayoutChange('list')}
                className="w-8 h-8 p-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Enhanced Product Grid/List */}
      <motion.div 
        className={cn(
          "grid gap-6",
          layout === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              layout
              layoutId={product.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                layout: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
            >
              <EnhancedProductCard
                product={product}
                layout={layout}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
                onShare={handleShare}
                isWishlisted={wishlistedProducts.has(product.id)}
                priority={index < 4} // Prioritize first 4 images
                showQuickView={true}
                showWishlist={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <motion.div 
          className="flex justify-center items-center gap-2 bg-white p-4 rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {getPaginationRange().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleToggleWishlist}
        onShare={handleShare}
        isWishlisted={quickViewProduct ? wishlistedProducts.has(quickViewProduct.id) : false}
      />
    </div>
  );
};

export default EnhancedProductGrid;
