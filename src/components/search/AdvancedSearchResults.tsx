import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Filter,
  Search,
  Eye,
  Heart,
  ShoppingCart,
  Star,
  TrendingUp,
  Clock,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowUp,
  Share2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { SearchResult } from '@/utils/advancedSearch';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSort?: (sortBy: string, direction: 'asc' | 'desc') => void;
  onViewChange?: (view: 'grid' | 'list') => void;
  className?: string;
  showAnalytics?: boolean;
  enableInfiniteScroll?: boolean;
  highlightResults?: boolean;
  showFilters?: boolean;
}

type ViewMode = 'grid' | 'list';
type SortOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevance', icon: <Target className="w-4 h-4" /> },
  { value: 'price-low', label: 'Price: Low to High', icon: <SortAsc className="w-4 h-4" /> },
  { value: 'price-high', label: 'Price: High to Low', icon: <SortDesc className="w-4 h-4" /> },
  { value: 'rating', label: 'Customer Rating', icon: <Star className="w-4 h-4" /> },
  { value: 'newest', label: 'Newest First', icon: <Clock className="w-4 h-4" /> },
  { value: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'popularity', label: 'Most Popular', icon: <Eye className="w-4 h-4" /> }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const highlightVariants = {
  initial: { backgroundColor: "transparent" },
  highlight: { 
    backgroundColor: "rgb(254, 240, 138)", // yellow-200
    transition: { duration: 0.3 }
  },
  normal: { 
    backgroundColor: "transparent",
    transition: { duration: 0.3 }
  }
};

const AdvancedSearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onSort,
  onViewChange,
  className,
  showAnalytics = true,
  enableInfiniteScroll = true,
  highlightResults = true,
  showFilters = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const isLoadMoreInView = useInView(loadMoreRef);

  // Handle infinite scroll
  useEffect(() => {
    if (isLoadMoreInView && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [isLoadMoreInView, hasMore, isLoading, onLoadMore]);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      if (resultsContainerRef.current) {
        const scrollTop = resultsContainerRef.current.scrollTop;
        setShowScrollTop(scrollTop > 500);
      }
    };

    const container = resultsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Analytics data
  const analytics = useMemo(() => {
    const totalResults = results.length;
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / totalResults || 0;
    const topScore = Math.max(...results.map(r => r.score), 0);
    const matchedFields = new Set(results.flatMap(r => r.matchedFields));
    
    return {
      totalResults,
      avgScore,
      topScore,
      matchedFields: Array.from(matchedFields),
      avgMatchedFields: results.reduce((sum, r) => sum + r.matchedFields.length, 0) / totalResults || 0
    };
  }, [results]);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: string) => {
    const newDirection = newSortBy === sortBy && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortDirection(newDirection);
    if (onSort) {
      onSort(newSortBy, newDirection);
    }
  }, [sortBy, sortDirection, onSort]);

  // Handle view mode change
  const handleViewModeChange = useCallback((newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    if (onViewChange) {
      onViewChange(newViewMode);
    }
  }, [onViewChange]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Highlight text with search query
  const highlightText = (text: string, highlights: Record<string, string>) => {
    if (!highlightResults || !highlights[text]) {
      return text;
    }
    
    // Use the pre-generated highlights from search results
    return (
      <span 
        dangerouslySetInnerHTML={{ 
          __html: highlights[text] || text 
        }} 
      />
    );
  };

  // Product card component
  const ProductCard = ({ result, index }: { result: SearchResult; index: number }) => {
    const { product, score, matchedFields, highlights } = result;
    const isSelected = selectedResults.has(product.id);
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      addToCart(product);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
      e.preventDefault();
      if (inWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    };

    const handleToggleSelect = (e: React.MouseEvent) => {
      e.preventDefault();
      const newSelected = new Set(selectedResults);
      if (isSelected) {
        newSelected.delete(product.id);
      } else {
        newSelected.add(product.id);
      }
      setSelectedResults(newSelected);
    };

    if (viewMode === 'list') {
      return (
        <motion.div
          variants={itemVariants}
          className={cn(
            "flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 group",
            isSelected && "ring-2 ring-blue-500"
          )}
          whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          {/* Product Image */}
          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {product.images?.[0]?.url ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Search className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {highlightText(product.name, highlights)}
                </h3>
                {product.brand && (
                  <p className="text-sm text-gray-600">
                    {highlightText(product.brand.name, highlights)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 ml-4">
                {showAnalytics && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round(score * 100)}% match
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleToggleSelect}>
                      {isSelected ? 'Deselect' : 'Select'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-2">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(product.rating?.average || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.rating.count})
                  </span>
                </div>
              )}
              <div className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  maximumFractionDigits: 0
                }).format(product.sellingPrice)}
              </div>
            </div>

            {highlights.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {highlightText(product.description || '', highlights)}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {matchedFields.slice(0, 3).map(field => (
                  <Badge key={field} variant="secondary" className="text-xs">
                    {field}
                  </Badge>
                ))}
                {matchedFields.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{matchedFields.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleWishlist}
                  className={cn(
                    "transition-colors",
                    inWishlist && "text-red-500 hover:text-red-600"
                  )}
                >
                  <Heart className={cn("w-4 h-4", inWishlist && "fill-red-500")} />
                </Button>
                <Button size="sm" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Grid view
    return (
      <motion.div
        variants={itemVariants}
        className={cn(
          "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group",
          isSelected && "ring-2 ring-blue-500"
        )}
        whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Search className="w-12 h-12" />
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleWishlist}
              className="bg-white/90 hover:bg-white"
            >
              <Heart className={cn("w-4 h-4", inWishlist && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>

          {/* Score Badge */}
          {showAnalytics && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs bg-white/90">
                {Math.round(score * 100)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
            {highlightText(product.name, highlights)}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-600 mb-2">
              {highlightText(product.brand.name, highlights)}
            </p>
          )}

          <div className="flex items-center justify-between mb-2">
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.floor(product.rating?.average || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({product.rating.count})
                </span>
              </div>
            )}
          </div>

          <div className="text-lg font-bold text-gray-900 mb-3">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0
            }).format(product.sellingPrice)}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {matchedFields.slice(0, 2).map(field => (
              <Badge key={field} variant="secondary" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={cn(
      "grid gap-4",
      viewMode === 'grid' 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
        : "grid-cols-1"
    )}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {analytics.totalResults.toLocaleString()}
            </span> results for "{query}"
          </div>
          {showAnalytics && analytics.totalResults > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Avg Score: {Math.round(analytics.avgScore * 100)}%
              </Badge>
              <Badge variant="outline" className="text-xs">
                Top: {Math.round(analytics.topScore * 100)}%
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Options */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="rounded-l-none border-l"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && analytics.totalResults > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 rounded-lg p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.totalResults}
              </div>
              <div className="text-sm text-blue-800">Total Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(analytics.avgScore * 100)}%
              </div>
              <div className="text-sm text-green-800">Avg Relevance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.avgMatchedFields.toFixed(1)}
              </div>
              <div className="text-sm text-purple-800">Avg Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.matchedFields.length}
              </div>
              <div className="text-sm text-orange-800">Field Types</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Container */}
      <div
        ref={resultsContainerRef}
        className="relative max-h-screen overflow-y-auto"
      >
        {isLoading && results.length === 0 ? (
          <LoadingSkeleton />
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "grid gap-4",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            )}
          >
            {results.map((result, index) => (
              <ProductCard
                key={result.product.id}
                result={result}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Infinite Scroll Loader */}
        {enableInfiniteScroll && hasMore && (
          <div ref={loadMoreRef} className="text-center py-8">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-gray-600">Loading more results...</span>
              </div>
            ) : (
              <Button onClick={onLoadMore} variant="outline">
                Load More Results
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              className="rounded-full w-12 h-12 shadow-lg"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchResults;
