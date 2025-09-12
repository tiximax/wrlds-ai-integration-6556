import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { SearchResult } from '@/utils/advancedSearch';
import { getAnalyticsTracker } from '@/utils/searchAnalytics';
import { 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Filter, 
  Eye, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Star, 
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Users,
  ArrowUpDown,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AdvancedSearchResultsProps {
  results: SearchResult[];
  query: string;
  totalResults: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onProductClick?: (product: Product, position: number) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'popularity' | 'newest' | 'name';

interface SortConfig {
  key: SortOption;
  label: string;
  icon: React.ReactNode;
}

interface ResultCardProps {
  result: SearchResult;
  query: string;
  position: number;
  viewMode: ViewMode;
  onProductClick: (product: Product, position: number) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onShare: (product: Product) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  query,
  position,
  viewMode,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  onShare
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = useCallback(() => {
    onProductClick(result.product, position);
    const tracker = getAnalyticsTracker();
    tracker.trackResultClick(result, position, query);
  }, [result, position, query, onProductClick]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(result.product);
  }, [result.product, onAddToCart]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(result.product);
  }, [isWishlisted, result.product, onAddToWishlist]);

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(result.product);
  }, [result.product, onShare]);

  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    let highlightedText = text;
    
    queryWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  }, []);

  const getRelevanceColor = useCallback((score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);

  const discount = result.product.originalPrice && result.product.originalPrice > result.product.sellingPrice
    ? Math.round(((result.product.originalPrice - result.product.sellingPrice) / result.product.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.05 }}
        onClick={handleClick}
        className="flex bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer group"
      >
        {/* Image Section */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <div className="absolute inset-0 bg-gray-100 rounded-l-lg overflow-hidden">
            {!imageLoaded && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 w-full h-full"></div>
              </div>
            )}
            <img
              src={result.product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={result.product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${getRelevanceColor(result.score)}`}>
                {Math.round(result.score * 100)}% match
              </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full shadow-lg transition-colors ${
                  isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-lg transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {result.product.category && (
                <span>{result.product.category.name}</span>
              )}
              {result.product.brand && result.product.category && <span>•</span>}
              {result.product.brand && (
                <span className="font-medium">{result.product.brand.name}</span>
              )}
            </div>

            {/* Product Name */}
            <h3 
              className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
              dangerouslySetInnerHTML={{ __html: highlightText(result.product.name, query) }}
            />

            {/* Description */}
            {result.product.description && (
              <p 
                className="text-gray-600 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{ __html: highlightText(result.product.description, query) }}
              />
            )}

            {/* Matched Fields */}
            {result.matchedFields.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.matchedFields.slice(0, 3).map((field, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                  >
                    Matched: {field}
                  </span>
                ))}
                {result.matchedFields.length > 3 && (
                  <span className="text-xs text-gray-500">+{result.matchedFields.length - 3} more</span>
                )}
              </div>
            )}

            {/* Rating */}
            {result.product.averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(result.product.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {result.product.averageRating.toFixed(1)} ({result.product.totalReviews || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(result.product.sellingPrice)}
                </span>
                {result.product.originalPrice && result.product.originalPrice > result.product.sellingPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(result.product.originalPrice)}
                  </span>
                )}
              </div>
              {result.product.inStock ? (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!result.product.inStock}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: position * 0.05 }}
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        )}
        <img
          src={result.product.images?.[0]?.url || '/placeholder-product.jpg'}
          alt={result.product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${getRelevanceColor(result.score)}`}>
            {Math.round(result.score * 100)}%
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-lg transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-lg transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Quick view functionality
            }}
            className="p-2 bg-white text-gray-600 hover:text-green-500 rounded-full shadow-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {result.product.category && <span>{result.product.category.name}</span>}
          {result.product.brand && <span className="font-medium">{result.product.brand.name}</span>}
        </div>

        {/* Product Name */}
        <h3 
          className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm"
          dangerouslySetInnerHTML={{ __html: highlightText(result.product.name, query) }}
        />

        {/* Rating */}
        {result.product.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(result.product.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {result.product.averageRating.toFixed(1)} ({result.product.totalReviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(result.product.sellingPrice)}
            </span>
            {result.product.originalPrice && result.product.originalPrice > result.product.sellingPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(result.product.originalPrice)}
              </span>
            )}
          </div>
          {result.product.inStock ? (
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!result.product.inStock}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

const AdvancedSearchResults: React.FC<AdvancedSearchResultsProps> = ({
  results,
  query,
  totalResults,
  isLoading = false,
  onLoadMore,
  onProductClick = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onShare = () => {},
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([]);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const sortOptions: SortConfig[] = [
    { key: 'relevance', label: 'Best Match', icon: <Zap className="h-4 w-4" /> },
    { key: 'popularity', label: 'Most Popular', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'price_asc', label: 'Price: Low to High', icon: <SortAsc className="h-4 w-4" /> },
    { key: 'price_desc', label: 'Price: High to Low', icon: <SortDesc className="h-4 w-4" /> },
    { key: 'rating', label: 'Customer Rating', icon: <Award className="h-4 w-4" /> },
    { key: 'newest', label: 'Newest First', icon: <Clock className="h-4 w-4" /> },
    { key: 'name', label: 'Name A-Z', icon: <ArrowUpDown className="h-4 w-4" /> }
  ];

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...results];
    
    switch (sortBy) {
      case 'relevance':
        return sorted.sort((a, b) => b.score - a.score);
      case 'price_asc':
        return sorted.sort((a, b) => a.product.sellingPrice - b.product.sellingPrice);
      case 'price_desc':
        return sorted.sort((a, b) => b.product.sellingPrice - a.product.sellingPrice);
      case 'rating':
        return sorted.sort((a, b) => b.product.averageRating - a.product.averageRating);
      case 'popularity':
        return sorted.sort((a, b) => (b.product.totalReviews || 0) - (a.product.totalReviews || 0));
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.product.createdAt || 0).getTime() - new Date(a.product.createdAt || 0).getTime()
        );
      case 'name':
        return sorted.sort((a, b) => a.product.name.localeCompare(b.product.name));
      default:
        return sorted;
    }
  }, [results, sortBy]);

  // Set up infinite scroll
  useEffect(() => {
    setDisplayedResults(sortedResults);
  }, [sortedResults]);

  const loadMoreCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && onLoadMore && !isLoading && results.length < totalResults) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, results.length, totalResults]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(loadMoreCallback, {
      threshold: 1.0,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreCallback]);

  if (!results.length && !isLoading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any products matching "<strong>{query}</strong>"
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Try:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Checking your spelling</li>
            <li>Using different keywords</li>
            <li>Using more general terms</li>
            <li>Removing filters</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {isLoading && results.length === 0 ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <>
                Showing <span className="font-semibold">{displayedResults.length}</span> of{' '}
                <span className="font-semibold">{totalResults}</span> results for{' '}
                <span className="font-semibold">"{query}"</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOptions.find(option => option.key === sortBy)?.icon}
              <span className="text-sm font-medium">
                {sortOptions.find(option => option.key === sortBy)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                >
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSortBy(option.key);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          sortBy === option.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option.icon}
                        {option.label}
                        {sortBy === option.key && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }
      `}>
        <AnimatePresence>
          {displayedResults.map((result, index) => (
            <ResultCard
              key={result.product.id}
              result={result}
              query={query}
              position={index}
              viewMode={viewMode}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onShare={onShare}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Loading More Indicator */}
      {results.length < totalResults && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more results...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
              Load More Results
            </button>
          )}
        </div>
      )}

      {/* Results Summary */}
      {results.length >= totalResults && totalResults > 0 && (
        <div className="text-center py-6 text-gray-600">
          <p>You've seen all {totalResults} results for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchResults;
